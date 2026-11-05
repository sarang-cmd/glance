# push-commits.ps1
# Splits the Glance project files into several logical commits and pushes them to your EXISTING GitHub repo.
# Run it from the project folder (the one containing README.md and docs/). Requires git and a signed-in GitHub CLI (gh).
#
# Usage:
#   .\push-commits.ps1                  # repo "glance" on your account, branch "main"
#   .\push-commits.ps1 -Repo my-repo    # different repo name
#   .\push-commits.ps1 -DryRun          # show what would be committed, change nothing
#
# Commit dates are the real time you run this; nothing is backdated.

param(
    [string]$Repo = "glance",
    [string]$Branch = "main",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Git {
    & git @args
    if ($LASTEXITCODE -ne 0) { throw "git $($args -join ' ') failed (exit $LASTEXITCODE)" }
}

# 1. Check tools and login
foreach ($tool in "git", "gh") {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "$tool is not installed or not on PATH." }
}
& gh auth status *> $null
if ($LASTEXITCODE -ne 0) { throw "gh is not signed in. Run: gh auth login" }

$login = (& gh api user --jq .login).Trim()
$slug  = "$login/$Repo"
& gh repo view $slug *> $null
if ($LASTEXITCODE -ne 0) { throw "Repo $slug was not found. Check the name, or pass -Repo <name>." }
Write-Host "Target repo: https://github.com/$slug  (branch: $Branch)" -ForegroundColor Cyan

# 2. Make sure git knows who you are
$name  = (& git config user.name)
$email = (& git config user.email)
if (-not $name -or -not $email) {
    throw "git user.name / user.email are not set. Run: git config --global user.name 'Your Name'; git config --global user.email 'you@example.com'"
}

# 3. Set up the local repo and sync with the remote
if (-not (Test-Path ".git")) { Git init -b $Branch }
$remotes = & git remote
if ($remotes -notcontains "origin") { Git remote add origin "https://github.com/$slug.git" }

Git fetch origin
& git rev-parse --verify --quiet "origin/$Branch" *> $null
$remoteHasBranch = ($LASTEXITCODE -eq 0)
& git rev-parse --verify --quiet HEAD *> $null
$localHasCommits = ($LASTEXITCODE -eq 0)

Git branch -M $Branch
if ($remoteHasBranch) {
    if (-not $localHasCommits) {
        # Fresh local folder: adopt the remote history but keep the files on disk as they are.
        Git reset "origin/$Branch"
    } else {
        Git pull --rebase origin $Branch
    }
}

# 4. The commits, in order. Groups with no changes are skipped automatically.
$groups = @(
    @{ Message = "chore: add MIT license and .gitignore";                    Paths = @("LICENSE", ".gitignore") },
    @{ Message = "docs: add product requirements document (v0.2)";           Paths = @("docs/PRD.md") },
    @{ Message = "docs: add hero image for the README";                      Paths = @("assets/hero.png", "assets/hero.svg") },
    @{ Message = "docs: add README with overview, widgets and roadmap";      Paths = @("README.md") },
    @{ Message = "chore: add repo setup and push scripts";                   Paths = @("create-repo.ps1", "create-repo.sh", "push-commits.ps1") }
)

$made = 0
foreach ($g in $groups) {
    $existing = @($g.Paths | Where-Object { Test-Path $_ })
    if ($existing.Count -eq 0) { continue }

    if ($DryRun) {
        $pending = & git status --porcelain -- @existing
        if ($pending) { Write-Host "[dry run] would commit: $($g.Message)" -ForegroundColor Yellow; $pending | ForEach-Object { Write-Host "    $_" } }
        continue
    }

    Git add -- @existing
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { continue }   # nothing staged for this group
    Git commit -m $g.Message
    $made++
}

# Anything else that changed (new files, edits) goes into one final commit.
if (-not $DryRun) {
    Git add -A
    & git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        Git commit -m "chore: update remaining project files"
        $made++
    }
}

if ($DryRun) { Write-Host "Dry run finished. Nothing was changed." -ForegroundColor Yellow; return }

# 5. Push
if ($made -eq 0) {
    Write-Host "Nothing new to commit. Repo is up to date." -ForegroundColor Green
    return
}
Git push -u origin $Branch
Write-Host "Pushed $made commit(s) to https://github.com/$slug" -ForegroundColor Green
& git log --oneline -n $made

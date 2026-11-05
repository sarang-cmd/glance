# Creates the public GitHub repo "glance", sets description and topics, and pushes this folder.
# Requires: git and the GitHub CLI (gh), signed in with `gh auth login`.
$ErrorActionPreference = "Stop"
$desc = "Ad-free, Apple-style lock screen widgets for Windows 11: battery stats, habit rings, calendar and tasks."
$topics = "windows-11,windows-widgets,lock-screen,widgets,windows-app-sdk,winui,csharp,msix,adaptive-cards,habit-tracker,productivity,battery,dashboard,apple-design"

git init -b main
git add .
git commit -m "Initial commit: README, PRD v0.2 and hero image"
gh repo create glance --public --description $desc --source=. --remote=origin --push
gh repo edit --add-topic $topics
Write-Host "Done: https://github.com/$(gh api user --jq .login)/glance"

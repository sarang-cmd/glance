#!/usr/bin/env bash
# Creates the public GitHub repo "glance", sets description and topics, and pushes this folder.
# Requires: git and the GitHub CLI (gh), signed in with `gh auth login`.
set -euo pipefail
DESC="Ad-free, Apple-style lock screen widgets for Windows 11: battery stats, habit rings, calendar and tasks."
TOPICS="windows-11,windows-widgets,lock-screen,widgets,windows-app-sdk,winui,csharp,msix,adaptive-cards,habit-tracker,productivity,battery,dashboard,apple-design"

git init -b main
git add .
git commit -m "Initial commit: README, PRD v0.2 and hero image"
gh repo create glance --public --description "$DESC" --source=. --remote=origin --push
gh repo edit --add-topic "$TOPICS"
echo "Done: https://github.com/$(gh api user --jq .login)/glance"

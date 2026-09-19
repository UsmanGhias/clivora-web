#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
TMP="${TMPDIR:-/tmp}/clivora-web-push-$$"
rm -rf "$TMP"
mkdir -p "$TMP"
cp -a "$ROOT/." "$TMP/"
cd "$TMP"
rm -rf .git node_modules .next
git init -b main
git config user.name "Usman Ghias"
git config user.email "ranausmang1009@gmail.com"
git add .
git commit -m "CLIVORA web sync"
REMOTE="${CLIVORA_WEB_REMOTE:-https://github.com/UsmanGhias/clivora-web.git}"
git remote add origin "$REMOTE"
# Never print the remote URL (may contain a PAT).
git push -u origin main --force
echo "Pushed to UsmanGhias/clivora-web (main)"

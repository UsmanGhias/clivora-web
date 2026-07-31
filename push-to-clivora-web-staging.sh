#!/usr/bin/env bash
# Push web/ to UsmanGhias/clivora-web on branch "staging" ONLY.
# Never touches clivora-web main (production / clivora.io).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
TMP="${TMPDIR:-/tmp}/clivora-web-staging-push-$$"
BRANCH="${CLIVORA_WEB_STAGING_BRANCH:-staging}"
REMOTE="${CLIVORA_WEB_REMOTE:-git@github.com:UsmanGhias/clivora-web.git}"

rm -rf "$TMP"
mkdir -p "$TMP"
cp -a "$ROOT/." "$TMP/"
cd "$TMP"
rm -rf .git node_modules .next
git init -b "$BRANCH"
git config user.name "Usman Ghias"
git config user.email "ranausmang1009@gmail.com"
git add .
git commit -m "CLIVORA web staging sync"
git remote add origin "$REMOTE"
git push -u origin "HEAD:refs/heads/${BRANCH}" --force
echo "Pushed to UsmanGhias/clivora-web (${BRANCH}) — production main untouched"

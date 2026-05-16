#!/usr/bin/env bash
# deploy-modio.sh — Build and tag a release zip for mod.io upload
#
# Usage:
#   ./deploy-modio.sh              # auto-bump patch version
#   ./deploy-modio.sh --version X.Y.Z   # explicit version

set -e
cd "$(dirname "$0")"

# ── Parse args ──────────────────────────────────────────
EXPLICIT_VERSION=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --version) EXPLICIT_VERSION="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ── Guard: clean working tree ───────────────────────────
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ Uncommitted changes. Commit or stash before releasing."
  exit 1
fi

# ── Determine version ───────────────────────────────────
CURRENT_VERSION=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
if [[ -n "$EXPLICIT_VERSION" ]]; then
  NEW_VERSION="$EXPLICIT_VERSION"
else
  # Auto-bump patch
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
  NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
fi

PREV_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

echo "Current version: $CURRENT_VERSION"
echo "New version:     $NEW_VERSION"
echo "Previous tag:    ${PREV_TAG:-none}"

# ── Changelog ───────────────────────────────────────────
if [[ -n "$PREV_TAG" ]]; then
  CHANGELOG_ENTRY=$(git log "$PREV_TAG"..HEAD --pretty=format:"- %s" 2>/dev/null)
else
  CHANGELOG_ENTRY="- Initial release"
fi

echo ""
echo "── Changelog entry ──"
echo "## [$NEW_VERSION] - $(date +%Y-%m-%d)"
echo ""
echo "$CHANGELOG_ENTRY"
echo ""

# ── Update files ────────────────────────────────────────
# Bump version in manifest.json
python3 -c "
import json
with open('manifest.json') as f: d = json.load(f)
d['version'] = '$NEW_VERSION'
with open('manifest.json', 'w') as f: json.dump(d, f, indent=2)
print()
"

# Update version badge in README.md
perl -pi -e 's|(version-)[\d.]+(-orange)|${1}'"$NEW_VERSION"'${2}|' README.md

# ── Changelog file ──────────────────────────────────────
CHANGELOG_FILE="CHANGELOG.md"
if [[ ! -f "$CHANGELOG_FILE" ]]; then
  echo "# Changelog" > "$CHANGELOG_FILE"
  echo "" >> "$CHANGELOG_FILE"
fi

ENTRY="## [$NEW_VERSION] - $(date +%Y-%m-%d)\n\n$CHANGELOG_ENTRY\n"
EXISTING=$(cat "$CHANGELOG_FILE")
printf "%s\n\n%s" "$(head -2 "$CHANGELOG_FILE")" "$ENTRY" > "$CHANGELOG_FILE"
echo "$EXISTING" | tail -n +3 >> "$CHANGELOG_FILE"

# ── Pause for README review ─────────────────────────────
echo ""
echo "─────────────────────────────────────────────────"
echo "  README.md version badge updated to v$NEW_VERSION."
echo "  Press Enter to commit, or Ctrl-C to abort."
echo "─────────────────────────────────────────────────"
read -r

# ── Commit + tag ────────────────────────────────────────
git add manifest.json README.md CHANGELOG.md
git commit -m "release: v$NEW_VERSION

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git tag "v$NEW_VERSION"

# ── Zip ─────────────────────────────────────────────────
mkdir -p dist
ZIP_NAME="torchlight-timer-v$NEW_VERSION.zip"
zip -j "dist/$ZIP_NAME" manifest.json index.html style.css script.js README.md CHANGELOG.md logo.jpg

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✓ Released v$NEW_VERSION"
echo "  ✓ Tagged:   v$NEW_VERSION"
echo "  ✓ Zip:      dist/$ZIP_NAME"
echo ""
echo "  Upload $ZIP_NAME to mod.io manually."
echo "═══════════════════════════════════════════════════"

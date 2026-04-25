#!/bin/bash
# Deploy Torchlight Timer to TaleSpire's local Symbiotes folder (macOS)
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="$HOME/Library/Application Support/com.bouncyrock.talespire/Symbiotes/torchlight-timer"

mkdir -p "$DEST"
cp "$SRC/manifest.json" "$DEST/"
cp "$SRC/index.html"    "$DEST/"
cp "$SRC/style.css"     "$DEST/"
cp "$SRC/script.js"     "$DEST/"

echo "✓ Deployed to: $DEST"
ls -lh "$DEST"

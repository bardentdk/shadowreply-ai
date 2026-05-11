#!/usr/bin/env bash
# ShadowReply AI — Script de packaging de l'extension
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$DIR/../public/extension"
ZIP_NAME="shadowreply-extension.zip"

echo "🔨 Génération des icônes..."
node "$DIR/generate-icons.mjs"

echo "📦 Packaging de l'extension..."
mkdir -p "$OUT_DIR"

# Crée le zip depuis le répertoire browser-extension
cd "$DIR"
zip -r "$OUT_DIR/$ZIP_NAME" . \
  --exclude "*.sh" \
  --exclude "generate-icons.mjs" \
  --exclude "*.md" \
  --exclude ".DS_Store" \
  --exclude "__MACOSX/*"

echo "✅ Extension packagée : public/extension/$ZIP_NAME"
echo "   $(du -h "$OUT_DIR/$ZIP_NAME" | cut -f1) — prête pour distribution"

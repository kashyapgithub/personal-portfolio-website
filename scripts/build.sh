#!/usr/bin/env bash
# Rebuild the minified assets served by index.html.
# Edit assets/css/styles.css and assets/js/*.js, then run this script.
set -euo pipefail
cd "$(dirname "$0")/.."

esbuild() {
  npx --yes esbuild@0.28.2 "$@"
}

esbuild assets/css/styles.css --minify --outfile=assets/css/styles.min.css
esbuild assets/js/grok-bot.js --minify --outfile=assets/js/grok-bot.min.js
esbuild assets/js/main.js --minify --outfile=assets/js/main.min.js
esbuild assets/js/chapters.js --minify --outfile=assets/js/chapters.min.js

echo "Built minified CSS + JS."

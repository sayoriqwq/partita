#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-"$ROOT/dist/mini-waza.zip"}"
case "$OUT" in
  /*) ;;
  *) OUT="$ROOT/$OUT" ;;
esac

mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"

cd "$ROOT"

RAW_MANIFEST="$(mktemp)"
MANIFEST="$(mktemp)"
FILTERED_MANIFEST="$(mktemp)"
STAGE="$(mktemp -d)"
VALIDATE_DIR="$(mktemp -d)"
trap 'rm -f "$RAW_MANIFEST" "$MANIFEST" "$FILTERED_MANIFEST"; rm -rf "$STAGE" "$VALIDATE_DIR"' EXIT

git ls-files --cached --others --exclude-standard > "$RAW_MANIFEST"
while IFS= read -r path; do
  [ -e "$path" ] && printf '%s\n' "$path"
done < "$RAW_MANIFEST" > "$MANIFEST"
python3 "$ROOT/scripts/packaging_filter.py" "$ROOT/packaging.allowlist" \
  < "$MANIFEST" > "$FILTERED_MANIFEST"

mkdir -p "$STAGE"
if [ -s "$FILTERED_MANIFEST" ]; then
  tar -cf - -T "$FILTERED_MANIFEST" | (cd "$STAGE" && tar -xf -)
fi

if [ ! -f "$ROOT/.codex-plugin/plugin.json" ]; then
  echo "ERROR: .codex-plugin/plugin.json missing; run make regenerate" >&2
  exit 1
fi

(cd "$STAGE" && find . -type f | sed 's#^\./##' | sort | zip -q "$OUT" -@)

rm -rf "$VALIDATE_DIR"
mkdir -p "$VALIDATE_DIR"
unzip -q "$OUT" -d "$VALIDATE_DIR"
python3 "$ROOT/scripts/validate_package.py" "$VALIDATE_DIR"

SIZE="$(wc -c < "$OUT" | tr -d ' ')"
echo "OK: wrote $OUT (${SIZE} bytes)"

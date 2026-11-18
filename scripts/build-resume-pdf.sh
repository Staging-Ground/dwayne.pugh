#!/usr/bin/env bash
# Build assets/dwayne-pugh-resume.pdf from resume.md.
#
# How: serve the repo on localhost, open resume-print.html in headless Chrome
# (it renders resume.md with js/resume.js, the same renderer the site uses),
# and print it to PDF. A local server is needed because browsers block
# fetch() of resume.md over file://.
#
# Usage:  scripts/build-resume-pdf.sh            (run after editing resume.md)
#         CHROME=/path/to/chrome scripts/build-resume-pdf.sh
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="$repo/assets/dwayne-pugh-resume.pdf"

chrome="${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)}"
if [[ -z "$chrome" ]]; then
  echo "error: Chrome/Chromium not found; set CHROME=/path/to/chrome" >&2
  exit 1
fi

port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1])')"
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$repo" >/dev/null 2>&1 &
server=$!
trap 'kill "$server" 2>/dev/null || true' EXIT

for _ in $(seq 1 50); do
  curl -fs "http://127.0.0.1:$port/resume.md" >/dev/null && break
  sleep 0.1
done

mkdir -p "$repo/assets"
tmp="$(mktemp --suffix=.pdf)"
"$chrome" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf="$tmp" \
  "http://127.0.0.1:$port/resume-print.html" 2>/dev/null

if [[ ! -s "$tmp" ]]; then
  echo "error: Chrome produced no PDF" >&2
  exit 1
fi
mv "$tmp" "$out"

pages="$(python3 -c 'import re,sys; d=open(sys.argv[1],"rb").read(); print(len(re.findall(rb"/Type\s*/Page\b", d)))' "$out")"
echo "wrote ${out#"$repo"/} ($pages pages)"

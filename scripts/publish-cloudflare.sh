#!/usr/bin/env bash
set -euo pipefail

# Build the Daily Brief and publish the whole static site to Cloudflare Pages.
# Run this from cron/systemd on the outbound-only server.
#
# Required for model-written summaries:
#   GEMINI_API_KEY=...
# Without the key the pipeline still runs, but every card falls back to a
# labelled source excerpt.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PROJECT="${CLOUDFLARE_PAGES_PROJECT:-bonzili}"
STAGE="$(mktemp -d /tmp/bonzili-pages.XXXXXX)"
trap 'rm -rf "$STAGE"' EXIT

python3 -m unittest discover -s dailybrief-pipeline/tests

if [[ -n "${GEMINI_API_KEY:-}" ]]; then
  python3 dailybrief-pipeline/run.py --out dailybrief/data
else
  echo "GEMINI_API_KEY is not set; building with extractive summaries." >&2
  python3 dailybrief-pipeline/run.py --no-llm --out dailybrief/data
fi

rsync -a --delete \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.dev' \
  --exclude='.agents' \
  --exclude='dailybrief-pipeline' \
  --exclude='sync-worker' \
  --exclude='scripts' \
  --exclude='tests' \
  --exclude='node_modules' \
  --exclude='skills-lock.json' \
  --exclude='CNAME' \
  ./ "$STAGE/"

npx --yes wrangler pages deploy "$STAGE" \
  --project-name "$PROJECT" \
  --branch main \
  --commit-dirty=true \
  --commit-message "Daily Brief $(TZ=Asia/Hong_Kong date '+%Y-%m-%d %H:%M HKT')"

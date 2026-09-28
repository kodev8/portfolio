#!/usr/bin/env bash
#
# Mirror the R2 bucket into ./public so the app and the e2e suite can run with
# no network at all.
#
# Credentials are read from the environment and never written to disk by this
# script. Put them in your shell profile or a .env you keep out of git:
#
#   export R2_ACCOUNT_ID=...
#   export R2_ACCESS_KEY_ID=...
#   export R2_SECRET_ACCESS_KEY=...
#   export R2_BUCKET=...
#
# Create the key pair under R2 > Manage API tokens with Object Read access.
#
# Usage:
#   npm run assets:sync              # download anything missing or changed
#   npm run assets:sync -- --dry-run # show what would change
#   SKIP_VIDEOS=1 npm run assets:sync
#   MIRROR=1 npm run assets:sync     # exact mirror, DELETES local-only files

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v rclone >/dev/null 2>&1; then
  echo "rclone is not installed. brew install rclone" >&2
  exit 1
fi

missing=()
for var in R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET; do
  [[ -n "${!var:-}" ]] || missing+=("$var")
done

if (( ${#missing[@]} )); then
  echo "Missing required environment variables: ${missing[*]}" >&2
  echo "See the comment at the top of scripts/sync-assets.sh." >&2
  exit 1
fi

# Configure the remote purely through the environment so nothing lands in
# ~/.config/rclone/rclone.conf.
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

# `copy` by default: it never deletes. public/ already holds files that are not
# in the bucket (vite.svg and friends), and a stray `sync` would remove them.
# MIRROR=1 opts into true mirroring.
mode=copy
if [[ "${MIRROR:-}" == "1" ]]; then
  mode=sync
  echo "MIRROR=1: local files absent from the bucket will be DELETED." >&2
  echo "Re-run with --dry-run first if you are unsure." >&2
fi

args=(
  "$mode" "r2:${R2_BUCKET}" ./public
  --progress
  --transfers 16
  --checkers 16
  # R2 has no useful mtime, so compare on size + checksum instead.
  --checksum
)

if [[ "${SKIP_VIDEOS:-}" == "1" ]]; then
  args+=(--exclude "videos/**")
fi

echo "${mode}: r2:${R2_BUCKET} -> ./public"
rclone "${args[@]}" "$@"

echo
echo "Done. $(find public -type f | wc -l | tr -d ' ') files, $(du -sh public | cut -f1) on disk."
echo "Build with VITE_MODE=development to serve these instead of the CDN."

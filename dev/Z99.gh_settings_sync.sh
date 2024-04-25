#!/bin/bash

# Load ./.env.sh for the GH_ACCESS_TOKEN if not present.
if [ -z "${GH_ACCESS_TOKEN}" ]; then
  . ./.env.sh
fi

# Validate 'deno' is installed.
DENO=$(command -v deno)
if [ -z "${DENO}" ]; then
    echo "'deno' must be installed. See: https://docs.deno.com/runtime/manual/getting_started/installation"
    exit 1
fi

# Validate 'sed' is installed.
SED=$(command -v sed)
if [ -z "${SED}" ]; then
    echo "'sed' must be installed."
    exit 1
fi

# Determine repo slug.
CURRENT_REPO=$(git remote get-url --push origin | sed 's/.*.com\///' | sed 's/.*.com//' | sed 's/://' | sed 's/.git//')

# Call gh_settings_sync from main mod.ts.
$DENO cache -r 'https://raw.githubusercontent.com/xCykrix/gh_settings_sync/main/mod.ts'
$DENO run -A \
    'https://raw.githubusercontent.com/xCykrix/gh_settings_sync/main/mod.ts' \
    -T "$GH_ACCESS_TOKEN" \
    -R "$CURRENT_REPO" \
    --octoherd-bypass-confirms

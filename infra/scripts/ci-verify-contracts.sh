#!/usr/bin/env sh
set -eu
NETWORK="${1:-amoy}"
pnpm --filter @trustify/contracts verify:${NETWORK}

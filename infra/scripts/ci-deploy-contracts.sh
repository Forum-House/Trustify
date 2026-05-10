#!/usr/bin/env sh
set -eu
NETWORK="${1:-amoy}"
pnpm --filter @trustify/contracts build
pnpm --filter @trustify/contracts deploy:${NETWORK}
pnpm --filter @trustify/contracts export:abis

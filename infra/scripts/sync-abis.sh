#!/usr/bin/env sh
set -eu
pnpm --filter @trustify/contracts build
pnpm --filter @trustify/contracts export:abis
echo "ABIs synced to packages/config/src/abis and infra/deployments/abis"

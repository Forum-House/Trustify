# Trustify Monorepo

Trustify is a Web3 document authenticity platform built as a pnpm monorepo.

## Workspaces
- `apps/web`: Next.js App Router frontend (public verify + issuer/admin apps)
- `packages/contracts`: Solidity contracts, tests, deployment scripts
- `packages/web3`: Shared Wagmi/Viem hooks and contract interaction layer
- `packages/config`: Shared types, constants, route map, typed ABIs
- `infra`: Deployment artifacts and CI helper scripts

## Install
```bash
pnpm install
```

## Common Commands
```bash
pnpm dev
pnpm build
pnpm type-check
pnpm lint
```

# Trustify Deployment Guide (Step by Step)

This guide covers local, Amoy, and Polygon deployment using Hardhat.

## 1. Prerequisites
- Node.js `22` (see `.nvmrc`)
- pnpm `11+`
- Funded wallet for target chain
- Polygonscan API key (for verification)

## 2. Environment Setup
Create root `.env` from `infra/environments/.env.example`:

```bash
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_RPC_URL=https://polygon-rpc.com
DEPLOYER_PRIVATE_KEY=0x...
POLYGONSCAN_API_KEY=...
PINATA_JWT=...
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

## 3. Install Dependencies
```bash
pnpm install
```

If prompted by pnpm security:
```bash
pnpm approve-builds
```
Select: `esbuild`, `keccak`, `secp256k1`.

## 4. Compile Contracts
```bash
pnpm --filter @trustify/contracts build
```

## 5. Deploy Contracts (Fast Path)
### Localhost
Terminal A:
```bash
pnpm --filter @trustify/contracts exec hardhat node
```
Terminal B:
```bash
pnpm contracts:deploy:localhost
```

### Polygon Amoy
```bash
pnpm contracts:deploy:amoy
```

### Polygon Mainnet
```bash
pnpm contracts:deploy:polygon
```

Deployment metadata is written to:
- `infra/deployments/localhost.json`
- `infra/deployments/amoy.json`
- `infra/deployments/polygon.json`

## 6. Export ABIs
```bash
pnpm contracts:export
```

Exports:
- Runtime TS ABIs: `packages/config/src/abis/*.abi.ts`
- Infra JSON ABIs: `infra/deployments/abis/*.json`

## 7. Verify on Polygonscan
```bash
pnpm contracts:verify:amoy
pnpm contracts:verify:polygon
```

## 8. Optional Safety Step: Run Tests
```bash
pnpm --filter @trustify/contracts test
```

## 9. CI-style Commands
```bash
sh infra/scripts/ci-deploy-contracts.sh amoy
sh infra/scripts/ci-verify-contracts.sh amoy
sh infra/scripts/sync-abis.sh
```

# Trustify

**Trustify** is a decentralized document issuance and verification protocol built on the Polygon blockchain. It enables institutions (Issuers) to issue verifiable credentials with privacy and cryptographic integrity, while providing administrators with a robust governance panel.

## 🏗 Project Architecture

This is a monorepo managed with `pnpm` and `Turborepo`.

- **`apps/web`**: Next.js 15 dashboard for Admins and Issuers.
- **`packages/contracts`**: Solidity smart contracts and Hardhat deployment scripts.
- **`packages/web3`**: Unified logic layer for on-chain state fetching and Wagmi hooks.
- **`packages/config`**: Shared ABI definitions, chain configurations, and TypeScript types.
- **`infra`**: Deployment metadata and contract address tracking.

---

## 🚀 Setup & Installation Guide

Follow these steps in order to get the project running from scratch.

### 1. Prerequisites
- **Node.js**: v18+ (v20 recommended)
- **pnpm**: `npm install -g pnpm`
- **Wallet**: MetaMask or equivalent with Polygon Amoy POL for deployment.

### 2. Clone and Install
```bash
git clone https://github.com/Forum-House/Trustify.git
cd Trustify
pnpm install
```

### 3. Environment Configuration
The project uses environment variables for blockchain connection, IPFS storage, and security proxying.

1. **Root Configuration**: Copy the root template:
   ```bash
   cp .env.example .env
   ```
2. **Package Configuration**: For your convenience, templates are also available in sub-packages:
   - `packages/contracts/.env.example` (Deployer Private Key)
   - `apps/web/.env.example` (API Secrets & IPFS JWT)

**Required Variables**:
- `DEPLOYER_PRIVATE_KEY`: Your wallet's private key for deployment.
- `PINATA_JWT`: Your Pinata API token for IPFS storage.
- `NEXT_PUBLIC_CHAIN_KEY`: Set to `amoy` for the testnet.

### 4. Smart Contract Deployment (Amoy)
Navigate to the contracts package to deploy your protocol.
```bash
cd packages/contracts
# Check balance and gas price before deploying
npx hardhat run scripts/deploy-all.ts --network amoy
```
*Note: This will automatically update `infra/deployments/amoy.json` with your new contract addresses.*

### 5. Start the Web Dashboard
```bash
# Return to root
cd ../..
pnpm dev
```
Visit `http://localhost:3000` to access the dashboard.

---

## 🛠 Tech Stack
- **Blockchain**: Polygon (Amoy Testnet)
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Shadcn UI
- **Smart Contracts**: Solidity 0.8.20 (OpenZeppelin)
- **Web3 Interface**: Viem, Wagmi v2
- **Storage**: IPFS (via Pinata)

## 🛡 Security & Optimization
- **State-Driven Architecture**: Lists (Issuers, Documents) are stored in enumerable on-chain arrays to avoid brittle RPC log-scanning.
- **Event Pagination**: Historical activity logs use optimized block-range batching starting from the `DEPLOYMENT_BLOCK` to ensure 100% RPC reliability.

---
**Trustify** - Securing the future of digital credentials.

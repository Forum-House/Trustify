# @trustify/contracts

The core smart contract logic for the Trustify Protocol. Built with Solidity and managed using Hardhat.

## 📄 Contracts Overview

### 1. `TrustifyAccessControl.sol`
- **Purpose**: Manages protocol governance and issuer authorization.
- **Roles**: 
  - `DEFAULT_ADMIN_ROLE`: Can approve/revoke issuers and pause the protocol.
  - `ISSUER_ROLE`: Granted to organizations authorized to register documents.
- **Key Feature**: Maintains an enumerable `allIssuers` array for gas-efficient frontend lookups.

### 2. `TrustifyRegistry.sol`
- **Purpose**: Secure document anchoring and lifecycle management.
- **Capabilities**:
  - `registerDocument`: Anchors content hashes to the blockchain.
  - `revokeDocument`: Invalidates a record with a specific reason.
  - `supersedeDocument`: Cryptographically links an updated document to an old version.
  - `verifyDocument`: Public O(1) verification of any document hash.

---

## 🚀 Development & Deployment

### Setup
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Set your `DEPLOYER_PRIVATE_KEY` in the newly created `.env` file.

### Deployment Commands
```bash
# Full automated deployment
npx hardhat run scripts/deploy-all.ts --network amoy

# Manual staged deployment
npx hardhat run scripts/deploy-step-1-access-control.ts --network amoy
npx hardhat run scripts/deploy-step-2-registry.ts --network amoy
```

### Administrative Scripts
Manage the protocol directly from the CLI using these scripts.

#### 1. Approve an Issuer
Approves an organization to start issuing documents.
```bash
ISSUER_ADDRESS="0x..." ISSUER_NAME="Stanford" ISSUER_SECTOR="education" \
npx hardhat run scripts/approve-issuer.ts --network amoy
```

#### 2. Add a Protocol Admin
Adds a new administrator to the protocol.
```bash
ADMIN_ADDRESS="0x..." ROLE_TYPE="FULL" \
npx hardhat run scripts/add-admin.ts --network amoy
```

#### 3. Verify Contracts
Verifies the source code on Polygonscan (requires `POLYGONSCAN_API_KEY`).
```bash
npx hardhat run scripts/verify-contracts.ts --network amoy
```

#### 4. Export ABIs
Syncs the latest contract ABIs to the `@trustify/config` package.
```bash
npx hardhat run scripts/export-abis.ts
```

### Deployment Flow
We use a staged deployment strategy to ensure reliability on public testnets:
1. **Step 1**: Deploys Access Control and establishes the Admin.
2. **Step 2**: Deploys the Registry and links it to the Access Control address.
3. **Metadata**: Addresses are automatically saved to `../../infra/deployments/amoy.json`.

---

## 🛠 Tech Specs
- **Compiler**: Solidity 0.8.20
- **Standard**: OpenZeppelin AccessControl, Pausable, ReentrancyGuard.
- **Network**: Polygon Amoy (ChainID: 80002)

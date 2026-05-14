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

### Commands
```bash
# Compile contracts
npx hardhat compile

# Run unit tests
npx hardhat test

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy-all.ts --network amoy
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

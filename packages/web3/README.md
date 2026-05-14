# @trustify/web3

The unified Web3 logic layer for the Trustify Protocol. This package abstracts the complexity of blockchain interactions into clean, performant React hooks and event fetchers.

## 📦 Features

### 🎣 Custom Hooks
- **`useAllIssuers`**: Fetches the complete list of issuers using direct on-chain state (no log scanning).
- **`useIssuerDocuments`**: Retrieves all document hashes issued by a specific wallet.
- **`useVerifyDocument`**: Provides instant, reactive verification status for any document hash.
- **`useApproveIssuer` / `useRevokeIssuer`**: Administrative functions for protocol governance.

### 📜 Event Indexing
- **`getActivityEvents`**: A high-performance protocol timeline.
  - **Unified**: Merges events from both Registry and Access Control.
  - **Optimized**: Uses `DEPLOYMENT_BLOCK` and `BATCH_SIZE` to prevent RPC timeouts.
  - **Historical**: Restores full chronological history (Registration -> Revocation -> Supersession).

---

## 🛠 Internal Architecture

### 1. Client Management (`client.ts`)
Creates a unified Viem public client configured for Polygon Amoy with optimized transport settings.

### 2. Deployment Constants (`constants.ts`)
Stores critical metadata like `DEPLOYMENT_BLOCK_AMOY` to ensure event scans are surgical and fast.

### 3. Shared Logic
Everything in this package is exported via a central `index.ts`, making it the "source of truth" for the `apps/web` frontend.

---

## 🚀 Usage
```typescript
import { useAllIssuers, useRegistryStats } from "@trustify/web3";

const { loadIssuers } = useAllIssuers();
const { totalDocuments } = useRegistryStats();
```

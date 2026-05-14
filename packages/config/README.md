# @trustify/config

The central configuration and asset package for the Trustify Protocol. It ensures that ABIs, types, and constants are synchronized across the entire monorepo.

## 📦 Contents

### 1. 📜 ABIs (`src/abis`)
Contains the authoritative TypeScript ABI definitions for:
- `TrustifyAccessControl`
- `TrustifyRegistry`
*These include the new state-driven getters (`getAllIssuers`, `getAllDocumentHashes`) added during the production hardening phase.*

### 2. 🏗 Types (`src/types`)
Centralized TypeScript interfaces for:
- `DocumentRecord`
- `IssuerProfile`
- `VerificationResult`

### 3. 🌐 Chains (`src/chains`)
Wagmi/Viem chain configurations for Polygon Amoy and local development environments.

---

## 🚀 Why this package?
By centralizing these assets, we prevent "desync" bugs where the frontend thinks a contract has a different interface than what is actually deployed. It serves as the single source of truth for the protocol's structure.

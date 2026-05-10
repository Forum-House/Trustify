# @trustify/contracts

Smart contract workspace.

## Contains
- `contracts/`: Solidity contracts (`TrustifyAccessControl`, `TrustifyRegistry`)
- `test/`: Hardhat test suites for roles + document lifecycle
- `scripts/`: deployment, verification, issuer admin, ABI export scripts
- `deployments/`: per-network address outputs
- `abis/`: generated ABI JSON files

## Purpose
Owns on-chain logic and deployment lifecycle. Frontend never imports Solidity directly; it consumes exported ABIs/types through shared packages.

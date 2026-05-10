# @trustify/config

Shared cross-workspace config and types.

## Contains
- `src/types`: domain types (`Document`, `Issuer`, `Verification`, `Role`, `Activity`)
- `src/constants`: routes, chains, sectors, contract constants
- `src/abis`: typed ABI exports (`as const`) for Wagmi/Viem inference

## Why ABIs Here
`contracts/` generates raw ABI artifacts, while this package exposes stable, typed ABI imports for app/runtime usage.

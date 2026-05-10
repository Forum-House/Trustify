# @trustify/web3

Shared Web3 integration layer used by frontend.

## Contains
- `client.ts`: viem client setup
- `contracts.ts`: typed contract bindings
- `hooks/auth`: role resolution hooks
- `hooks/admin`: issuer management + admin stats hooks
- `hooks/issuer`: register/revoke/supersede and issuer document hooks
- `hooks/verifier`: public verification hooks
- `events/`: chain activity log readers

## Purpose
Centralizes blockchain reads/writes so UI remains thin and reusable.

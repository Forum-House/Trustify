# @trustify/web

Next.js 15 App Router frontend.

## Structure
- `src/app/(public)`: wallet-free pages (landing, verify)
- `src/app/(app)`: authenticated app surfaces (admin, issuer)
- `src/components/guards`: UI access guards (wallet/network/role) with inline modals
- `src/components/modals`: unauthorized, not-approved, and wrong-network modals
- `src/components/{admin,issuer,verification,layout,wallet}`: domain UI modules
- `src/hooks`: frontend-only hooks (e.g. client hashing)
- `src/lib`: app providers and client adapters

## Notes
- Uses shared packages: `@trustify/config` and `@trustify/web3`
- No contract logic should live directly in pages; use shared hooks

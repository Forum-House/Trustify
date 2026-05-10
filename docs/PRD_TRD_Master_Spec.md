# Trustify — Master Product & Technical Specification

**Document Version:** 1.0  
**Project Code:** IT1P2  
**Hackathon:** Indore BGI Hackathon 2026 — Theme 1: Cybersecurity, Blockchain & Digital Trust  
**Authors:** Trustify Engineering Team  
**Last Updated:** May 2026  
**Status:** Final Draft — Ready for Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Opportunity](#2-problem-statement--opportunity)
3. [Product Requirements (PRD)](#3-product-requirements-prd)
   - 3.1 Personas & Roles
   - 3.2 Detailed User Journeys
   - 3.3 Feature Requirements (MVP)
   - 3.4 Non-Functional Requirements
   - 3.5 Success Metrics
4. [Technical Requirements & Design (TRD)](#4-technical-requirements--design-trd)
   - 4.1 Technology Stack
   - 4.2 High-Level Solution Architecture
   - 4.3 System Component Design
   - 4.4 Data Models
   - 4.5 Smart Contract Specification
   - 4.6 Frontend Architecture
   - 4.7 Storage Strategy
   - 4.8 Security Framework
   - 4.9 API & Integration Layer
   - 4.10 Sequence Diagrams
5. [Full Folder Structure — All Parts](#5-full-folder-structure--all-parts)
   - 5.1 Monorepo Root
   - 5.2 Frontend (apps/web)
   - 5.3 Smart Contracts (packages/contracts)
   - 5.4 Shared Web3 Layer (packages/web3)
   - 5.5 Shared Config & Types (packages/config)
   - 5.6 Infrastructure (infra/)
   - 5.7 Documentation (docs/)
6. [Development Plan & Build Order](#6-development-plan--build-order)
7. [Evaluation Criteria Mapping](#7-evaluation-criteria-mapping)

---

## 1. Executive Summary

Trustify is a decentralized Web 3.0 document authentication platform built on blockchain technology. It solves the fundamental trust problem in traditional document verification — centralized registries can be manipulated, paper trails are forgeable, and verification is slow and geographically constrained.

Trustify enables trusted issuers (universities, hospitals, government bodies, corporations) to register cryptographic fingerprints of their issued documents immutably on a public blockchain. Any verifier — without creating an account — can drag and drop any document into the platform and receive an instant, tamper-proof answer: is this document authentic, revoked, expired, superseded, or unknown?

The system achieves this by computing a SHA-256 hash of the document on the client, uploading the actual file to IPFS via Pinata for decentralized storage, and anchoring the hash plus structured metadata in a Solidity smart contract deployed on Polygon Amoy testnet. Role-based access control enforced on-chain ensures that only approved issuers can register documents, and only the admin can manage issuers. Every action is publicly auditable on Polygonscan.

The full stack consists of a Next.js 15 App Router frontend with Wagmi/Viem for Web3 wallet integration, OpenZeppelin AccessControl for role management, a custom DocumentRegistry smart contract for document lifecycle management, Hardhat for contract testing and deployment, and Pinata/IPFS for decentralized file storage.

---

## 2. Problem Statement & Opportunity

### 2.1 The Core Problem

Every day, millions of documents — academic degrees, medical records, legal contracts, government IDs, employment certificates — change hands between people and institutions. Every verification today depends on one of three fragile mechanisms:

**Calling someone.** An employer calls a university to verify a degree. The process takes days, requires human intermediaries, and fails entirely when the institution is in a different country or time zone.

**Trusting a stamp or seal.** Physical or digital signatures on PDFs can be forged. Image editing software makes it trivially easy to modify text while preserving formatting. A forged certificate looks identical to a real one to most reviewers.

**Centralized databases.** Many sectors maintain internal verification portals, but these are operated by the same institution that issues the documents — creating a conflict of interest and a single point of failure. If the database is hacked, manipulated, or taken offline, verification becomes impossible.

These failures are not theoretical. According to global fraud research, resume fraud affects roughly 75% of hiring processes in some form, fake academic credentials are submitted in hundreds of thousands of job applications annually, and medical credential fraud represents a patient safety crisis in healthcare systems worldwide.

### 2.2 The Blockchain Solution

A public blockchain provides exactly the properties needed to solve this problem. It is immutable — once a hash is written, it cannot be changed without rewriting the entire chain history, which is computationally infeasible. It is transparent — every record is publicly auditable without trusting any single institution. It is decentralized — no single party controls the registry. And it is instant — verification is a simple hash lookup, not a human phone call.

By storing document hashes (not documents themselves) on-chain, Trustify achieves privacy (the actual content never leaves the issuer's control unless they choose IPFS storage), scalability (hashes are tiny), and immutability (blockchain records are permanent).

### 2.3 Why Polygon?

Trustify deploys on Polygon Amoy testnet (and eventually Polygon mainnet) rather than Ethereum mainnet for several reasons: Polygon's transaction fees are a fraction of a cent compared to Ethereum's potentially high gas costs; Polygon is fully EVM-compatible, meaning all Solidity contracts and Wagmi tooling work identically; Polygon's finality is near-instant at roughly 2 seconds compared to Ethereum's 12+ seconds; and Polygon's testnet (Amoy) provides a realistic environment that mirrors production behavior.

---

## 3. Product Requirements (PRD)

### 3.1 Personas & Roles

Trustify serves four distinct user personas, each with different goals, technical literacy levels, and interaction patterns.

**The Platform Admin** is a technically sophisticated superuser who sets up and governs the entire registry. They are responsible for approving which organizations are trusted issuers, revoking issuers if they are compromised, and monitoring system-wide activity. The admin connects with a wallet that holds the `DEFAULT_ADMIN_ROLE` on the smart contract. In practice, this would be the organization running the Trustify registry — for the hackathon context, this is the deployer's wallet.

**The Issuer** is an organization or institution that has been approved by the admin to register documents. Issuers represent entities like universities (issuing degrees), hospitals (issuing medical certificates), government departments (issuing licenses), law firms (certifying legal documents), and corporate HR departments (issuing employment letters). Issuers interact with a dedicated dashboard, connect their wallet (which must hold the `ISSUER_ROLE`), and go through a multi-step registration wizard for each document they wish to anchor on chain. They can also revoke or supersede documents they have previously issued.

**The Verifier** is anyone who needs to check a document's authenticity — an employer reviewing a job applicant's degree, an immigration officer checking a certificate, a patient verifying a medical report. The verifier has no account and needs no wallet. They simply visit the public verification portal, drag and drop the document in question, and receive an instant, cryptographically-backed verdict. This zero-friction verification experience is the primary value proposition of the platform.

**The Document Holder** is the individual who possesses a document that an issuer has registered — a student, patient, employee, or citizen. They benefit passively from the system: they can hand their document to any verifier with confidence that authenticity can be proven instantly. In a future version, holders could have their own portal to view and share their document records.

### 3.2 Detailed User Journeys

#### Journey 1: Admin Sets Up the Registry

When the admin first visits Trustify after contract deployment, they connect their wallet using the "Connect Wallet" button in the header. Trustify detects the wallet address, queries the smart contract's `hasRole(DEFAULT_ADMIN_ROLE, address)` function, and resolves the role. Because the deployer address holds this role automatically at construction, the admin is immediately recognized.

The admin lands on their dashboard showing global KPIs: total registered documents, total approved issuers, documents revoked, and recent activity. When a new organization (e.g., a university) wants to join Trustify as an issuer, they provide their wallet address to the admin off-platform (via email or application form). The admin visits the Manage Issuers page, enters the wallet address and optional issuer metadata (name, sector, contact), and submits the approval transaction. The smart contract's `grantRole(ISSUER_ROLE, address)` function executes, and the issuer is now able to register documents.

If an issuer is found to have registered fraudulent documents or their wallet is compromised, the admin can revoke them from the same Manage Issuers page. After revocation, the issuer's wallet can no longer call `registerDocument`. Previously registered documents from that issuer remain on-chain (immutable) but are flagged in the UI as coming from a revoked issuer.

#### Journey 2: Issuer Registers a Document

An approved issuer (e.g., a university registrar) logs into Trustify with their wallet. The system verifies `hasRole(ISSUER_ROLE, address)` is true. If it returns false, the issuer sees an "Approval Pending" or "Not Approved" banner instead of the registration tools.

Once approved, the issuer clicks "Register New Document" and enters a four-step wizard.

In Step 1 (Upload), they drag and drop the original document file (PDF, image, etc.). Trustify computes the SHA-256 hash of the file entirely client-side using the Web Crypto API — the file never leaves the browser at this stage. The hash is displayed as a hex string for transparency. The file is simultaneously queued for upload to IPFS via the Pinata API.

In Step 2 (Metadata), the issuer fills in structured information: the holder's name and ID number, the document type (degree certificate, medical report, legal affidavit, etc.), the sector (education, healthcare, legal, government, corporate), the issue date, and optionally an expiry date (useful for licenses, medical certificates, etc.). They can also add a document title and any notes.

In Step 3 (Review), a complete summary is shown — the computed hash, the IPFS CID returned from Pinata, all metadata fields, and the gas cost estimate for the on-chain transaction. The issuer can go back to edit any step or proceed.

In Step 4 (Confirm), the issuer signs the transaction in their wallet. Trustify calls `registerDocument(hash, cid, holderName, holderId, documentType, sector, issuedAt, expiresAt)` on the DocumentRegistry contract. Upon transaction confirmation, a success receipt appears showing the document hash, the Polygonscan transaction link, and a shareable verification link. The document appears in the issuer's "My Documents" library.

#### Journey 3: Verifier Checks a Document

A recruiter receives a job applicant's degree certificate as a PDF attachment. They visit Trustify's public verification page (no wallet, no account). They drag and drop the PDF into the large verification drop zone.

Trustify computes the SHA-256 hash client-side and calls `verifyDocument(hash)` on the contract as a read-only call (no gas, no wallet). Within 1–3 seconds, a result card appears.

If the document was registered, the result card shows green with the label "Authentic" and displays the issuer's name and wallet address, the document type and sector, the registration date, the issue date, expiry date if applicable, a link to the IPFS-stored document, and a link to the Polygonscan transaction for independent verification.

If the document was tampered with (even a single pixel change creates a completely different SHA-256 hash), the result shows red with the label "Tampered / Not Found." The recruiter knows not to trust the document.

If the document was revoked by the issuer, the result shows orange with "Revoked" and includes the revocation date and reason provided by the issuer.

If the document has expired (the current timestamp exceeds the on-chain expiresAt value), the result shows yellow with "Expired" and shows when it expired.

If a newer version of the document exists (the issuer used the supersede function to replace it with an updated version), the result shows blue with "Superseded" and points to the newer document hash.

#### Journey 4: Issuer Revokes or Supersedes a Document

An issuer discovers that a document was registered with an error (e.g., wrong expiry date). They visit their dashboard, find the document in their library, and select "Supersede." They upload the corrected version, which goes through the same registration flow with a special flag linking the new hash to the old one. The old record's status becomes `Superseded` on-chain.

Alternatively, if the issuer needs to revoke a document entirely (e.g., a certificate was issued fraudulently or the holder's status was revoked), they select "Revoke," provide a reason, and sign the transaction. The document's status becomes `Revoked` on-chain with a timestamp and reason.

### 3.3 Feature Requirements (MVP)

**F-01: Wallet-Based Authentication.** The platform supports wallet connection via WalletConnect and MetaMask through Wagmi/Viem. Wallet connection triggers automatic role resolution by querying the smart contract. Admin and Issuer roles are enforced at both the UI level (route guards) and contract level (onlyRole modifiers). Verifiers need no wallet.

**F-02: Document Hashing.** Client-side SHA-256 hashing via the browser's native Web Crypto API (`crypto.subtle.digest('SHA-256', buffer)`). Hashing must handle files of any common size (up to 50MB for MVP). The hash is displayed to the user in hex format. No file content is sent to any backend server at this stage — only the hash leaves the browser.

**F-03: IPFS Storage via Pinata.** After hashing, the file is uploaded to IPFS using the Pinata API with the issuer's JWT. The returned CID is stored on-chain alongside the hash, enabling verifiers who want the actual document to retrieve it from the IPFS gateway. This is optional — issuers can choose to register hash-only without uploading to IPFS.

**F-04: Document Registration.** The four-step wizard collects hash, CID, holder name, holder ID, document type, sector (enum), issue date, and expiry date. The wizard validates all required fields before enabling the confirm step. The transaction is submitted via Wagmi's `useWriteContract` hook. Transaction lifecycle states (idle, pending, confirming, success, error) are displayed with appropriate UI feedback.

**F-05: Verification Portal.** A public, wallet-free drag-and-drop interface. Accepts any file type. Computes hash and calls `verifyDocument` as a read-only contract call. Displays one of five result states: Valid, Revoked, Expired, Superseded, or Not Found. Each result state includes a complete evidence panel with issuer details, timestamps, metadata, and blockchain proof links.

**F-06: Document Library for Issuers.** A paginated, filterable grid/table view of all documents registered by the connected issuer's wallet. Filter options include status (active, revoked, superseded, expired), sector, document type, and date range. Each document card shows a summary and links to the detail drawer.

**F-07: Revoke & Supersede.** Issuers can revoke any document they have registered by providing a reason string. They can supersede a document by uploading a replacement, which goes through the same wizard with an additional field linking the old hash.

**F-08: Admin Issuer Management.** The admin can view all registered issuers in a table showing wallet address, name, sector, approval date, and current status. The admin can approve new issuers by entering a wallet address. The admin can revoke an issuer, which calls `revokeRole` on the contract.

**F-09: Activity Log.** The admin can view a real-time feed of all contract events: `DocumentRegistered`, `DocumentRevoked`, `DocumentSuperseded`, `IssuerApproved`, `IssuerRevoked`. Events are pulled from the contract's event logs using Viem's `getLogs` and displayed in reverse chronological order with Polygonscan links.

**F-10: Role Guards.** Route-level protection using Wagmi hooks. The wallet guard redirects unauthenticated users to connect wallet. The network guard redirects users on the wrong chain to a network-switch prompt. The role guard redirects users to the appropriate shell based on their on-chain role.

**F-11: Multi-Sector Support.** The sector enum includes: Education, Healthcare, Legal, Government, and Corporate. Sector is stored on-chain and displayed prominently in verification results and document cards.

### 3.4 Non-Functional Requirements

**Security.** Document content is never sent to any Trustify server — only cryptographic hashes are handled server-side. Smart contract functions are protected by OpenZeppelin's `AccessControl` with `onlyRole` modifiers. Frontend role guards prevent unauthorized route access. Private keys never touch the Trustify application — all signing happens in the user's wallet. IPFS files, while publicly retrievable by CID, do not expose any Trustify-specific sensitive information because CIDs are stored on-chain only (not in the UI by default).

**Performance.** Client-side SHA-256 hashing of a 10MB PDF should complete in under 500ms on a modern device using the Web Crypto API. The verification flow (hash computation + contract read + UI render) must complete in under 3 seconds on a standard broadband connection. Polygon Amoy block finality is approximately 2 seconds, so transaction confirmation feedback appears within 5–8 seconds of signing.

**Reliability.** The verification path is a read-only contract call with no dependency on any Trustify-controlled backend. As long as a public Polygon Amoy RPC endpoint is available, verification works even if the Trustify frontend is temporarily unavailable. IPFS content is replicated across Pinata's infrastructure and persisted via Pinata's pinning service.

**Scalability.** The smart contract uses a `bytes32` mapping for document hashes, enabling O(1) lookup regardless of registry size. IPFS scales horizontally. The Next.js frontend is deployed to Vercel's edge network, which auto-scales under load.

**Usability.** The verification portal requires zero technical knowledge — no wallet, no account, no blockchain awareness needed. The issuer wizard uses progressive disclosure, showing only what is needed at each step. Clear error messages explain blockchain-specific concepts (gas, transaction pending) in plain language.

**Auditability.** Every state change emits an on-chain event with full details and a timestamp. The Polygonscan link for every document and issuer action allows independent third-party verification without any reliance on Trustify's frontend.

### 3.5 Success Metrics

The primary measure of hackathon success is demonstrating a complete, working prototype that showcases the full document lifecycle: admin approves issuer → issuer registers document → verifier confirms authenticity → issuer revokes document → verifier sees revocation. Secondary metrics include the number of verification result states demonstrated (target: all 5), completeness of role separation, quality of the security framework, and the clarity of the presentation narrative.

---

## 4. Technical Requirements & Design (TRD)

### 4.1 Technology Stack

The technology selection is driven by the existing project setup, hackathon time constraints, and production-grade best practices.

**Frontend:** Next.js 15 (App Router) with TypeScript. React 19. Tailwind CSS for styling. shadcn/ui for component primitives. Lucide React for icons.

**Web3 Integration:** Wagmi v2 for React hooks over EVM chains. Viem v2 as the underlying Ethereum client library. WalletConnect v2 / RainbowKit for wallet modal UI. Polygon Amoy testnet as the deployment target.

**Smart Contracts:** Solidity ^0.8.24. OpenZeppelin Contracts 5.x for AccessControl, Pausable, and ReentrancyGuard. Hardhat v2 for compilation, testing, and deployment scripting.

**Storage:** Pinata SDK and API for IPFS pinning. Browser's native Web Crypto API for client-side SHA-256 hashing. No custom backend server.

**Tooling & DevX:** pnpm workspaces for monorepo management. TypeScript across all packages. ESLint + Prettier. Hardhat's local network for development. Polygon Amoy faucet for testnet MATIC. Polygonscan Amoy for contract verification and explorer links.

### 4.2 High-Level Solution Architecture

The architecture follows a three-layer model: the user's browser, the blockchain network, and the decentralized storage network. There is deliberately no traditional backend server in the verification critical path — this is a key architectural principle that ensures Trustify cannot be a single point of failure.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Next.js 15 Frontend (Vercel)               │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │   │
│  │  │  Public  │  │  Issuer  │  │        Admin         │   │   │
│  │  │ /verify  │  │ /issuer  │  │       /admin         │   │   │
│  │  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘   │   │
│  │       │              │                    │               │   │
│  │  ┌────▼──────────────▼────────────────────▼───────────┐  │   │
│  │  │            Wagmi/Viem Web3 Layer                   │  │   │
│  │  │   useReadContract / useWriteContract / hooks       │  │   │
│  │  └──────────────────────┬─────────────────────────────┘  │   │
│  │                         │                                 │   │
│  │  ┌──────────────────────▼──────────────────────────────┐ │   │
│  │  │           Web Crypto API (SHA-256 Hashing)          │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────┬─────────────────────┬───────────────────────┘
                    │                     │
        ┌───────────▼──────┐   ┌──────────▼──────────┐
        │  Polygon Amoy    │   │   Pinata / IPFS      │
        │  (Blockchain)    │   │   (File Storage)     │
        │                  │   │                      │
        │  ┌────────────┐  │   │  Files pinned by     │
        │  │ AccessCtrl │  │   │  CID. Retrieved      │
        │  │  Contract  │  │   │  via IPFS gateway.   │
        │  └─────┬──────┘  │   └──────────────────────┘
        │        │          │
        │  ┌─────▼──────┐  │
        │  │  Document  │  │
        │  │  Registry  │  │
        │  │  Contract  │  │
        │  └────────────┘  │
        └──────────────────┘
```

The flow for document registration is: browser hashes the file → browser uploads file to Pinata → browser sends hash + CID + metadata to the DocumentRegistry contract via a signed transaction. The flow for verification is: browser hashes the file → browser reads DocumentRegistry contract (no wallet needed, no gas) → browser displays result. At no point does a Trustify server touch the document or hash — the browser is the only intermediary between the user and the decentralized infrastructure.

### 4.3 System Component Design

#### 4.3.1 Smart Contract Layer

The contract architecture uses two separate contracts rather than one monolithic contract, following the single responsibility principle and making each contract easier to test, audit, and potentially upgrade independently.

**TrustifyAccessControl** inherits from OpenZeppelin's `AccessControlDefaultAdminRules`. This variant is preferred over the base `AccessControl` because it adds critical security properties for the admin role: the admin role can only be held by one account at a time, transferring the admin role requires a 2-step process with a configurable delay, and it prevents accidental loss of admin access. It defines two custom roles: `ISSUER_ROLE` (for approved organizations) and `VERIFIER_ROLE` (reserved for future use — currently verification is fully public). It exposes getter functions `isAdmin(address)` and `isIssuer(address)` that the frontend uses for role resolution.

**TrustifyRegistry** inherits from OpenZeppelin's `Pausable` and `ReentrancyGuard` in addition to holding a reference to the AccessControl contract. It uses `nonReentrant` on state-changing functions as a defense against reentrancy attacks even though the contract handles no ETH. The registry stores all document records in a `mapping(bytes32 => DocumentRecord)` where the key is the SHA-256 hash encoded as `bytes32`. It also maintains per-issuer indexes as `mapping(address => bytes32[])` to enable the issuer to query their own documents efficiently.

#### 4.3.2 Frontend Layer

The frontend is organized around three distinct "application surfaces" that share a common shell component but have entirely separate navigation, features, and route subtrees: the public surface (landing + verify), the issuer surface, and the admin surface. This separation mirrors the role boundaries enforced on-chain.

Guard components sit at the boundary between unauthenticated and authenticated surfaces. The `WalletGuard` component checks `useAccount().isConnected` and redirects to the wallet connection prompt if false. The `NetworkGuard` checks `useChainId()` against the configured target chain and shows a network-switch prompt if they don't match. The `RoleGuard` (specialized for admin and issuer) calls `useReadContract` against the AccessControl contract and redirects to the `not-approved` or `unauthorized` page if the role check fails.

#### 4.3.3 Web3 Integration Layer

The `packages/web3` package centralizes all blockchain interaction logic so that the frontend imports clean, typed hooks rather than raw contract ABIs. This package exports:

- `useIsAdmin(address)` — reads `hasRole(DEFAULT_ADMIN_ROLE, address)` from AccessControl.
- `useIsIssuer(address)` — reads `hasRole(ISSUER_ROLE, address)` from AccessControl.
- `useRegisterDocument(params)` — wraps `useWriteContract` for the registry's `registerDocument` function with typed parameters.
- `useVerifyDocument(hash)` — wraps `useReadContract` for the registry's `verifyDocument` function, returning a typed `VerificationResult`.
- `useIssuerDocuments(issuerAddress)` — reads all document hashes for an issuer and batches additional calls to get full records.
- `useApproveIssuer()` / `useRevokeIssuer()` — admin-facing write hooks.
- `useRevokeDocument()` / `useSupersededDocument()` — issuer-facing write hooks.

Each hook handles the full transaction lifecycle: idle, pending (wallet signature requested), confirming (transaction in mempool), success, and error states. The UI consumes these states directly to show appropriate feedback.

### 4.4 Data Models

All data models are defined in TypeScript and are shared between the frontend and the Web3 layer through the `packages/config` package.

```typescript
// The canonical status of a document on-chain
type DocumentStatus = "active" | "revoked" | "expired" | "superseded";

// What gets stored on-chain per document
interface DocumentRecord {
  hash: `0x${string}`;         // bytes32 SHA-256 hash (primary key)
  cid: string;                  // IPFS CID for the actual file (may be empty string)
  issuer: `0x${string}`;       // Ethereum address of the registering issuer
  holderName: string;           // Name of the document holder
  holderId: string;             // ID number or identifier of the holder
  documentType: string;         // E.g. "Degree Certificate", "Medical Report"
  sector: DocumentSector;       // Enum: education | healthcare | legal | govt | corporate
  issuedAt: bigint;             // Unix timestamp of document issue date
  expiresAt: bigint;            // Unix timestamp; 0 means no expiry
  registeredAt: bigint;         // Unix timestamp of on-chain registration
  status: DocumentStatus;
  revocationReason: string;     // Empty string unless revoked
  supersededByHash: `0x${string}`; // Zero hash unless superseded
  txHash: `0x${string}`;       // Transaction hash for Polygonscan link
}

type DocumentSector =
  | "education"
  | "healthcare"
  | "legal"
  | "government"
  | "corporate";

// What the frontend gets back from verifyDocument
interface VerificationResult {
  found: boolean;
  status: DocumentStatus | "not_found" | "tampered";
  document: DocumentRecord | null;
  checkedAt: number;    // Client-side timestamp of the verification
  inputHash: string;    // The hash that was queried
}

// Issuer profile (partially on-chain via events, partially off-chain metadata)
interface IssuerProfile {
  walletAddress: `0x${string}`;
  name: string;           // Stored in event data when issuer is approved
  sector: DocumentSector;
  approvedAt: number;     // Timestamp from the approval event
  revokedAt: number | null;
  status: "approved" | "revoked";
  documentCount: number;  // Derived from on-chain index
}

// Activity log entry derived from contract events
interface ActivityEvent {
  type:
    | "document_registered"
    | "document_revoked"
    | "document_superseded"
    | "issuer_approved"
    | "issuer_revoked";
  actorAddress: `0x${string}`;
  targetHash?: `0x${string}`;
  targetIssuer?: `0x${string}`;
  blockNumber: bigint;
  txHash: `0x${string}`;
  timestamp: number;      // Derived from block timestamp
}
```

### 4.5 Smart Contract Specification

#### 4.5.1 TrustifyAccessControl.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControlDefaultAdminRules.sol";

/**
 * @title TrustifyAccessControl
 * @notice Manages role-based access for the Trustify registry.
 * @dev Uses AccessControlDefaultAdminRules for enhanced admin security.
 *      Deployer automatically receives DEFAULT_ADMIN_ROLE.
 *      Only admin can grant/revoke ISSUER_ROLE.
 */
contract TrustifyAccessControl is AccessControlDefaultAdminRules {

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Metadata stored off the role-check path for UI display
    mapping(address => string) public issuerName;
    mapping(address => string) public issuerSector;
    mapping(address => uint256) public issuerApprovedAt;

    event IssuerApproved(
        address indexed issuer,
        string name,
        string sector,
        uint256 timestamp
    );

    event IssuerRevoked(
        address indexed issuer,
        uint256 timestamp
    );

    constructor(address initialAdmin)
        AccessControlDefaultAdminRules(
            3 days,        // delay before admin transfer completes
            initialAdmin   // initial admin (deployer in scripts)
        )
    {}

    /**
     * @notice Approve an address as a trusted issuer.
     * @dev Only callable by DEFAULT_ADMIN_ROLE holder.
     */
    function approveIssuer(
        address issuer,
        string calldata name,
        string calldata sector
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ISSUER_ROLE, issuer);
        issuerName[issuer] = name;
        issuerSector[issuer] = sector;
        issuerApprovedAt[issuer] = block.timestamp;
        emit IssuerApproved(issuer, name, sector, block.timestamp);
    }

    /**
     * @notice Revoke an issuer's ability to register documents.
     * @dev Previously registered documents remain on-chain (immutable).
     */
    function revokeIssuer(
        address issuer
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ISSUER_ROLE, issuer);
        emit IssuerRevoked(issuer, block.timestamp);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isIssuer(address account) external view returns (bool) {
        return hasRole(ISSUER_ROLE, account);
    }
}
```

#### 4.5.2 TrustifyRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TrustifyAccessControl.sol";

/**
 * @title TrustifyRegistry
 * @notice Immutable registry for document hashes and metadata.
 * @dev Only approved issuers can register documents.
 *      Verification is a public read-only operation.
 *      Document status lifecycle: Active -> Revoked | Superseded | (auto-)Expired.
 */
contract TrustifyRegistry is Pausable, ReentrancyGuard {

    TrustifyAccessControl public immutable accessControl;

    enum DocStatus { Active, Revoked, Superseded }
    enum Sector { Education, Healthcare, Legal, Government, Corporate }

    struct DocumentRecord {
        bytes32 hash;               // SHA-256 of the document file
        string  cid;                // IPFS CID (empty if hash-only registration)
        address issuer;             // msg.sender at registration time
        string  holderName;
        string  holderId;
        string  documentType;
        Sector  sector;
        uint256 issuedAt;           // Issuer-provided issue date (unix timestamp)
        uint256 expiresAt;          // 0 = no expiry
        uint256 registeredAt;       // block.timestamp at registration
        DocStatus status;
        string  revocationReason;   // Empty unless revoked
        bytes32 supersededByHash;   // Zero unless superseded
    }

    // Primary storage: hash -> record
    mapping(bytes32 => DocumentRecord) private _records;

    // Issuer index: issuer address -> array of document hashes
    mapping(address => bytes32[]) private _issuerDocs;

    // Events
    event DocumentRegistered(
        bytes32 indexed docHash,
        address indexed issuer,
        Sector sector,
        string documentType,
        uint256 registeredAt
    );

    event DocumentRevoked(
        bytes32 indexed docHash,
        address indexed issuer,
        string reason,
        uint256 revokedAt
    );

    event DocumentSuperseded(
        bytes32 indexed oldHash,
        bytes32 indexed newHash,
        address indexed issuer,
        uint256 supersededAt
    );

    // Custom errors (more gas-efficient than require strings)
    error DocumentAlreadyRegistered(bytes32 hash);
    error DocumentNotFound(bytes32 hash);
    error NotDocumentIssuer(bytes32 hash, address caller);
    error DocumentNotActive(bytes32 hash);
    error NotAnIssuer(address caller);
    error InvalidTimestamp();

    constructor(address accessControlAddress) {
        accessControl = TrustifyAccessControl(accessControlAddress);
    }

    modifier onlyIssuer() {
        if (!accessControl.isIssuer(msg.sender)) {
            revert NotAnIssuer(msg.sender);
        }
        _;
    }

    modifier onlyDocumentIssuer(bytes32 hash) {
        if (_records[hash].issuer != msg.sender) {
            revert NotDocumentIssuer(hash, msg.sender);
        }
        _;
    }

    modifier documentExists(bytes32 hash) {
        if (_records[hash].registeredAt == 0) {
            revert DocumentNotFound(hash);
        }
        _;
    }

    /**
     * @notice Register a new document on the blockchain.
     * @param hash SHA-256 hash of the document (bytes32).
     * @param cid IPFS CID string. Pass empty string for hash-only registration.
     * @param holderName Name of the document holder.
     * @param holderId Identifier of the document holder.
     * @param documentType Human-readable document type string.
     * @param sector Sector enum value.
     * @param issuedAt Unix timestamp of when the document was issued.
     * @param expiresAt Unix timestamp of expiry. Pass 0 for no expiry.
     */
    function registerDocument(
        bytes32 hash,
        string calldata cid,
        string calldata holderName,
        string calldata holderId,
        string calldata documentType,
        Sector sector,
        uint256 issuedAt,
        uint256 expiresAt
    ) external onlyIssuer nonReentrant whenNotPaused {
        if (_records[hash].registeredAt != 0) {
            revert DocumentAlreadyRegistered(hash);
        }
        if (expiresAt != 0 && expiresAt <= issuedAt) {
            revert InvalidTimestamp();
        }

        _records[hash] = DocumentRecord({
            hash: hash,
            cid: cid,
            issuer: msg.sender,
            holderName: holderName,
            holderId: holderId,
            documentType: documentType,
            sector: sector,
            issuedAt: issuedAt,
            expiresAt: expiresAt,
            registeredAt: block.timestamp,
            status: DocStatus.Active,
            revocationReason: "",
            supersededByHash: bytes32(0)
        });

        _issuerDocs[msg.sender].push(hash);

        emit DocumentRegistered(hash, msg.sender, sector, documentType, block.timestamp);
    }

    /**
     * @notice Revoke a previously registered document.
     * @dev Only the original issuer can revoke their own documents.
     */
    function revokeDocument(
        bytes32 hash,
        string calldata reason
    ) external documentExists(hash) onlyDocumentIssuer(hash) nonReentrant whenNotPaused {
        DocumentRecord storage record = _records[hash];
        if (record.status != DocStatus.Active) {
            revert DocumentNotActive(hash);
        }

        record.status = DocStatus.Revoked;
        record.revocationReason = reason;

        emit DocumentRevoked(hash, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Supersede an old document with a new one.
     * @dev The new document must be registered first (via registerDocument),
     *      then this function links them. The old document's status becomes Superseded.
     *      In practice, call registerDocument first, then supersedeDocument.
     */
    function supersedeDocument(
        bytes32 oldHash,
        bytes32 newHash
    ) external documentExists(oldHash) documentExists(newHash) onlyDocumentIssuer(oldHash) nonReentrant whenNotPaused {
        DocumentRecord storage oldRecord = _records[oldHash];
        if (oldRecord.status != DocStatus.Active) {
            revert DocumentNotActive(oldHash);
        }

        oldRecord.status = DocStatus.Superseded;
        oldRecord.supersededByHash = newHash;

        emit DocumentSuperseded(oldHash, newHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Verify a document hash and return its full record.
     * @dev Pure read, no gas for external callers (via eth_call).
     *      Expiry is checked dynamically against block.timestamp.
     * @return found Whether the hash exists in the registry.
     * @return status Effective status string: "active", "revoked", "expired", "superseded", "not_found".
     * @return record The full DocumentRecord (zero-value struct if not found).
     */
    function verifyDocument(bytes32 hash)
        external
        view
        returns (
            bool found,
            string memory status,
            DocumentRecord memory record
        )
    {
        record = _records[hash];

        if (record.registeredAt == 0) {
            return (false, "not_found", record);
        }

        found = true;

        if (record.status == DocStatus.Revoked) {
            status = "revoked";
        } else if (record.status == DocStatus.Superseded) {
            status = "superseded";
        } else if (record.expiresAt != 0 && block.timestamp > record.expiresAt) {
            status = "expired";
        } else {
            status = "active";
        }
    }

    /**
     * @notice Get all document hashes registered by a specific issuer.
     */
    function getIssuerDocuments(address issuer)
        external
        view
        returns (bytes32[] memory)
    {
        return _issuerDocs[issuer];
    }

    /**
     * @notice Get a single document record by hash.
     */
    function getDocument(bytes32 hash)
        external
        view
        documentExists(hash)
        returns (DocumentRecord memory)
    {
        return _records[hash];
    }

    // Admin-only pause/unpause for emergency stops
    function pause() external {
        require(accessControl.isAdmin(msg.sender), "Not admin");
        _pause();
    }

    function unpause() external {
        require(accessControl.isAdmin(msg.sender), "Not admin");
        _unpause();
    }
}
```

#### 4.5.3 Gas Optimization Notes

Using `bytes32` for the document hash instead of `string` saves ~20,000 gas per registration because `bytes32` fits in a single EVM storage slot. Using custom errors (e.g., `revert DocumentNotFound(hash)`) instead of `require(condition, "string")` saves approximately 3,000–5,000 gas per failed transaction because errors are encoded as 4-byte selectors rather than full strings. The `expiresAt` check in `verifyDocument` is done dynamically (not stored as a separate status on-chain) to avoid the gas cost of updating the status field when a document expires — expiry is a time-based condition, not a state transition requiring a transaction.

### 4.6 Frontend Architecture

#### 4.6.1 App Router Structure

The Next.js 15 App Router organizes routes into two route groups: `(public)` for pages accessible without wallet connection, and `(app)` for authenticated role-specific areas. This grouping allows each group to have its own layout without affecting the URL path.

The `(public)` layout renders a minimal header with a "Connect Wallet" button and "Verify Document" CTA. The `(app)` layout renders a full sidebar with role-specific navigation links, a header showing the connected wallet address and role badge, and a network indicator.

#### 4.6.2 State Management

Trustify avoids global state management libraries like Redux or Zustand because Wagmi's hooks provide all the reactive contract state needed. Each component that needs contract data calls the appropriate hook directly. The only shared application state is the wallet connection state (provided by Wagmi's `WagmiProvider` and `QueryClientProvider` at the root), the sidebar open/closed state (managed by a simple React context), and toast notifications (managed by a toast provider).

#### 4.6.3 Key Component Patterns

**Document Hash Computation.** The `useDocumentHash` custom hook accepts a `File` object and returns the SHA-256 hash as a hex string.

```typescript
// hooks/use-document-hash.ts
import { useState, useCallback } from "react";

export function useDocumentHash() {
  const [hash, setHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeHash = useCallback(async (file: File) => {
    setIsHashing(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      setHash(hashHex);
      return hashHex as `0x${string}`;
    } catch (err) {
      setError("Failed to hash document. Please try again.");
      return null;
    } finally {
      setIsHashing(false);
    }
  }, []);

  return { hash, isHashing, error, computeHash };
}
```

**Verification Flow.** The verification page orchestrates three states in sequence: (1) the dropzone state where the user uploads a file; (2) the processing state where hashing and the contract read happen simultaneously; (3) the result state showing one of five outcomes. The result card component accepts a `VerificationResult` prop and conditionally renders the appropriate variant based on the status field.

**Transaction Lifecycle Management.** The register document wizard's confirm step uses Wagmi's `useWriteContract` hook and tracks the transaction hash through `useWaitForTransactionReceipt` to detect on-chain confirmation. The UI shows a spinning progress indicator with a descriptive message for each phase: "Waiting for wallet signature...", "Transaction submitted, waiting for confirmation...", "Document registered successfully!"

### 4.7 Storage Strategy

Trustify uses a hybrid storage model that balances privacy, cost, and accessibility.

**What goes on-chain (DocumentRegistry contract storage):** The SHA-256 hash (`bytes32`), IPFS CID (string, stored as calldata to reduce gas), holder name (string), holder ID (string), document type (string), sector (uint8 enum), timestamps (uint256 × 3), status (uint8 enum), revocation reason (string), and superseding hash (`bytes32`). On-chain storage is used only for data that must be immutable and queryable by hash.

**What goes on IPFS (Pinata):** The actual document file, pinned via the Pinata API and retrievable by CID from any IPFS gateway. IPFS storage is optional — issuers who need privacy (e.g., medical documents) can register hash-only without uploading the file. IPFS upload is enabled by default for issuers who consent to making the document publicly accessible.

**What is never stored by Trustify:** The document content never passes through any Trustify-controlled server. Hashing happens in the browser. The Pinata upload uses the issuer's Pinata JWT (stored in environment variables on the frontend) and sends the file directly from the browser to Pinata's API.

**IPFS Pinata Integration:**

```typescript
// lib/pinata.ts
import PinataSDK from "@pinata/sdk";

const pinata = new PinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT });

export async function uploadToIPFS(file: File, metadata: {
  holderName: string;
  documentType: string;
  sector: string;
}): Promise<string> {
  const stream = file.stream();
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: {
      name: `${metadata.documentType}-${metadata.holderName}`,
      keyvalues: {
        sector: metadata.sector,
        uploadedAt: Date.now().toString(),
      },
    },
    pinataOptions: { cidVersion: 1 },
  });
  return result.IpfsHash; // CIDv1 string
}
```

### 4.8 Security Framework

**Smart Contract Security.**

The `AccessControlDefaultAdminRules` variant enforces that only one account holds `DEFAULT_ADMIN_ROLE` at a time and requires a 2-step process with a configurable delay to transfer admin access. This protects against accidentally losing admin access or an attacker immediately gaining control after a private key compromise.

The `ReentrancyGuard` on all state-changing registry functions prevents reentrancy attacks. While the registry contract does not handle ETH or call external contracts in a way that creates reentrancy risk, adding the guard is a defense-in-depth practice.

The `Pausable` mechanism (callable only by admin) allows an emergency stop of all registry writes if a critical vulnerability is discovered post-deployment, without needing a contract upgrade.

Custom errors (`revert DocumentNotFound(hash)`) leak less information than descriptive string reverts in some attack scenarios and are more gas-efficient.

The `onlyDocumentIssuer` modifier ensures that only the wallet that originally registered a document can revoke or supersede it — preventing adversarial issuers from tampering with each other's records.

**Frontend Security.**

All contract addresses and chain configuration are stored in environment variables and validated at build time against expected values. The frontend never handles private keys — all signing is delegated to the user's wallet via Wagmi. Role checks happen both on the frontend (for UX) and on the contract (for enforcement) — the frontend guards are UX conveniences, not security boundaries.

**Operational Security.**

The deployer private key should be a hardware wallet or multi-signature wallet, not a hot wallet. The admin wallet address is set at deployment time and should be separate from any development wallets. Contract source code should be verified on Polygonscan so that all parameters and business logic are publicly auditable.

### 4.9 API & Integration Layer

Trustify has no traditional REST API backend. The "API" layer is the smart contract ABI, accessed via Wagmi/Viem. The following table documents the complete interface that the frontend consumes.

**TrustifyAccessControl ABI (Frontend-facing):**

| Function | Type | Parameters | Returns | Who Can Call |
|---|---|---|---|---|
| `isAdmin(address)` | read | `account: address` | `bool` | Anyone |
| `isIssuer(address)` | read | `account: address` | `bool` | Anyone |
| `approveIssuer(address, string, string)` | write | `issuer, name, sector` | `void` | Admin only |
| `revokeIssuer(address)` | write | `issuer` | `void` | Admin only |
| `issuerName(address)` | read | `issuer` | `string` | Anyone |
| `issuerSector(address)` | read | `issuer` | `string` | Anyone |
| `issuerApprovedAt(address)` | read | `issuer` | `uint256` | Anyone |

**TrustifyRegistry ABI (Frontend-facing):**

| Function | Type | Parameters | Returns | Who Can Call |
|---|---|---|---|---|
| `registerDocument(bytes32, string, string, string, string, uint8, uint256, uint256)` | write | hash, cid, holderName, holderId, docType, sector, issuedAt, expiresAt | `void` | Issuers only |
| `revokeDocument(bytes32, string)` | write | hash, reason | `void` | Doc's issuer only |
| `supersedeDocument(bytes32, bytes32)` | write | oldHash, newHash | `void` | Doc's issuer only |
| `verifyDocument(bytes32)` | read | hash | `(bool found, string status, DocumentRecord record)` | Anyone |
| `getDocument(bytes32)` | read | hash | `DocumentRecord` | Anyone |
| `getIssuerDocuments(address)` | read | issuer | `bytes32[]` | Anyone |
| `pause()` / `unpause()` | write | none | `void` | Admin only |

**Wagmi Hook Wrappers (packages/web3/src/hooks/):**

Each contract function is wrapped in a Wagmi hook. The wrapper handles ABI encoding, return type casting to TypeScript types, and error normalization. This means the frontend never imports raw ABIs — it only imports typed React hooks with clear parameter and return type signatures.

### 4.10 Sequence Diagrams

#### Registration Sequence

```
Issuer Browser           Pinata API           Polygon Amoy
     |                       |                      |
     |--[1] User drops file---|                      |
     |                       |                      |
     |--[2] SHA-256 hash (Web Crypto API, client-side)
     |                       |                      |
     |--[3] POST /pinning/pinFileToIPFS--->          |
     |<--[4] { IpfsHash: "bafyrei..." }--            |
     |                       |                      |
     |--[5] Wallet sign (Wagmi useWriteContract)      |
     |--[6] eth_sendRawTransaction ----------------->|
     |                       |    [7] Contract validates ISSUER_ROLE
     |                       |    [8] Stores record in mapping
     |                       |    [9] Emits DocumentRegistered event
     |<--------------------------- [10] tx receipt --|
     |--[11] Show success receipt with tx link
```

#### Verification Sequence

```
Verifier Browser                              Polygon Amoy
     |                                             |
     |--[1] User drops document file               |
     |                                             |
     |--[2] SHA-256 hash (Web Crypto, client-side) |
     |                                             |
     |--[3] eth_call: verifyDocument(hash) ------->|
     |                   |       [4] Lookup mapping(hash)
     |                   |       [5] Check expiry dynamically
     |<------------------ [6] Return (found, status, record)
     |                                             |
     |--[7] Render result card (Valid/Revoked/Expired/Superseded/NotFound)
```

---

## 5. Full Folder Structure — All Parts

### 5.1 Monorepo Root

```
Trustify/                               ← Git repository root
├── apps/
│   └── web/                            ← Next.js 15 frontend
├── packages/
│   ├── contracts/                      ← Solidity smart contracts (Hardhat)
│   ├── web3/                           ← Shared Wagmi hooks + Viem client
│   └── config/                         ← Shared TypeScript types + constants
├── infra/
│   ├── deployments/                    ← Deployment artifacts (addresses, ABIs)
│   └── scripts/                        ← CI/CD and deploy helpers
├── docs/                               ← Architecture diagrams, runbooks
├── .env.example                        ← Template for environment variables
├── .gitignore
├── pnpm-workspace.yaml                 ← pnpm monorepo config
├── turbo.json                          ← Turborepo pipeline (optional but recommended)
├── package.json                        ← Root package.json (scripts only)
└── README.md                           ← Project overview and setup
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**.env.example (root-level, copied to apps/web/.env.local):**
```env
# Blockchain
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002

# Contract Addresses (filled after deployment)
NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS=0x...
NEXT_PUBLIC_REGISTRY_ADDRESS=0x...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Pinata / IPFS
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Explorer
NEXT_PUBLIC_POLYGONSCAN_BASE_URL=https://amoy.polygonscan.com

# Deployment (used in scripts, NOT public)
DEPLOYER_PRIVATE_KEY=0x...
POLYGONSCAN_API_KEY=your_api_key
```

---

### 5.2 Frontend: apps/web

```
apps/web/
├── app/
│   ├── (public)/                               ← Public route group
│   │   ├── layout.tsx                          ← Minimal public header/footer
│   │   ├── page.tsx                            ← Landing page
│   │   ├── verify/
│   │   │   └── page.tsx                        ← Public verification portal
│   │   ├── how-it-works/
│   │   │   └── page.tsx                        ← Explainer page
│   │   └── sectors/
│   │       └── page.tsx                        ← Multi-sector use cases
│   │
│   ├── (app)/                                  ← Authenticated route group
│   │   ├── layout.tsx                          ← App shell: sidebar + header
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx                      ← Admin guard wrapper
│   │   │   ├── page.tsx                        ← Admin overview/dashboard
│   │   │   ├── issuers/
│   │   │   │   └── page.tsx                    ← Manage issuers
│   │   │   ├── activity/
│   │   │   │   └── page.tsx                    ← Activity/audit log
│   │   │   └── settings/
│   │   │       └── page.tsx                    ← Admin settings (chain info etc.)
│   │   │
│   │   ├── issuer/
│   │   │   ├── layout.tsx                      ← Issuer guard + approval check
│   │   │   ├── page.tsx                        ← Issuer overview/dashboard
│   │   │   ├── register/
│   │   │   │   └── page.tsx                    ← Register document wizard
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx                    ← Document library
│   │   │   │   └── [hash]/
│   │   │   │       └── page.tsx                ← Document detail page (optional)
│   │   │   └── revoke/
│   │   │       └── page.tsx                    ← Revoke/supersede surface
│   │   │
│   │   └── verifier/
│   │       └── page.tsx                        ← Rich verifier workspace (wallet-connected)
│   │
│   ├── unauthorized/
│   │   └── page.tsx                            ← Wrong role / not approved
│   ├── wrong-network/
│   │   └── page.tsx                            ← Wrong chain detected
│   ├── not-approved/
│   │   └── page.tsx                            ← Issuer role not granted yet
│   ├── loading.tsx                             ← Next.js global loading fallback
│   ├── error.tsx                               ← Next.js global error boundary
│   ├── not-found.tsx                           ← 404 page
│   ├── layout.tsx                              ← Root layout (Providers, fonts)
│   └── globals.css
│
├── features/                                   ← Business-domain UI modules
│   │
│   ├── landing/
│   │   ├── components/
│   │   │   ├── hero-section.tsx                ← Main CTA and value proposition
│   │   │   ├── trust-strip.tsx                 ← Stats strip (docs registered, issuers, etc.)
│   │   │   ├── how-it-works.tsx                ← 3-step visual explainer
│   │   │   ├── sectors-grid.tsx                ← 5 sector cards with icons
│   │   │   ├── role-entry.tsx                  ← "Are you an Issuer or Admin?" CTA block
│   │   │   ├── landing-footer.tsx
│   │   │   └── verify-preview.tsx              ← Embedded mini verify widget
│   │   └── data/
│   │       └── landing-content.ts              ← Copywriting and sector data
│   │
│   ├── admin/
│   │   ├── components/
│   │   │   ├── admin-kpis.tsx                  ← 4-card KPI row (docs, issuers, revoked, active)
│   │   │   ├── issuers-table.tsx               ← Full paginated issuers table
│   │   │   ├── approve-issuer-form.tsx         ← Form: address + name + sector
│   │   │   ├── revoke-issuer-modal.tsx         ← Confirm modal with reason
│   │   │   ├── admin-activity-feed.tsx         ← Real-time event feed from contract logs
│   │   │   ├── activity-event-row.tsx          ← Single event row component
│   │   │   └── admin-quick-actions.tsx         ← Shortcut action buttons
│   │   ├── hooks/
│   │   │   ├── use-admin-kpis.ts               ← Aggregates contract data for KPI cards
│   │   │   ├── use-all-issuers.ts              ← Fetches issuer event logs
│   │   │   └── use-activity-events.ts          ← Fetches all registry event logs
│   │   ├── mock/
│   │   │   ├── issuers.mock.ts
│   │   │   └── activity.mock.ts
│   │   └── types.ts
│   │
│   ├── issuer/
│   │   ├── components/
│   │   │   ├── issuer-kpis.tsx                 ← My docs count, active, revoked, expired
│   │   │   ├── approval-banner.tsx             ← Shown when ISSUER_ROLE not yet granted
│   │   │   ├── register-document-wizard.tsx    ← Stepper shell orchestrating 4 steps
│   │   │   ├── steps/
│   │   │   │   ├── upload-step.tsx             ← Dropzone + hash preview
│   │   │   │   ├── metadata-step.tsx           ← Form fields for document metadata
│   │   │   │   ├── review-step.tsx             ← Summary of all collected data
│   │   │   │   └── success-step.tsx            ← Receipt with tx hash + Polygonscan link
│   │   │   ├── documents-grid.tsx              ← Card grid of issuer's documents
│   │   │   ├── documents-table.tsx             ← Table alternative view
│   │   │   ├── documents-filter-bar.tsx        ← Status/sector/date filters
│   │   │   ├── document-card.tsx               ← Single document summary card
│   │   │   ├── document-detail-drawer.tsx      ← Slide-out full record view
│   │   │   ├── revoke-document-form.tsx        ← Select document + enter reason
│   │   │   └── supersede-document-form.tsx     ← Select old doc + upload new doc
│   │   ├── hooks/
│   │   │   ├── use-issuer-documents.ts         ← Fetches issuer's document hashes + records
│   │   │   ├── use-register-document.ts        ← Upload + hash + register transaction
│   │   │   └── use-revoke-document.ts
│   │   ├── mock/
│   │   │   ├── documents.mock.ts
│   │   │   └── issuer-dashboard.mock.ts
│   │   └── types.ts
│   │
│   ├── verifier/
│   │   ├── components/
│   │   │   ├── verify-upload-panel.tsx         ← Main dropzone + instructions
│   │   │   ├── verification-progress.tsx       ← Animated progress during hash+lookup
│   │   │   ├── verification-result-card.tsx    ← Container that renders result variant
│   │   │   ├── result-variants/
│   │   │   │   ├── result-valid.tsx            ← Green: authentic document details
│   │   │   │   ├── result-revoked.tsx          ← Orange: revocation details
│   │   │   │   ├── result-expired.tsx          ← Yellow: expiry details
│   │   │   │   ├── result-superseded.tsx       ← Blue: newer version pointer
│   │   │   │   └── result-not-found.tsx        ← Red: no match found
│   │   │   ├── result-proof-summary.tsx        ← Blockchain proof details block
│   │   │   ├── result-issuer-details.tsx       ← Issuer name, sector, address
│   │   │   ├── verify-retry-panel.tsx          ← Try another document CTA
│   │   │   └── hash-display.tsx                ← Formatted hash with copy button
│   │   ├── hooks/
│   │   │   └── use-verification.ts             ← Orchestrates hash → contract read → result
│   │   ├── mock/
│   │   │   └── verify-results.mock.ts          ← One mock per result variant
│   │   └── types.ts
│   │
│   └── guards/
│       ├── components/
│       │   ├── wallet-guard.tsx                ← Redirects if not connected
│       │   ├── network-guard.tsx               ← Redirects if wrong chain
│       │   ├── admin-guard.tsx                 ← Redirects if not admin
│       │   └── issuer-guard.tsx                ← Redirects if not issuer
│       └── mock/
│           └── guard-state.mock.ts
│
├── components/                                 ← Reusable, non-business-logic components
│   │
│   ├── layout/
│   │   ├── public-header.tsx                   ← Header for (public) routes
│   │   ├── app-header.tsx                      ← Header for (app) routes + wallet chip
│   │   ├── app-sidebar.tsx                     ← Role-aware sidebar navigation
│   │   ├── sidebar-nav-links.tsx               ← Navigation items per role
│   │   ├── page-shell.tsx                      ← Standard page container with max-w
│   │   └── page-header.tsx                     ← Title + subtitle + action slot
│   │
│   ├── wallet/
│   │   ├── connect-wallet-button.tsx           ← RainbowKit ConnectButton wrapper
│   │   ├── wallet-modal.tsx                    ← Custom connection modal if needed
│   │   ├── wallet-address-chip.tsx             ← Truncated address + copy + avatar
│   │   ├── role-badge.tsx                      ← "Admin" | "Issuer" | "Verifier" badge
│   │   └── network-badge.tsx                   ← Chain name badge with status dot
│   │
│   ├── data-display/
│   │   ├── stat-card.tsx                       ← KPI card: icon + value + label + trend
│   │   ├── status-chip.tsx                     ← Colored chip for doc/issuer status
│   │   ├── sector-badge.tsx                    ← Education / Healthcare / Legal etc.
│   │   ├── data-table.tsx                      ← Generic sortable table component
│   │   ├── detail-drawer.tsx                   ← Generic slide-out panel shell
│   │   ├── proof-summary.tsx                   ← Hash + CID + tx link block
│   │   ├── timeline-item.tsx                   ← Single item in activity timeline
│   │   └── polygonscan-link.tsx                ← External link to tx/address on explorer
│   │
│   ├── forms/
│   │   ├── file-dropzone.tsx                   ← react-dropzone wrapper with styling
│   │   ├── stepper.tsx                         ← Multi-step wizard progress indicator
│   │   ├── step-content-shell.tsx              ← Container for each wizard step
│   │   ├── form-section.tsx                    ← Labeled section within a form
│   │   ├── address-input.tsx                   ← Ethereum address input with validation
│   │   ├── search-filter-bar.tsx               ← Search + multi-select filter bar
│   │   └── confirm-modal.tsx                   ← Destructive action confirmation modal
│   │
│   ├── states/
│   │   ├── empty-state.tsx                     ← Icon + title + description + CTA
│   │   ├── error-state.tsx                     ← Error icon + message + retry action
│   │   ├── unauthorized-state.tsx              ← Role-specific access denied view
│   │   ├── wrong-network-state.tsx             ← Chain mismatch with switch button
│   │   ├── not-approved-state.tsx              ← Issuer approval pending/denied
│   │   └── inline-feedback.tsx                 ← Inline success/warning/error message
│   │
│   └── feedback/
│       ├── toast-provider.tsx                  ← Sonner or react-hot-toast setup
│       ├── tx-toast.tsx                        ← Transaction-specific toast with link
│       ├── skeleton-card.tsx                   ← Card loading skeleton
│       ├── skeleton-table.tsx                  ← Table row loading skeleton
│       ├── skeleton-result.tsx                 ← Verification result loading skeleton
│       └── loading-spinner.tsx                 ← Simple spinner component
│
├── hooks/                                      ← Cross-cutting UI hooks
│   ├── use-document-hash.ts                    ← Client-side SHA-256 via Web Crypto API
│   ├── use-role-ui.ts                          ← Resolves role + returns nav config
│   ├── use-sidebar-state.ts                    ← Open/collapsed sidebar state
│   ├── use-clipboard.ts                        ← Copy to clipboard with feedback
│   ├── use-mock-documents.ts                   ← Returns mock document list for UI dev
│   └── use-mock-verification.ts                ← Returns mock verification result
│
├── lib/
│   ├── web3/
│   │   ├── client.ts                           ← Wagmi config + chains + connectors
│   │   ├── contracts.ts                        ← Contract addresses + imported ABIs
│   │   ├── document-api.ts                     ← High-level functions wrapping contract reads/writes
│   │   ├── event-logs.ts                       ← getLogs helpers for activity feed
│   │   └── pinata.ts                           ← Pinata SDK wrapper for IPFS upload
│   │
│   ├── providers/
│   │   ├── wagmi-provider.tsx                  ← WagmiProvider + QueryClientProvider
│   │   └── app-providers.tsx                   ← Composes all providers
│   │
│   ├── routes.ts                               ← Centralized route constants
│   ├── constants.ts                            ← Chain ID, contract addresses, sector enums
│   ├── utils.ts                                ← General utility functions
│   └── formatters/
│       ├── address.ts                          ← truncateAddress(addr, 6, 4)
│       ├── date.ts                             ← formatTimestamp, formatRelativeTime
│       ├── hash.ts                             ← formatHash, hexToBytes32
│       └── status.ts                           ← statusToLabel, statusToColor
│
├── types/
│   ├── roles.ts                                ← Role enum + type guards
│   ├── document.ts                             ← DocumentRecord, DocumentStatus, Sector
│   ├── issuer.ts                               ← IssuerProfile
│   ├── verification.ts                         ← VerificationResult, VerificationStatus
│   └── activity.ts                             ← ActivityEvent, EventType
│
├── styles/
│   └── globals.css                             ← Tailwind directives + CSS custom properties
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── og-image.png                            ← Open Graph image for sharing
│
├── .env.local                                  ← Local environment variables (gitignored)
├── .env.example                                ← Template (committed)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── components.json                             ← shadcn/ui config
└── package.json
```

---

### 5.3 Smart Contracts: packages/contracts

```
packages/contracts/
│
├── contracts/
│   ├── TrustifyAccessControl.sol               ← Role management contract
│   ├── TrustifyRegistry.sol                    ← Document registry contract
│   └── interfaces/
│       ├── ITrustifyAccessControl.sol          ← Interface for AccessControl
│       └── ITrustifyRegistry.sol               ← Interface for Registry
│
├── test/
│   ├── helpers/
│   │   ├── deploy.ts                           ← Shared deploy helper for tests
│   │   └── fixtures.ts                         ← Hardhat fixture functions
│   │
│   ├── AccessControl.test.ts                   ← Tests: admin role, issuer approval/revoke
│   │   ├── constructor sets deployer as admin
│   │   ├── admin can approve issuer
│   │   ├── non-admin cannot approve issuer
│   │   ├── admin can revoke issuer
│   │   ├── isIssuer returns correct bool
│   │   └── isAdmin returns correct bool
│   │
│   ├── Registry.register.test.ts               ← Tests: document registration
│   │   ├── approved issuer can register a document
│   │   ├── non-issuer cannot register
│   │   ├── duplicate hash is rejected
│   │   ├── expiresAt before issuedAt is rejected
│   │   ├── emits DocumentRegistered event
│   │   └── document appears in issuer index
│   │
│   ├── Registry.verify.test.ts                 ← Tests: verification logic
│   │   ├── returns not_found for unknown hash
│   │   ├── returns active for valid registered document
│   │   ├── returns expired when block.timestamp > expiresAt
│   │   ├── returns revoked when status is Revoked
│   │   └── returns superseded when status is Superseded
│   │
│   ├── Registry.revoke.test.ts                 ← Tests: revocation
│   │   ├── issuer can revoke their own document
│   │   ├── non-issuer cannot revoke
│   │   ├── other issuer cannot revoke
│   │   ├── cannot revoke already revoked document
│   │   └── emits DocumentRevoked event with reason
│   │
│   └── Registry.supersede.test.ts              ← Tests: supersession
│       ├── issuer can supersede their document
│       ├── old document status becomes Superseded
│       ├── supersededByHash points to new hash
│       └── emits DocumentSuperseded event
│
├── scripts/
│   ├── deploy-access-control.ts                ← Deploys TrustifyAccessControl
│   ├── deploy-registry.ts                      ← Deploys TrustifyRegistry (needs AC address)
│   ├── deploy-all.ts                           ← Deploys both in sequence, writes addresses
│   ├── approve-issuer.ts                       ← CLI: approve an issuer address
│   ├── verify-contracts.ts                     ← Verifies contracts on Polygonscan
│   └── export-abis.ts                          ← Copies ABIs to infra/deployments/
│
├── deployments/
│   ├── polygon-amoy.json                       ← { accessControl: "0x...", registry: "0x..." }
│   └── localhost.json                          ← Local Hardhat node addresses
│
├── abis/                                       ← Auto-generated by export-abis.ts
│   ├── TrustifyAccessControl.json
│   └── TrustifyRegistry.json
│
├── hardhat.config.ts
├── tsconfig.json
└── package.json
```

**hardhat.config.ts outline:**

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {},
    amoy: {
      url: process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: { polygonAmoy: process.env.POLYGONSCAN_API_KEY || "" },
    customChains: [{
      network: "polygonAmoy",
      chainId: 80002,
      urls: {
        apiURL: "https://api-amoy.polygonscan.com/api",
        browserURL: "https://amoy.polygonscan.com",
      },
    }],
  },
};

export default config;
```

---

### 5.4 Shared Web3 Layer: packages/web3

```
packages/web3/
│
├── src/
│   ├── index.ts                                ← Re-exports all public hooks and types
│   │
│   ├── client.ts                               ← Viem publicClient + walletClient factory
│   │
│   ├── contracts.ts                            ← Imports ABIs + addresses, exports typed contracts
│   │   └── { accessControlContract, registryContract }
│   │
│   ├── hooks/
│   │   │
│   │   ├── auth/
│   │   │   ├── use-is-admin.ts                 ← useReadContract → isAdmin(address)
│   │   │   ├── use-is-issuer.ts                ← useReadContract → isIssuer(address)
│   │   │   └── use-connected-role.ts           ← Aggregates: returns "admin"|"issuer"|"none"
│   │   │
│   │   ├── admin/
│   │   │   ├── use-approve-issuer.ts           ← useWriteContract → approveIssuer
│   │   │   ├── use-revoke-issuer.ts            ← useWriteContract → revokeIssuer
│   │   │   ├── use-all-issuers.ts              ← getLogs → IssuerApproved events → IssuerProfile[]
│   │   │   └── use-registry-stats.ts           ← Aggregates doc count, issuer count etc.
│   │   │
│   │   ├── issuer/
│   │   │   ├── use-register-document.ts        ← Orchestrates: hash + IPFS upload + contract write
│   │   │   ├── use-revoke-document.ts          ← useWriteContract → revokeDocument
│   │   │   ├── use-supersede-document.ts       ← useWriteContract → supersedeDocument
│   │   │   └── use-issuer-documents.ts         ← getIssuerDocuments + batch getDocument calls
│   │   │
│   │   └── verifier/
│   │       └── use-verify-document.ts          ← useReadContract → verifyDocument → VerificationResult
│   │
│   ├── events/
│   │   ├── get-activity-events.ts              ← getLogs for all registry events
│   │   └── types.ts                            ← ActivityEvent type
│   │
│   └── types.ts                                ← Re-exports shared types (DocumentRecord etc.)
│
├── package.json
└── tsconfig.json
```

---

### 5.5 Shared Config & Types: packages/config

```
packages/config/
│
├── src/
│   ├── index.ts                                ← Re-exports everything
│   │
│   ├── types/
│   │   ├── document.ts                         ← DocumentRecord, DocumentStatus, Sector
│   │   ├── issuer.ts                           ← IssuerProfile
│   │   ├── verification.ts                     ← VerificationResult
│   │   ├── activity.ts                         ← ActivityEvent
│   │   └── roles.ts                            ← UserRole enum + type guards
│   │
│   ├── constants/
│   │   ├── chains.ts                           ← SUPPORTED_CHAINS, TARGET_CHAIN_ID
│   │   ├── contracts.ts                        ← Contract addresses from env
│   │   ├── sectors.ts                          ← Sector labels, icons, colors
│   │   ├── document-types.ts                   ← Pre-defined document type options
│   │   └── routes.ts                           ← Route path constants
│   │
│   └── abis/
│       ├── TrustifyAccessControl.abi.ts        ← ABI as const (for Wagmi type inference)
│       └── TrustifyRegistry.abi.ts             ← ABI as const
│
├── package.json
└── tsconfig.json
```

---

### 5.6 Infrastructure: infra/

```
infra/
│
├── deployments/
│   ├── polygon-amoy/
│   │   ├── TrustifyAccessControl.json          ← { address, abi, deployedAt, txHash }
│   │   └── TrustifyRegistry.json               ← { address, abi, deployedAt, txHash }
│   └── localhost/
│       ├── TrustifyAccessControl.json
│       └── TrustifyRegistry.json
│
└── scripts/
    ├── ci-deploy-contracts.sh                  ← Full deploy pipeline for CI
    ├── ci-verify-contracts.sh                  ← Polygonscan verification in CI
    └── sync-abis.sh                            ← Copies ABIs from contracts/abis to config/abis
```

---

### 5.7 Documentation: docs/

```
docs/
├── prd-trd-master.md                           ← This document
├── architecture-diagram.drawio                 ← Editable architecture diagram
├── sequence-diagrams.md                        ← PlantUML / Mermaid sequence diagrams
├── contracts-api.md                            ← Full ABI reference in table format
├── runbook.md                                  ← Environment setup, deploy, rollback
├── presentation/                               ← Hackathon PPT source files
│   └── Trustify-pitch.pptx
└── demo-script.md                              ← Step-by-step live demo walkthrough
```

**runbook.md outline:**

```markdown
# Trustify Runbook

## Prerequisites
- Node.js 20+, pnpm 9+
- MetaMask or compatible wallet
- Polygon Amoy MATIC (from faucet: https://faucet.polygon.technology/)
- Pinata account + JWT

## Setup
1. Clone repo and run `pnpm install` at root
2. Copy `.env.example` to `apps/web/.env.local` and `packages/contracts/.env`
3. Fill in all env variables

## Deploy Contracts
cd packages/contracts
pnpm hardhat run scripts/deploy-all.ts --network amoy
pnpm hardhat run scripts/verify-contracts.ts --network amoy
pnpm run export-abis   # syncs ABIs to config package

## Run Frontend
cd apps/web
pnpm dev

## Run Tests
cd packages/contracts
pnpm hardhat test

## Demo Flow
1. Connect admin wallet, approve test issuer wallet
2. Connect issuer wallet, register a sample PDF
3. Download the same PDF, drag into /verify → shows Valid
4. Modify the PDF, drag into /verify → shows Not Found (tampered)
5. Admin revokes the issuer, issuer sees not-approved banner
6. Issuer revokes the document, verify shows Revoked
```

---

## 6. Development Plan & Build Order

The build is organized into four phases, sequenced so that each phase produces demonstrable, reviewable output before the next begins. The UI-first approach in phases 1–2 allows frontend and contract development to proceed in parallel.

### Phase 1: Foundation (Days 1–2)

The goal of this phase is to set up the monorepo, deploy contracts to the local Hardhat network, and build the shared UI shells that all screens will live inside.

Day 1 tasks are: initialize the pnpm monorepo with the three-package structure; install and configure Hardhat in `packages/contracts`; write `TrustifyAccessControl.sol` and `TrustifyRegistry.sol` following the specifications above; write the full Hardhat test suite (all 20+ test cases); deploy to the local Hardhat network; export ABIs to the config package; and verify that all tests pass.

Day 2 tasks are: set up the Next.js 15 project in `apps/web` with Tailwind, shadcn/ui, and Wagmi providers; build the `(public)` layout and `(app)` layout shells; build the `app-header.tsx`, `app-sidebar.tsx`, `wallet-address-chip.tsx`, `role-badge.tsx`, and `network-badge.tsx` components; implement all four guard components (`WalletGuard`, `NetworkGuard`, `AdminGuard`, `IssuerGuard`) with mock role resolution; and build the `unauthorized`, `wrong-network`, and `not-approved` pages.

### Phase 2: Core Public Flow (Day 3)

The focus is on the landing page and verification portal — the highest-traffic and most demo-critical surfaces.

Tasks: build the full landing page with all six sections (hero, trust strip, how it works, sectors grid, role entry, footer); implement the `use-document-hash.ts` hook with Web Crypto API SHA-256; build the verification dropzone with `react-dropzone`; implement all five verification result variant components using mock data; connect the verification flow to the real contract via `use-verify-document.ts`; and test the end-to-end verification path on the local network.

### Phase 3: Issuer Module (Day 4)

Tasks: build the `register-document-wizard.tsx` stepper with all four steps; implement `use-register-document.ts` orchestrating hash computation, Pinata upload, and contract write; build the documents library grid with filters; implement the detail drawer; build the revoke and supersede forms; and connect all components to real contract hooks.

### Phase 4: Admin Module & Polish (Day 5)

Tasks: build the admin dashboard KPI row reading real contract data; implement `use-all-issuers.ts` and the issuers table; build the approve-issuer form and revoke-issuer modal; implement the activity feed using `getLogs` from Viem; deploy contracts to Polygon Amoy testnet; verify contracts on Polygonscan; and run the full end-to-end demo flow against testnet.

### Developer Division (3-person team)

If the team has three developers, the optimal split is: Developer A owns the smart contracts package (all of Phase 1 Day 1) and then pivots to the admin module and shared Web3 hooks; Developer B owns the public surface (landing, verification portal) and the `use-document-hash` and `use-verify-document` hooks; Developer C owns the issuer module wizard, document library, and Pinata integration. All three collaborate on the guard components and app shell in parallel using mock role data before the real contracts are deployed.

---

## 7. Evaluation Criteria Mapping

The hackathon evaluation criteria map directly to Trustify's feature set as follows.

**Functional Prototype / MVP** is demonstrated by the complete working demo flow: admin approves issuer, issuer registers document, verifier confirms authenticity, issuer revokes, verifier sees revocation. All five verification result states (Valid, Revoked, Expired, Superseded, Not Found) are demonstrable with a single contract deployment.

**System Architecture & Design** is shown by the three-layer architecture (browser, blockchain, IPFS), the clear separation of concerns between the two contracts, the monorepo structure, and the typed, layered Web3 integration in `packages/web3`.

**Demo Use Case** will use a realistic scenario: a university (issuer) registers a degree certificate for a student; an employer (verifier) drags in the PDF and sees "Authentic" with the university's name, timestamp, and Polygonscan proof. Then the judge drags in a modified version of the same PDF and sees "Tampered / Not Found" — this single demonstration crystallizes the entire value proposition.

**Security Framework** is backed by OpenZeppelin's audited AccessControl contract, the two-step admin transfer with delay, reentrancy guards, the pausable mechanism, and the architectural principle that Trustify never handles document content server-side.

**Innovation & Scalability** is demonstrated by: client-side hashing (no server bottleneck), IPFS for file storage (no Trustify-controlled storage), O(1) hash lookups on-chain, and the zero-friction public verification (no wallet, no account needed for verifiers).

**Presentation (PPT)** should follow the story arc: pain point (fraud is rampant) → current system failures → Trustify solution → live demo → architecture deep-dive → security framework → multi-sector applicability → future roadmap (mainnet, mobile app, DID integration, QR code verification).

---

*Document prepared by the Trustify Engineering Team for Indore BGI Hackathon 2026.*  
*Research informed by OpenZeppelin Contracts documentation, Pinata IPFS best practices, Polygon developer documentation, and blockchain document authentication academic literature.*

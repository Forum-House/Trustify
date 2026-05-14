# Trustify Web Dashboard

The primary user interface for the Trustify Protocol. A high-performance, premium dashboard for Admins, Issuers, and Verifiers.

## ✨ Dashboard Roles

### 👑 Admin Dashboard
- **Issuer Management**: Approve or revoke institutions with real-time on-chain status tracking.
- **Protocol Metrics**: Global view of total documents, active issuers, and protocol activity.
- **Activity Feed**: Unified timeline of all protocol events.

### 🏢 Issuer Dashboard
- **Document Registration**: Multi-step wizard for anchoring documents to IPFS and the blockchain.
- **Inventory Management**: View, revoke, or supersede existing documents.
- **Individual Analytics**: Track issuance volume and document status.

### 🔍 Public Verifier
- **Instant Verification**: Public-facing tool to verify any document hash against the blockchain registry.
- **Provenance Tracking**: Shows document status (Active, Revoked, Superseded) and issuer identity.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query (via Wagmi)
- **Web3 Interface**: ConnectKit + Wagmi v2
- **Components**: Lucide Icons, Framer Motion

---

## 🚀 Environment Setup
The application requires several environment variables for IPFS and secure communication.

1. Copy the template:
   ```bash
   cp .env.example .env
   ```
2. Configure the following in `.env`:
   - `PINATA_JWT`: For IPFS uploads.
   - `NEXT_PUBLIC_INTERNAL_API_KEY`: For secure proxy communication.
   - `TRUSTIFY_INTERNAL_SECRET`: Internal cryptographic salt for API hardening.

---

## 🏗 Key Components
- **`IssuersTable`**: Responsive list with reactive status updates.
- **`ActivityFeed`**: Chronological log of protocol-wide events.
- **`RegisterDocumentWizard`**: High-UX form for complex document metadata.

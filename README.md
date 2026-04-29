# TerraLedger

**A Blockchain-Based Land Registry with Role-Based Governance**

TerraLedger is a decentralized application (dApp) designed to bring transparency, security, and immutability to land registration. By combining a high-performance Spring Boot backend with the Ethereum blockchain, TerraLedger ensures that property records are verifiable and tamper-proof.

---

## 🏛 System Overview

The system operates on a **Governed Approval Workflow**:
1.  **Request Initiation**: Users (OWNERS) submit a land registration request with property metadata (location, area, document hash).
2.  **Registrar Governance**: Authorized REGISTRARS review the pending requests in a secure command center.
3.  **On-Chain Minting**: Upon approval, the system interacts with the Ethereum node to mint an immutable property record on the blockchain.
4.  **Immutability**: Once registered, the record is stored permanently on the ledger, with all ownership history cryptographically traceable.

## 🛠 Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion (Glassmorphism UI), Lucide Icons.
-   **Backend**: Java 17, Spring Boot, Spring Security (JWT), Web3j.
-   **Blockchain**: Solidity 0.8.28, Hardhat (EVM compatible).
-   **Infrastructure**: Docker, Docker Compose, PostgreSQL 15.

## 🚀 Getting Started

The entire stack is containerized for a seamless demo experience.

```bash
# Clone the repository
git clone https://github.com/akxh5/TerraLedger.git
cd TerraLedger

# Start the full stack
./start.sh
```

**Access Points:**
- **Web Interface**: `http://localhost:5173`
- **REST API**: `http://localhost:8080`
- **Blockchain Node**: `http://localhost:8545`

## ✨ Core Features

-   **JWT-Based Authentication**: Secure role-based access for Owners and Registrars.
-   **Glassmorphic UI**: A modern, refractive interface designed for clarity and data density.
-   **Blockchain Synchronization**: Real-time updates between the PostgreSQL database and the EVM ledger.
-   **Global Search**: Instant lookup of property records by location, owner, or asset ID.
-   **Transaction Tracking**: Direct visibility into blockchain transaction hashes for every approved record.

## ⚠️ Limitations & Future Scope

### Current Limitations (Demo Mode)
-   **Transfer Logic**: Ownership transfer is currently simulated on-chain but disabled in the UI to prioritize registration stability.
-   **Storage**: Document hashes are stored as metadata; actual IPFS integration is simulated in this version.

### Future Scope
-   **Fractional Ownership**: Splitting property rights into tradable digital tokens.
-   **Automated KYC**: Integration with digital identity providers for instant user verification.
-   **Dispute Resolution**: Governance-based mechanisms for resolving property claims.

---
**TerraLedger**: Moving the world's most valuable asset class onto the ledger.

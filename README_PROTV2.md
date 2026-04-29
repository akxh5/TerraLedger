# TerraLedger PROTV2 - Demo Edition

Welcome to TerraLedger PROTV2, a stabilized, enterprise-ready full-stack prototype for decentralized land registration.

## 🚀 Quick Start (Demo Mode)

The entire system is containerized and orchestrated for a one-click startup.

```bash
./start.sh
```

This script will:
1. Start PostgreSQL and a Hardhat blockchain node.
2. Deploy the TerraLedger Smart Contract automatically.
3. Inject the contract address into the backend.
4. Launch the Spring Boot backend and React frontend.

**Access Points:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **Blockchain RPC:** http://localhost:8545

## 🎯 Demo Scope (Verified Features)

This version is optimized for stability. The following flows are verified for the live demo:

1.  **Authentication**: Secure login for `REGISTRAR` and `OWNER` roles using JWT.
2.  **Governed Registration**: 
    - `OWNER` submits a "Land Request" with metadata.
    - `REGISTRAR` reviews and "Approves" the request.
    - Automatic minting of immutable property records on the blockchain.
3.  **Real-time Dashboard**: Live status tracking of requests and global registry stats.
4.  **Global Search**: Instant database-backed search across the entire registry.

*Note: Transfer Ownership features are currently disabled in the UI to ensure ledger consistency during the demo.*

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Vite.
- **Backend**: Java 17, Spring Boot, Web3j, Spring Security (JWT).
- **Blockchain**: Solidity 0.8.28, Hardhat, Ethers.js.
- **Database**: PostgreSQL 15.
- **Orchestration**: Docker, Docker Compose.

## 🧪 Validation

To run the automated E2E validation suite (requires services to be running):
```bash
node e2e-test.js
```

---
**TerraLedger**: Immutable Trust. Transparent Governance.

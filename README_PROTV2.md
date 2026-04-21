# TerraLedger PROTV2

Welcome to TerraLedger PROTV2, the hardened enterprise-ready backend for decentralized land registration.

## System Architecture

The core of TerraLedger relies on combining high-throughput database records with immutable blockchain consensus. The primary validation flow follows these steps:

1. **Owner Initiation**: An authenticated `OWNER` submits a land registration payload including location, area, and document IPFS hash via the REST API.
2. **Database Staging**: The request is durably stored in PostgreSQL with a `PENDING` status. The system prevents duplicates and ensures data integrity.
3. **Registrar Review**: An authorized `REGISTRAR` reviews pending requests. 
4. **Blockchain Consensus**: The registrar approves the request. The backend immediately talks to the Ethereum node to mint an immutable property record using the TerraLedger Smart Contract.
5. **Database Finalization**: Upon receiving a successful transaction receipt from the blockchain, the database finalizes the request status to `APPROVED`, attaching the exact transaction hash.

## How to Run

### 1. Hardhat Node
Start the local Ethereum blockchain simulation:
```bash
cd smart-contract
npx hardhat node
```
Open a new terminal and deploy the contract:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### 2. Backend (Spring Boot)
Ensure your PostgreSQL `terraledger` database is created and running. Start the backend:
```bash
cd spring-boot
mvn spring-boot:run
```

### 3. Frontend (Vite)
To serve the React UI:
```bash
cd frontend
npm install
npm run dev
```

## Automated Hardening Validation

We provide an automated End-to-End node script that aggressively validates Edge Cases, Idempotency, and Authentication rules, confirming our strict Global Error Handling works as intended.

To run the validation:
```bash
node e2e-test.js
```

You should see all edge case tests pass successfully, confirming that constraints like HTTP 403 (Unauthorized Access), HTTP 404 (Invalid UUID), and HTTP 400 (Duplicate Approvals) yield exactly the expected behaviors.

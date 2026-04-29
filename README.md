# TerraLedger

**A Blockchain-Integrated Land Registry with Multi-Tiered Governance**

TerraLedger is a sophisticated decentralized architecture engineered to instill transparency, cryptographic security, and absolute immutability within the domain of land registration. By synthesizing a robust Spring Boot backend with the Ethereum blockchain, TerraLedger establishes property records that are empirically verifiable and inherently resilient against unauthorized modification.

---

## Architectural Paradigm

The ecosystem operates through a rigorous **Governed Validation Workflow**:
1.  **Submission Phase**: Stakeholders (OWNERS) transmit a land registration payload comprising granular property metadata, including spatial coordinates, dimensional area, and a cryptographic document hash.
2.  **Governance Review**: Authorized REGISTRARS analyze pending submissions within a centralized, secure administrative interface.
3.  **On-Chain Finalization**: Upon successful validation, the system orchestrates an interaction with the Ethereum node to mint an immutable digital twin of the property record on the distributed ledger.
4.  **Persistent Provenance**: Once finalized, the record resides permanently on the blockchain, with all subsequent ownership transitions being cryptographically traceable and immutable.

## Technical Composition

-   **Frontend**: React ecosystem leveraged via Vite, utilizing Tailwind CSS and Framer Motion to deliver a refractive, high-density glassmorphism interface.
-   **Backend**: Java 17 enterprise framework (Spring Boot), utilizing Spring Security for JWT-based session management and Web3j for blockchain interoperability.
-   **Blockchain**: Solidity 0.8.28 smart contracts deployed via a Hardhat EVM-compatible environment.
-   **Infrastructure**: Unified containerization through Docker and Docker Compose, supported by a PostgreSQL 15 relational persistence layer.

## Implementation Guide

The entire architecture is containerized to ensure consistent deployment and uninterrupted evaluation.

```bash
# Clone the repository
git clone https://github.com/akxh5/TerraLedger.git
cd TerraLedger

# Orchestrate the full stack
./start.sh
```

**Network Access Points:**
- **Interface Layer**: `http://localhost:5173`
- **Application API**: `http://localhost:8080`
- **Distributed Ledger RPC**: `http://localhost:8545`

## Core Functional Capacities

-   **Cryptographic Authentication**: Secure, role-based access control managed via JSON Web Tokens for diverse user tiers.
-   **Refractive Interface Design**: A contemporary, high-fidelity UI optimized for clarity, structural elegance, and data density.
-   **Ledger-Database Reciprocity**: Real-time synchronization between the PostgreSQL relational store and the EVM-based distributed ledger.
-   **Universal Registry Querying**: High-performance lookup of property records indexed by location, owner identity, or unique asset identifiers.
-   **Transaction Transparency**: Direct exposure of blockchain transaction hashes, providing empirical evidence for every validated record.

## Constraints and Evolutionary Path

### Contemporary Constraints (Demonstration Context)
-   **Transfer Logic**: Ownership transfer mechanisms are functional on-chain but currently suppressed in the UI to maintain absolute registration integrity.
-   **Persistence**: Document hashes are preserved as metadata; comprehensive IPFS integration is simulated in this current iteration.

### Evolutionary Trajectory
-   **Fractionalized Assets**: Tokenization of property rights into granular, liquid digital assets.
-   **Autonomous Identity Verification**: Integration with sovereign identity protocols for instantaneous stakeholder validation.
-   **Governance-Led Dispute Resolution**: Consensus-driven mechanisms for the adjudication of property-related claims.

---
**TerraLedger**: Transitioning global real estate into the era of immutable provenance.

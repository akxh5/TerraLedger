:::writing{variant=“standard” id=“48391”}

TerraLedger

TerraLedger is a blockchain-powered land registry system that enables secure land registration, ownership transfers, and immutable property history using smart contracts.

The project demonstrates how government land registries can leverage blockchain technology to ensure transparency, tamper-resistance, and traceable ownership records.

⸻

Architecture

TerraLedger follows a full-stack Web3 architecture.

Frontend (React + Tailwind Glass UI)
↓
Spring Boot REST API
↓
Web3j Blockchain Client
↓
TerraLedger Smart Contract (Solidity)
↓
Hardhat Local Blockchain
↓
IPFS (Document Hash Storage)

⸻

Features

Land Registration

Government registrar can register new land records on-chain.

Stored data includes:
	•	Land ID
	•	Owner Name
	•	Location
	•	Area
	•	IPFS document hash

⸻

Ownership Transfer Workflow

Secure transfer process:
	1.	Owner initiates transfer
	2.	Registrar verifies transfer
	3.	Ownership updates on-chain

⸻

Immutable Ownership History

Each property stores a complete history of ownership.

Example:

Owner A → Owner B → Owner C

This history cannot be modified or deleted.

⸻

IPFS Document Hash Storage

Property documents are stored off-chain on IPFS.

Only the content hash is stored on blockchain for verification.

⸻

Modern Glass UI Dashboard

The frontend uses React + Tailwind CSS with a glassmorphism design inspired by Apple’s liquid glass style.

Features:
	•	Dashboard overview
	•	Land registration form
	•	Property search
	•	Ownership transfer interface
	•	Ownership history timeline
	•	Blockchain transaction notifications

⸻

Tech Stack

Smart Contract
	•	Solidity
	•	Hardhat

Backend
	•	Java
	•	Spring Boot
	•	Web3j

Frontend
	•	React
	•	Vite
	•	Tailwind CSS
	•	React Query
	•	Axios
	•	react-hot-toast

Storage
	•	IPFS (document hashes)

⸻

API Endpoints

Base URL:

http://localhost:8080

Register Land

POST /land/register

Example payload:

{
  "landId": "LAND-001",
  "ownerName": "Akshansh Sharma",
  "location": "Bhopal",
  "area": 1200,
  "documentHash": "QmTestHash"
}


⸻

Get Land Record

GET /land/{id}

Example:

GET /land/1


⸻

Initiate Ownership Transfer

POST /land/transfer/initiate

{
  "landId": 1,
  "toAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
}


⸻

Approve Transfer

POST /land/transfer/approve

{
  "landId": 1
}


⸻

Ownership History

GET /land/history/{id}

Example response:

[
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
]


⸻

Running the Project

1 Start Hardhat Blockchain

cd smart-contract
npx hardhat node


⸻

2 Deploy Smart Contract

npx hardhat run scripts/deploy.ts --network localhost


⸻

3 Start Backend

cd spring-boot
mvn spring-boot:run

Backend runs on:

http://localhost:8080


⸻

4 Start Frontend

cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173


⸻

Project Structure

terraledger
│
├── smart-contract
│   ├── contracts
│   ├── scripts
│   └── hardhat.config.ts
│
├── spring-boot
│   └── TerraLedger backend API
│
├── frontend
│   └── React + Tailwind UI
│
└── README.md


⸻

Example Flow
	1.	Register land from frontend
	2.	Backend submits blockchain transaction
	3.	Smart contract stores land record
	4.	Transaction hash returned
	5.	Property can be searched and transferred

⸻

Future Improvements
	•	NFT-based land titles (ERC721)
	•	MetaMask wallet authentication
	•	Smart contract event listeners
	•	Blockchain activity dashboard
	•	IPFS document preview
	•	Deployment to public testnet

⸻

Author

Akshansh Sharma

Computer Science Engineer
Web3 Builder
Superteam Member

⸻

License

MIT License
:::


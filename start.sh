#!/bin/bash

# TerraLedger PROTV2 - Demo Orchestrator (Reliability Refactor)

echo "🚀 Starting TerraLedger PROTV2 Orchestration..."

# 1. Start Infrastructure (Postgres & Hardhat)
echo "📦 Starting Database and Blockchain node..."
docker-compose up -d postgres hardhat

# 2. Wait for Hardhat to be ready
echo "⏳ Waiting for Hardhat node to initialize..."
until curl -s -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:8545 > /dev/null; do
  sleep 2
done
echo "✅ Hardhat node is ready!"

# 3. Deploy Smart Contract
echo "📜 Deploying TerraLedger Smart Contract..."
cd smart-contract
# Deploy to the node running in docker
# (Local npm install is fast if node_modules already exists)
npm install > /dev/null 2>&1
DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.ts --network localhost)
echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "TerraLedger deployed to:" | awk '{print $4}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Failed to extract contract address. Manual intervention required."
    exit 1
fi

echo "📍 Contract deployed at: $CONTRACT_ADDRESS"

# Write to .env for docker-compose to pick up
echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > ../.env
echo "✅ Contract address persisted to .env"

cd ..

# 4. Stability Delay
echo "⏳ Brief pause to ensure blockchain consistency..."
sleep 5

# 5. Start Backend and Frontend
echo "☕ Starting Services (Backend & Frontend)..."
docker-compose up -d --build backend frontend

echo ""
echo "===================================================="
echo "✨ TerraLedger PROTV2 is UP AND RUNNING!"
echo "----------------------------------------------------"
echo "🌐 Frontend: http://localhost:5173"
echo "⚙️  Backend:  http://localhost:8080"
echo "🔗 RPC URL:  http://localhost:8545"
echo "📍 Contract: $CONTRACT_ADDRESS"
echo "===================================================="
echo "Use './stop.sh' to shut down all services."

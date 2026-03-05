import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("CONTRACT_ADDRESS environment variable is not set.");
    process.exitCode = 1;
    return;
  }

  const [deployer, addr1] = await ethers.getSigners();

  const TerraLedger = await ethers.getContractFactory("TerraLedger");
  const terraLedger = await TerraLedger.attach(contractAddress);

  console.log("Attaching to TerraLedger at address:", contractAddress);

  // --- Test 1: Register a sample land record using the deployer (registrar) with initial IPFS hash ---
  const landId1 = "LAND-001";
  const ownerName1 = "Akshansh Sharma";
  const location1 = "Bhopal, MP";
  const area1 = 1200;
  const initialDocumentHash = "QmInitialTestHash123456789"; // Initial mock IPFS hash

  console.log("\n--- Attempting to register land with registrar (deployer) ---");
  const registerTx1 = await terraLedger.connect(deployer).registerLand(
    landId1,
    ownerName1,
    location1,
    area1,
    initialDocumentHash // Pass the initial document hash
  );
  await registerTx1.wait();
  console.log("Successful registration by registrar confirmed. Transaction hash:", registerTx1.hash);

  // Fetch record with id 1 and print initial documentHash
  console.log("Fetching record with ID 1...");
  let record1 = await terraLedger.records(1);

  console.log(`
--- Registered Land Record (by Registrar) ---`);
  console.log("ID:", Number(record1.id));
  console.log("Land ID:", record1.landId);
  console.log("Owner Name:", record1.ownerName);
  console.log("Location:", record1.location);
  console.log("Area:", Number(record1.area));
  console.log("Registered By:", record1.registeredBy);
  console.log("Current Owner:", record1.currentOwner);
  console.log("Is Active:", record1.isActive);
  console.log("Document Hash:", record1.documentHash); // Print initial document hash
  console.log("----------------------------");

  // --- Test 2: Attempt to register land using a second account (non-registrar) ---
  const landId2 = "LAND-002";
  const ownerName2 = "Non-Registrar User";
  const location2 = "Indore, MP";
  const area2 = 800;
  const documentHash2 = "QmAnotherTestHash"; // Another mock IPFS hash

  console.log("\n--- Attempting to register land with non-registrar (addr1) ---");
  try {
    await terraLedger.connect(addr1).registerLand(
      landId2,
      ownerName2,
      location2,
      area2,
      documentHash2
    );
    console.error("Error: Non-registrar unexpectedly registered land!");
    process.exitCode = 1;
  } catch (error: any) {
    if (error.message.includes("Not authorized: Registrar only")) {
      console.log("Unauthorized registration blocked successfully!");
    } else {
      console.error("An unexpected error occurred during non-registrar registration:", error.message);
      process.exitCode = 1;
    }
  }

  // --- Test 3: Initiate and Approve Land Transfer ---
  const landToTransferId = 1; // Land registered by deployer
  const newOwner = addr1.address;

  console.log(`\n--- Initiating transfer for land ID ${landToTransferId} from ${deployer.address} to ${newOwner} ---`);
  const initiateTransferTx = await terraLedger.connect(deployer).initiateTransfer(landToTransferId, newOwner);
  await initiateTransferTx.wait();
  console.log("Transfer initiated successfully. Transaction hash:", initiateTransferTx.hash);

  console.log(`\n--- Approving transfer for land ID ${landToTransferId} by registrar (${deployer.address}) ---`);
  const approveTransferTx = await terraLedger.connect(deployer).approveTransfer(landToTransferId);
  await approveTransferTx.wait();
  console.log("Transfer approved successfully. Transaction hash:", approveTransferTx.hash);

  // Verify new owner
  console.log(`\n--- Verifying new owner for land ID ${landToTransferId} ---`);
  record1 = await terraLedger.records(landToTransferId); // Re-fetch the record
  console.log("New Current Owner:", record1.currentOwner);

  if (record1.currentOwner === newOwner) {
    console.log("New owner verified successfully!");
  } else {
    console.error("Error: New owner verification failed!");
    process.exitCode = 1;
  }

  // --- Test 4: Verify Ownership History ---
  console.log(`\n--- Verifying ownership history for land ID ${landToTransferId} ---`);
  const ownershipHistory = await terraLedger.getOwnershipHistory(landToTransferId);
  console.log("Full Ownership History:", ownershipHistory);
  console.log("Initial Owner:", ownershipHistory[0]);
  console.log("New Owner (after transfer):", ownershipHistory[1]);

  if (ownershipHistory[0] === deployer.address && ownershipHistory[1] === newOwner) {
    console.log("Ownership history verified successfully!");
  } else {
    console.error("Error: Ownership history verification failed!");
    process.exitCode = 1;
  }

  // --- Test 5: Update Document Hash ---
  const updatedDocumentHash = "QmUpdatedTestHashABCDEF"; // New mock IPFS hash
  console.log(`\n--- Updating document hash for land ID ${landToTransferId} to ${updatedDocumentHash} ---`);
  const updateDocTx = await terraLedger.connect(deployer).updateDocumentHash(landToTransferId, updatedDocumentHash);
  await updateDocTx.wait();
  console.log("Document hash updated successfully. Transaction hash:", updateDocTx.hash);

  // Fetch record again and print updated document hash
  console.log(`\n--- Fetching record with ID ${landToTransferId} to verify updated document hash ---`);
  record1 = await terraLedger.records(landToTransferId); // Re-fetch the record
  console.log("Updated Document Hash:", record1.documentHash);

  if (record1.documentHash === updatedDocumentHash) {
    console.log("Document hash updated and verified successfully!");
  } else {
    console.error("Error: Document hash update verification failed!");
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

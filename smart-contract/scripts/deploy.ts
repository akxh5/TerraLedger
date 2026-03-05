import { ethers } from "hardhat";

async function main() {
  const TerraLedger = await ethers.getContractFactory("TerraLedger");
  const terraLedger = await TerraLedger.deploy();

  await terraLedger.waitForDeployment();

  console.log(`TerraLedger deployed to: ${terraLedger.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

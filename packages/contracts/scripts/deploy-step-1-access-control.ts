import { ethers, network } from "hardhat";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const balance = await ethers.provider.getBalance(deployer.address);
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice || ethers.parseUnits("30", "gwei");

  console.log(`\n--- Deployment Step 1: Access Control (${network.name}) ---`);
  
  const AccessControl = await ethers.getContractFactory("TrustifyAccessControl");
  const estGas = await ethers.provider.estimateGas(await AccessControl.getDeployTransaction(deployer.address));
  const required = (BigInt(estGas) * gasPrice * 120n) / 100n;

  console.log(`Balance:  ${ethers.formatEther(balance)} POL`);
  console.log(`Required: ~${ethers.formatEther(required)} POL`);

  if (balance < required) {
    throw new Error("Insufficient funds even for Step 1. Please get more POL.");
  }

  console.log("Deploying TrustifyAccessControl...");
  const accessControl = await AccessControl.deploy(deployer.address);
  await accessControl.waitForDeployment();
  const acAddress = await accessControl.getAddress();
  console.log(`✅ Deployed to: ${acAddress}`);

  // Save partial metadata
  const fileName = network.name === "localhost" ? "localhost.json" : network.name === "amoy" ? "amoy.json" : "polygon.json";
  const outPath = join(process.cwd(), "..", "..", "infra", "deployments", fileName);
  
  let metadata = { contracts: {} };
  try {
    metadata = JSON.parse(readFileSync(outPath, "utf-8"));
  } catch (e) {}

  metadata.network = network.name;
  metadata.chainId = Number(network.config.chainId ?? 0);
  metadata.deployer = deployer.address;
  metadata.contracts.TrustifyAccessControl = {
    address: acAddress,
    txHash: accessControl.deploymentTransaction()?.hash ?? ""
  };

  mkdirSync(join(process.cwd(), "..", "..", "infra", "deployments"), { recursive: true });
  writeFileSync(outPath, JSON.stringify(metadata, null, 2));
  console.log(`✨ Step 1 Complete. Metadata saved to ${fileName}`);
}

main().catch(console.error);

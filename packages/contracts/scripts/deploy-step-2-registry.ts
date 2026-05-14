import { ethers, network } from "hardhat";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const balance = await ethers.provider.getBalance(deployer.address);
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice || ethers.parseUnits("30", "gwei");

  const fileName = network.name === "localhost" ? "localhost.json" : network.name === "amoy" ? "amoy.json" : "polygon.json";
  const outPath = join(process.cwd(), "..", "..", "infra", "deployments", fileName);
  const metadata = JSON.parse(readFileSync(outPath, "utf-8"));

  const acAddress = metadata.contracts.TrustifyAccessControl?.address;
  if (!acAddress) {
    throw new Error("Access Control address not found in metadata. Run Step 1 first!");
  }

  console.log(`\n--- Deployment Step 2: Registry (${network.name}) ---`);
  console.log(`Linking to Access Control: ${acAddress}`);

  const Registry = await ethers.getContractFactory("TrustifyRegistry");
  const estGas = await ethers.provider.estimateGas(await Registry.getDeployTransaction(acAddress));
  const required = (BigInt(estGas) * gasPrice * 120n) / 100n;

  console.log(`Balance:  ${ethers.formatEther(balance)} POL`);
  console.log(`Required: ~${ethers.formatEther(required)} POL`);

  if (balance < required) {
    throw new Error("Insufficient funds for Step 2. Please visit a faucet!");
  }

  console.log("Deploying TrustifyRegistry...");
  const registry = await Registry.deploy(acAddress);
  await registry.waitForDeployment();
  const regAddress = await registry.getAddress();
  console.log(`✅ Deployed to: ${regAddress}`);

  metadata.contracts.TrustifyRegistry = {
    address: regAddress,
    txHash: registry.deploymentTransaction()?.hash ?? ""
  };

  writeFileSync(outPath, JSON.stringify(metadata, null, 2));
  console.log(`✨ Step 2 Complete. Final metadata saved to ${fileName}`);
}

main().catch(console.error);

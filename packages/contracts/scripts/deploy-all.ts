const { ethers, network } = require("hardhat");
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error(`No signer available for network '${network.name}'.`);
  }
  const deployer = signers[0];
  const balance = await ethers.provider.getBalance(deployer.address);
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice || ethers.parseUnits("30", "gwei");

  console.log(`\n--- Deployment Safety Check (${network.name}) ---`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance:  ${ethers.formatEther(balance)} POL`);
  console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  // 1. Prepare Factories
  const AccessControl = await ethers.getContractFactory("TrustifyAccessControl");
  const Registry = await ethers.getContractFactory("TrustifyRegistry");

  // 2. Estimate Costs
  const estGasAC = await ethers.provider.estimateGas(await AccessControl.getDeployTransaction(deployer.address));
  const estGasReg = await ethers.provider.estimateGas(await Registry.getDeployTransaction(deployer.address)); // Using dummy address for estimation

  const totalGas = estGasAC + estGasReg;
  const totalCost = BigInt(totalGas) * gasPrice;
  const buffer = (totalCost * 20n) / 100n; // 20% buffer
  const required = totalCost + buffer;

  console.log(`Estimated Cost: ${ethers.formatEther(required)} POL (including 20% buffer)`);

  if (balance < required) {
    console.error(`\n❌ ERROR: Insufficient funds.`);
    console.error(`You have ${ethers.formatEther(balance)} POL but need ~${ethers.formatEther(required)} POL.`);
    console.error(`Please get at least ${ethers.formatEther(required - balance)} more POL from a faucet.`);
    process.exit(1);
  }

  console.log(`\n✅ Funds sufficient. Starting deployment...\n`);

  // 3. Deployment
  console.log("Deploying TrustifyAccessControl...");
  const accessControl = await AccessControl.deploy(deployer.address);
  await accessControl.waitForDeployment();
  console.log(`TrustifyAccessControl deployed to: ${await accessControl.getAddress()}`);

  console.log("Deploying TrustifyRegistry...");
  const registry = await Registry.deploy(await accessControl.getAddress());
  await registry.waitForDeployment();
  console.log(`TrustifyRegistry deployed to: ${await registry.getAddress()}`);

  // 4. Save Metadata
  const metadata = {
    network: network.name,
    chainId: Number(network.config.chainId ?? 0),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      TrustifyAccessControl: {
        address: await accessControl.getAddress(),
        txHash: accessControl.deploymentTransaction()?.hash ?? ""
      },
      TrustifyRegistry: {
        address: await registry.getAddress(),
        txHash: registry.deploymentTransaction()?.hash ?? ""
      }
    }
  };

  const fileName =
    network.name === "localhost"
      ? "localhost.json"
      : network.name === "amoy"
        ? "amoy.json"
        : "polygon.json";

  const outDir = join(process.cwd(), "..", "..", "infra", "deployments");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, fileName), JSON.stringify(metadata, null, 2));

  console.log(`\n✨ Deployment complete! Metadata: infra/deployments/${fileName}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

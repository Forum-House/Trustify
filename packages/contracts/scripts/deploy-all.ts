import { ethers, network } from "hardhat";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error(
      `No signer available for network '${network.name}'. Set DEPLOYER_PRIVATE_KEY in root .env for non-local networks.`
    );
  }

  const deployer = signers[0];

  const AccessControl = await ethers.getContractFactory("TrustifyAccessControl");
  const accessControl = await AccessControl.deploy(deployer.address);
  await accessControl.waitForDeployment();

  const Registry = await ethers.getContractFactory("TrustifyRegistry");
  const registry = await Registry.deploy(await accessControl.getAddress());
  await registry.waitForDeployment();

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

  console.log(`Deployment metadata written: infra/deployments/${fileName}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

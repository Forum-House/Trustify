import { ethers, network } from "hardhat";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type DeploymentsFile = {
  contracts: {
    TrustifyAccessControl: {
      address: string;
    };
  };
};

function getDeploymentFileName(networkName: string) {
  if (networkName === "localhost") return "localhost.json";
  if (networkName === "amoy") return "amoy.json";
  if (networkName === "polygon") return "polygon.json";
  throw new Error(`Unsupported network '${networkName}'.`);
}

async function main() {
  const adminAddress = process.env.ADMIN_ADDRESS;
  const roleType = process.env.ROLE_TYPE || "PAUSER"; // PAUSER | FULL

  if (!adminAddress || !ethers.isAddress(adminAddress)) {
    throw new Error("Set a valid ADMIN_ADDRESS env var.");
  }

  const fileName = getDeploymentFileName(network.name);
  const deploymentPath = join(process.cwd(), "..", "..", "infra", "deployments", fileName);
  const deployment = JSON.parse(readFileSync(deploymentPath, "utf8")) as DeploymentsFile;

  const accessControlAddress = deployment.contracts.TrustifyAccessControl.address;
  const accessControl = await ethers.getContractAt("TrustifyAccessControl", accessControlAddress);

  if (roleType === "PAUSER") {
    console.log(`Granting PAUSER_ROLE to ${adminAddress}...`);
    const role = await accessControl.PAUSER_ROLE();
    const tx = await accessControl.grantRole(role, adminAddress);
    await tx.wait();
    console.log(`✅ Success! ${adminAddress} can now pause/unpause the contract.`);
  } 
  else if (roleType === "FULL") {
    console.log(`Initiating DEFAULT_ADMIN_ROLE transfer to ${adminAddress}...`);
    // Note: AccessControlDefaultAdminRules requires a two-step transfer with a 3-day delay.
    const tx = await accessControl.beginDefaultAdminTransfer(adminAddress);
    await tx.wait();
    
    const delay = await accessControl.defaultAdminTransferDelay();
    console.log(`✅ Transfer initiated!`);
    console.log(`⚠️  Wait ${Number(delay) / (24 * 3600)} days, then ${adminAddress} must call acceptDefaultAdminTransfer().`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

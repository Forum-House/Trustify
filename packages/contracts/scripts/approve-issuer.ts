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
  throw new Error(`Unsupported network '${networkName}'. Use localhost | amoy | polygon.`);
}

async function main() {
  const issuerAddress = process.env.ISSUER_ADDRESS;
  const issuerName = process.env.ISSUER_NAME || "Default Org";
  const issuerSector = process.env.ISSUER_SECTOR || "education";

  if (!issuerAddress || !ethers.isAddress(issuerAddress)) {
    throw new Error("Set a valid ISSUER_ADDRESS env var, e.g. ISSUER_ADDRESS=0xabc...");
  }

  const fileName = getDeploymentFileName(network.name);
  const deploymentPath = join(process.cwd(), "..", "..", "infra", "deployments", fileName);
  const deployment = JSON.parse(readFileSync(deploymentPath, "utf8")) as DeploymentsFile;

  const accessControlAddress = deployment.contracts.TrustifyAccessControl.address;
  if (!ethers.isAddress(accessControlAddress)) {
    throw new Error(`Invalid TrustifyAccessControl address in ${deploymentPath}`);
  }

  const code = await ethers.provider.getCode(accessControlAddress);
  if (code === "0x") {
    throw new Error(
      `No contract found at ${accessControlAddress} on network '${network.name}'. ` +
        `Your deployment metadata is likely stale for the current node. ` +
        `Re-run deploy:localhost and retry approve script.`
    );
  }

  const accessControl = await ethers.getContractAt("TrustifyAccessControl", accessControlAddress);
  
  console.log(`Approving ${issuerName} (${issuerSector}) at ${issuerAddress}...`);
  const tx = await accessControl.approveIssuer(issuerAddress, issuerName, issuerSector);
  const receipt = await tx.wait();
  
  const isIssuer = await accessControl.isIssuer(issuerAddress);

  console.log(`Network: ${network.name}`);
  console.log(`Tx Hash: ${tx.hash}`);
  console.log(`Approved: ${isIssuer}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

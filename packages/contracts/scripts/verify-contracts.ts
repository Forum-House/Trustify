import { network, run } from "hardhat";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Deployment = {
  contracts: {
    TrustifyAccessControl: { address: string };
    TrustifyRegistry: { address: string };
  };
};

async function main() {
  const file = network.name === "amoy" ? "amoy.json" : "polygon.json";
  const path = join(process.cwd(), "..", "..", "infra", "deployments", file);
  const deployment = JSON.parse(readFileSync(path, "utf-8")) as Deployment;

  await run("verify:verify", { address: deployment.contracts.TrustifyAccessControl.address, constructorArguments: [] });
  await run("verify:verify", {
    address: deployment.contracts.TrustifyRegistry.address,
    constructorArguments: [deployment.contracts.TrustifyAccessControl.address]
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

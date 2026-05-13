import { network, run } from "hardhat";
import { readFileSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const file = network.name === "amoy" ? "amoy.json" : "polygon.json";
  const path = join(process.cwd(), "..", "..", "infra", "deployments", file);
  const deployment = JSON.parse(readFileSync(path, "utf-8"));

  console.log(`\n--- Verifying Contracts on ${network.name} ---`);

  // 1. Verify AccessControl
  console.log("Verifying TrustifyAccessControl...");
  try {
    await run("verify:verify", {
      address: deployment.contracts.accessControl,
      constructorArguments: [deployment.deployer],
    });
  } catch (error: any) {
    console.error("AccessControl Verification Error:", error.message);
  }

  // 2. Verify Registry
  console.log("\nVerifying TrustifyRegistry...");
  try {
    await run("verify:verify", {
      address: deployment.contracts.registry,
      constructorArguments: [deployment.contracts.accessControl],
    });
  } catch (error: any) {
    console.error("Registry Verification Error:", error.message);
  }

  console.log("\n✨ Verification process complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

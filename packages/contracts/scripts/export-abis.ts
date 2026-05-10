import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const contracts = ["TrustifyAccessControl", "TrustifyRegistry"] as const;

function toAbiTs(name: string, abi: unknown): string {
  const symbol = `${name}Abi`;
  return `export const ${symbol} = ${JSON.stringify(abi, null, 2)} as const;\n`;
}

function main() {
  const artifactsRoot = join(process.cwd(), "artifacts", "contracts");
  const configAbisDir = join(process.cwd(), "..", "config", "src", "abis");
  const infraAbisDir = join(process.cwd(), "..", "..", "infra", "deployments", "abis");

  mkdirSync(configAbisDir, { recursive: true });
  mkdirSync(infraAbisDir, { recursive: true });

  for (const c of contracts) {
    const artifactPath = join(artifactsRoot, `${c}.sol`, `${c}.json`);
    const artifact = JSON.parse(readFileSync(artifactPath, "utf-8")) as { abi: unknown };

    writeFileSync(join(configAbisDir, `${c}.abi.ts`), toAbiTs(c, artifact.abi));
    writeFileSync(join(infraAbisDir, `${c}.json`), JSON.stringify({ abi: artifact.abi }, null, 2));
  }

  console.log("ABI export complete -> packages/config/src/abis + infra/deployments/abis");
}

main();

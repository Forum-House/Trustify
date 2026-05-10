import { expect } from "chai";
import { ethers } from "hardhat";

async function setup() {
  const [admin, issuer] = await ethers.getSigners();
  const AC = await ethers.getContractFactory("TrustifyAccessControl");
  const ac = await AC.deploy(admin.address);
  await ac.waitForDeployment();

  const R = await ethers.getContractFactory("TrustifyRegistry");
  const reg = await R.deploy(await ac.getAddress());
  await reg.waitForDeployment();

  await ac.approveIssuer(issuer.address);
  return { issuer, reg };
}

describe("TrustifyRegistry.verify", function () {
  it("returns not found for unknown hash", async function () {
    const { reg } = await setup();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("missing"));
    const res = await reg.verifyDocument(hash);
    expect(res.exists).to.eq(false);
    expect(res.valid).to.eq(false);
  });

  it("returns valid for active document", async function () {
    const { issuer, reg } = await setup();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const hash = ethers.keccak256(ethers.toUtf8Bytes("active"));

    await reg.connect(issuer).registerDocument(hash, "cid", "Alice", "ID1", "Degree", 0, now, now + 3600);
    const res = await reg.verifyDocument(hash);
    expect(res.exists).to.eq(true);
    expect(res.valid).to.eq(true);
  });
});

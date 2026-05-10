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
  const oldHash = ethers.keccak256(ethers.toUtf8Bytes("old"));
  await reg.connect(issuer).registerDocument(oldHash, "cid", "Alice", "ID1", "Degree", 0, 1, 10000000000);

  return { issuer, reg, oldHash };
}

describe("TrustifyRegistry.supersede", function () {
  it("issuer can supersede and old becomes superseded", async function () {
    const { issuer, reg, oldHash } = await setup();
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("new"));

    await expect(reg.connect(issuer).supersedeDocument(oldHash, newHash)).to.emit(reg, "DocumentSuperseded");
    const oldDoc = await reg.getDocument(oldHash);
    expect(oldDoc.status).to.eq(3);
    expect(oldDoc.supersededByHash).to.eq(newHash);
  });
});

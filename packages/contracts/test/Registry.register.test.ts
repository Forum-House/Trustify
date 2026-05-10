import { expect } from "chai";
import { ethers } from "hardhat";

async function setup() {
  const [admin, issuer, other] = await ethers.getSigners();
  const AC = await ethers.getContractFactory("TrustifyAccessControl");
  const ac = await AC.deploy(admin.address);
  await ac.waitForDeployment();

  const R = await ethers.getContractFactory("TrustifyRegistry");
  const reg = await R.deploy(await ac.getAddress());
  await reg.waitForDeployment();

  await ac.approveIssuer(issuer.address);
  return { admin, issuer, other, ac, reg };
}

describe("TrustifyRegistry.register", function () {
  it("approved issuer can register", async function () {
    const { issuer, reg } = await setup();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("doc-1"));

    await expect(
      reg.connect(issuer).registerDocument(hash, "cid", "Alice", "ID1", "Degree", 0, 1, 2)
    ).to.emit(reg, "DocumentRegistered");
  });

  it("non-issuer cannot register", async function () {
    const { other, reg } = await setup();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("doc-2"));

    await expect(
      reg.connect(other).registerDocument(hash, "cid", "Alice", "ID1", "Degree", 0, 1, 2)
    ).to.be.revertedWithCustomError(reg, "Unauthorized");
  });

  it("duplicate hash is rejected", async function () {
    const { issuer, reg } = await setup();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("doc-3"));

    await reg.connect(issuer).registerDocument(hash, "cid", "Alice", "ID1", "Degree", 0, 1, 2);
    await expect(
      reg.connect(issuer).registerDocument(hash, "cid", "Alice", "ID1", "Degree", 0, 1, 2)
    ).to.be.revertedWithCustomError(reg, "DocumentAlreadyExists");
  });
});

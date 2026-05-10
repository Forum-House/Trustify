import { expect } from "chai";
import { ethers } from "hardhat";

async function setup() {
  const [admin, issuer, other] = await ethers.getSigners();
  const AC = await ethers.getContractFactory("TrustifyAccessControl");
  const ac = await AC.deploy(admin.address);
  await ac.waitForDeployment();

  const R = await ethers.getContractFactory("TrustifyRegistry");
  const deployed = await R.deploy(await ac.getAddress());
  await deployed.waitForDeployment();
  const reg = await ethers.getContractAt("TrustifyRegistry", await deployed.getAddress());

  await ac.approveIssuer(issuer.address);
  await ac.approveIssuer(other.address);

  const hash = ethers.keccak256(ethers.toUtf8Bytes("revokable"));
  await reg.connect(issuer).registerDocument(hash, "cid", "Alice", "ID1", "Degree", 0, 1, 2);

  return { issuer, other, reg, hash };
}

describe("TrustifyRegistry.revoke", function () {
  it("issuer can revoke own doc", async function () {
    const { issuer, reg, hash } = await setup();
    await expect((reg.connect(issuer) as any).revokeDocument(hash, "bad")).to.emit(
      reg,
      "DocumentRevoked"
    );
  });

  it("other issuer cannot revoke", async function () {
    const { other, reg, hash } = await setup();
    await expect((reg.connect(other) as any).revokeDocument(hash, "bad")).to.be.revertedWithCustomError(
      reg,
      "IssuerMismatch"
    );
  });
});

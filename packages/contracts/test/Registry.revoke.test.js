const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustifyRegistry: revocation", function () {
  async function setup() {
    const [admin, issuer, other] = await ethers.getSigners();
    const acF = await ethers.getContractFactory("TrustifyAccessControl");
    const ac = await acF.deploy(admin.address);
    const regF = await ethers.getContractFactory("TrustifyRegistry");
    const reg = await regF.deploy(await ac.getAddress());
    
    await ac.approveIssuer(issuer.address, "Test Org", "education");
    return { ac, reg, admin, issuer, other };
  }

  it("issuer can revoke their own document", async function () {
    const { reg, issuer } = await setup();
    const hash = ethers.id("doc1");
    await reg.connect(issuer).registerDocument(hash, "uri", "Name", "ID", "Type", 0, 100, 0);

    await expect(reg.connect(issuer).revokeDocument(hash, "Misplaced"))
      .to.emit(reg, "DocumentRevoked");
    
    const doc = await reg.getDocument(hash);
    expect(doc.isRevoked).to.be.undefined; // In JS record, we check status
    expect(doc.status).to.eq(2); // Revoked
  });

  it("admin can revoke any document (Emergency Fix)", async function () {
    const { reg, admin, issuer } = await setup();
    const hash = ethers.id("rogue-doc");
    await reg.connect(issuer).registerDocument(hash, "uri", "Name", "ID", "Type", 0, 100, 0);

    await expect(reg.connect(admin).revokeDocument(hash, "Admin Intervention"))
      .to.emit(reg, "DocumentRevoked");
    
    const doc = await reg.getDocument(hash);
    expect(doc.status).to.eq(2);
  });

  it("revoked issuer can still revoke their own legacy documents (Deadlock Fix)", async function () {
    const { ac, reg, admin, issuer } = await setup();
    const hash = ethers.id("legacy-doc");
    await reg.connect(issuer).registerDocument(hash, "uri", "Name", "ID", "Type", 0, 100, 0);

    await ac.connect(admin).revokeIssuer(issuer.address);
    await expect(reg.connect(issuer).revokeDocument(hash, "Cleanup"))
      .to.emit(reg, "DocumentRevoked");
  });
});

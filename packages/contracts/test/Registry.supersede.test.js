const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustifyRegistry: superseding", function () {
  async function setup() {
    const [admin, issuer] = await ethers.getSigners();
    const acF = await ethers.getContractFactory("TrustifyAccessControl");
    const ac = await acF.deploy(admin.address);
    const regF = await ethers.getContractFactory("TrustifyRegistry");
    const reg = await regF.deploy(await ac.getAddress());
    
    await ac.approveIssuer(issuer.address, "Test Org", "education");
    return { ac, reg, admin, issuer };
  }

  it("issuer can supersede their own document", async function () {
    const { reg, issuer } = await setup();
    const oldHash = ethers.id("old");
    const newHash = ethers.id("new");
    
    await reg.connect(issuer).registerDocument(oldHash, "uri1", "Name", "ID", "Type", 0, 100, 0);

    // Fixed: supersedeDocument only takes 2 arguments
    await expect(reg.connect(issuer).supersedeDocument(oldHash, newHash))
      .to.emit(reg, "DocumentSuperseded");
    
    const oldDoc = await reg.getDocument(oldHash);
    const newDoc = await reg.getDocument(newHash);
    
    expect(oldDoc.status).to.eq(3); // Superseded
    expect(newDoc.issuer).to.eq(issuer.address);
    expect(newDoc.status).to.eq(1); // Active
  });
});

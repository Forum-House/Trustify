const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustifyRegistry: verification", function () {
  async function setup() {
    const [admin, issuer] = await ethers.getSigners();
    const acF = await ethers.getContractFactory("TrustifyAccessControl");
    const ac = await acF.deploy(admin.address);
    const regF = await ethers.getContractFactory("TrustifyRegistry");
    const reg = await regF.deploy(await ac.getAddress());
    
    await ac.approveIssuer(issuer.address, "Test Org", "education");
    return { ac, reg, admin, issuer };
  }

  it("returns correct document data", async function () {
    const { reg, issuer } = await setup();
    const hash = ethers.id("doc1");
    const uri = "ipfs://test";
    await reg.connect(issuer).registerDocument(hash, uri, "Alice", "ID1", "Degree", 0, 100, 0);

    const doc = await reg.getDocument(hash);
    expect(doc.issuer).to.eq(issuer.address);
    expect(doc.cid).to.eq(uri);
    expect(doc.status).to.eq(1); // Active
  });
});

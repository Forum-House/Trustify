const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustifyRegistry: registration", function () {
  async function setup() {
    const [admin, issuer, other] = await ethers.getSigners();
    const acF = await ethers.getContractFactory("TrustifyAccessControl");
    const ac = await acF.deploy(admin.address);
    const regF = await ethers.getContractFactory("TrustifyRegistry");
    const reg = await regF.deploy(await ac.getAddress());
    
    await ac.approveIssuer(issuer.address, "Test Org", "education");
    return { ac, reg, admin, issuer, other };
  }

  it("issuer can register document", async function () {
    const { reg, issuer } = await setup();
    const hash = ethers.id("doc1");
    const uri = "ipfs://test";

    // Fixed: Passing all 8 arguments
    await expect(reg.connect(issuer).registerDocument(
      hash, uri, "Alice", "ID123", "Degree", 0, 1000, 2000
    ))
      .to.emit(reg, "DocumentRegistered");
    
    const doc = await reg.getDocument(hash);
    expect(doc.issuer).to.eq(issuer.address);
    expect(doc.cid).to.eq(uri);
    expect(doc.holderName).to.eq("Alice");
  });

  it("cannot register same hash twice", async function () {
    const { reg, issuer } = await setup();
    const hash = ethers.id("doc1");
    await reg.connect(issuer).registerDocument(
      hash, "uri", "Alice", "ID123", "Degree", 0, 1000, 2000
    );

    await expect(reg.connect(issuer).registerDocument(
      hash, "uri2", "Bob", "ID456", "ID", 0, 1000, 2000
    )).to.be.revertedWithCustomError(reg, "DocumentAlreadyExists");
  });
});

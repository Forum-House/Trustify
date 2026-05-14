const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Trustify Production Hardening Tests", function () {
  let ac, reg, admin, issuer, other;

  beforeEach(async function () {
    [admin, issuer, other] = await ethers.getSigners();

    // 1. Deploy AccessControl
    const AC = await ethers.getContractFactory("TrustifyAccessControl");
    ac = await AC.deploy(admin.address);
    await ac.waitForDeployment();

    // 2. Deploy Registry
    const R = await ethers.getContractFactory("TrustifyRegistry");
    reg = await R.deploy(await ac.getAddress());
    await reg.waitForDeployment();

    // 3. Setup Issuer with Metadata
    await ac.approveIssuer(issuer.address, "Issuer Org", "education");
  });

  describe("AccessControl Metadata", function () {
    it("should store issuer name and sector on-chain", async function () {
      expect(await ac.issuerName(issuer.address)).to.equal("Issuer Org");
      expect(await ac.issuerSector(issuer.address)).to.equal("education");
    });
  });

  describe("Management Deadlock Fix (Revocation)", function () {
    let docHash;

    beforeEach(async function () {
      docHash = ethers.keccak256(ethers.toUtf8Bytes("test-doc"));
      await reg.connect(issuer).registerDocument(
        docHash, "cid", "Alice", "ID1", "Degree", 0, 1, 2000000000
      );
    });

    it("should allow Admin to revoke any document (Fixes Deadlock)", async function () {
      // Admin is NOT the issuer, but should be allowed to revoke
      await expect(reg.connect(admin).revokeDocument(docHash, "Admin Revocation"))
        .to.emit(reg, "DocumentRevoked");
      
      const doc = await reg.getDocument(docHash);
      expect(doc.status).to.equal(2); // Revoked
    });

    it("should allow Revoked Issuer to revoke their own EXISTING documents (Fixes Deadlock)", async function () {
      // First, revoke the issuer's permission to issue NEW docs
      await ac.revokeIssuer(issuer.address);
      expect(await ac.isIssuer(issuer.address)).to.equal(false);

      // They should still be allowed to revoke their old docs for security cleanups
      await expect(reg.connect(issuer).revokeDocument(docHash, "Security Cleanup"))
        .to.emit(reg, "DocumentRevoked");
    });

    it("should NOT allow a different issuer to revoke someone else's document", async function () {
      await ac.approveIssuer(other.address, "Other Org", "healthcare");
      await expect(reg.connect(other).revokeDocument(docHash, "Malicious Revoke"))
        .to.be.revertedWithCustomError(reg, "Unauthorized");
    });
  });
});

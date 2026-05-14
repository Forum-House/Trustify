const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustifyAccessControl", function () {
  it("deployer is admin", async function () {
    const [admin] = await ethers.getSigners();
    const F = await ethers.getContractFactory("TrustifyAccessControl");
    const ac = await F.deploy(admin.address);
    await ac.waitForDeployment();

    expect(await ac.isAdmin(admin.address)).to.eq(true);
  });

  it("admin can approve and revoke issuer", async function () {
    const [admin, issuer] = await ethers.getSigners();
    const F = await ethers.getContractFactory("TrustifyAccessControl");
    const ac = await F.deploy(admin.address);
    await ac.waitForDeployment();

    // Updated to match new signature: (address, name, sector)
    await expect(ac.approveIssuer(issuer.address, "Test Org", "education")).to.not.be.reverted;
    expect(await ac.isIssuer(issuer.address)).to.eq(true);

    await expect(ac.revokeIssuer(issuer.address)).to.not.be.reverted;
    expect(await ac.isIssuer(issuer.address)).to.eq(false);
  });
});

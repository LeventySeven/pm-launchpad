import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("PredictionMarketVault", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    const PredictionMarketVault = await ethers.getContractFactory("PredictionMarketVault");
    const vault = await PredictionMarketVault.deploy([await mockUSDC.getAddress()]);
    await vault.waitForDeployment();

    const initialBalance = ethers.parseUnits("10000", 6);
    await mockUSDC.transfer(user1.address, initialBalance);
    await mockUSDC.transfer(user2.address, initialBalance);

    return { mockUSDC, vault, owner, user1, user2 };
  }

  it("sets owner", async function () {
    const { vault, owner } = await loadFixture(deployContractsFixture);
    expect(await vault.owner()).to.equal(owner.address);
  });

  it("supports MockUSDC", async function () {
    const { vault, mockUSDC } = await loadFixture(deployContractsFixture);
    expect(await vault.supportedTokens(await mockUSDC.getAddress())).to.equal(true);
  });

  it("deposit/withdraw works", async function () {
    const { vault, mockUSDC, user1 } = await loadFixture(deployContractsFixture);
    const vaultAddress = await vault.getAddress();
    const usdcAddress = await mockUSDC.getAddress();

    const depositAmount = ethers.parseUnits("1000", 6);
    await mockUSDC.connect(user1).approve(vaultAddress, depositAmount);
    await vault.connect(user1).deposit(usdcAddress, depositAmount);

    const withdrawAmount = ethers.parseUnits("250", 6);
    await vault.connect(user1).withdraw(usdcAddress, withdrawAmount);

    expect(await vault.getBalance(user1.address, usdcAddress)).to.equal(depositAmount - withdrawAmount);
  });

  it("placeBet updates position and balance", async function () {
    const { vault, mockUSDC, owner, user1 } = await loadFixture(deployContractsFixture);
    const vaultAddress = await vault.getAddress();
    const usdcAddress = await mockUSDC.getAddress();

    const depositAmount = ethers.parseUnits("1000", 6);
    await mockUSDC.connect(user1).approve(vaultAddress, depositAmount);
    await vault.connect(user1).deposit(usdcAddress, depositAmount);

    const marketId = ethers.keccak256(ethers.toUtf8Bytes("test-market-uuid"));
    const YES = 1;
    const collateral = ethers.parseUnits("100", 6);
    const shares = ethers.parseUnits("150", 6);
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const network = await ethers.provider.getNetwork();
    const nonce = await vault.getNonce(user1.address);

    const domain = {
      name: "PredictionMarketVault",
      version: "1",
      chainId: Number(network.chainId),
      verifyingContract: vaultAddress,
    };
    const types = {
      BetQuote: [
        { name: "user", type: "address" },
        { name: "marketId", type: "bytes32" },
        { name: "outcome", type: "uint8" },
        { name: "token", type: "address" },
        { name: "collateral", type: "uint256" },
        { name: "shares", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
    const message = {
      user: user1.address,
      marketId,
      outcome: YES,
      token: usdcAddress,
      collateral,
      shares,
      nonce,
      deadline,
    };

    const sig = await owner.signTypedData(domain, types, message);

    await vault.connect(user1).placeBet(marketId, YES, collateral, shares, usdcAddress, deadline, sig);

    expect(await vault.getPosition(user1.address, marketId, YES)).to.equal(shares);
    expect(await vault.getBalance(user1.address, usdcAddress)).to.equal(depositAmount - collateral);
  });
});


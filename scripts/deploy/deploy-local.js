import { ethers } from "hardhat";

/**
 * Deploy contracts to local Hardhat network for testing
 *
 * Usage:
 *   bun run contracts:node         (terminal 1)
 *   bun run contracts:deploy:local (terminal 2)
 */
async function main() {
  console.log("Starting local deployment...\n");

  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const usdc = await mockUSDC.getAddress();
  console.log("\nMockUSDC:", usdc);

  const Vault = await ethers.getContractFactory("PredictionMarketVault");
  const vault = await Vault.deploy([usdc]);
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("Vault:", vaultAddr);

  const transferAmount = ethers.parseUnits("10000", 6);
  await mockUSDC.transfer(user1.address, transferAmount);
  await mockUSDC.transfer(user2.address, transferAmount);

  await mockUSDC.connect(user1).approve(vaultAddr, ethers.MaxUint256);
  await vault.connect(user1).deposit(usdc, ethers.parseUnits("1000", 6));

  console.log("\nDone.\n");
  console.log("MockUSDC:", usdc);
  console.log("Vault:", vaultAddr);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


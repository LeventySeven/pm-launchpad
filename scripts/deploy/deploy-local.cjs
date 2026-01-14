const { ethers } = require("hardhat");

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

  // EIP-712 quote signer (required for placeBet/sellPosition quote verification)
  // For LOCAL dev, default to deployer unless explicitly overridden.
  const quoteSignerAddress = process.env.QUOTE_SIGNER_ADDRESS || deployer.address;
  const setSignerTx = await vault.setQuoteSigner(quoteSignerAddress);
  await setSignerTx.wait();
  console.log("QuoteSigner:", quoteSignerAddress);

  const transferAmount = ethers.parseUnits("10000", 6);
  await mockUSDC.transfer(user1.address, transferAmount);
  await mockUSDC.transfer(user2.address, transferAmount);

  await mockUSDC.connect(user1).approve(vaultAddr, ethers.MaxUint256);
  await vault.connect(user1).deposit(usdc, ethers.parseUnits("1000", 6));

  console.log("\nDone.\n");
  console.log("MockUSDC:", usdc);
  console.log("Vault:", vaultAddr);
  console.log("QuoteSigner:", quoteSignerAddress);

  console.log("\nLocal env hints (do NOT commit secrets):\n");
  console.log("NEXT_PUBLIC_CHAIN_ID=31337");
  console.log(`NEXT_PUBLIC_VAULT_ADDRESS_LOCAL=${vaultAddr}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS_LOCAL=${usdc}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

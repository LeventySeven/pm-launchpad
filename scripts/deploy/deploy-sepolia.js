import { ethers } from "hardhat";
import fs from "node:fs";
import path from "node:path";

/**
 * Deploy contracts to Sepolia testnet
 *
 * Usage:
 *   bun run contracts:deploy:sepolia
 *
 * Prerequisites:
 *   - DEPLOYER_PRIVATE_KEY set in .env
 *   - ALCHEMY_API_KEY set in .env (or ALCHEMY_SEPOLIA_URL)
 *   - Sepolia ETH in deployer wallet
 */
async function main() {
  console.log("Starting Sepolia deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) throw new Error("Deployer has no ETH (Sepolia).");

  console.log("Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC:", mockUSDCAddress);

  console.log("\nDeploying PredictionMarketVault...");
  const PredictionMarketVault = await ethers.getContractFactory("PredictionMarketVault");
  const vault = await PredictionMarketVault.deploy([mockUSDCAddress]);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("Vault:", vaultAddress);

  const deployment = {
    network: "sepolia",
    chainId: 11155111,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MockUSDC: mockUSDCAddress,
      PredictionMarketVault: vaultAddress,
    },
  };

  const deploymentsDir = path.join(process.cwd(), "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });

  const outPath = path.join(deploymentsDir, "sepolia.json");
  fs.writeFileSync(outPath, JSON.stringify(deployment, null, 2));

  console.log("\nSaved:", outPath);
  console.log("\nAdd to env:\n");
  console.log(`NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA=${vaultAddress}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA=${mockUSDCAddress}`);
  console.log("NEXT_PUBLIC_CHAIN_ID=11155111");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


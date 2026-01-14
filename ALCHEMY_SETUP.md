# Alchemy Setup Guide

This guide explains how to get your Alchemy API keys and webhook signing key needed for contract deployment and webhook verification.

## Why You Need Alchemy

- **RPC Access**: To deploy contracts and interact with **Sepolia testnet** (we're using testnet only, not mainnet)
- **Webhooks**: To receive real-time notifications when on-chain events occur (deposits, bets, etc.)

**Note**: This project is configured for **Sepolia testnet only**. Mainnet support can be added later when ready for production.

---

## Step 1: Create Alchemy Account & Get API Key

### 1.1 Sign Up / Log In
1. Go to [https://www.alchemy.com/](https://www.alchemy.com/)
2. Sign up (free) or log in to your account

### 1.2 Create an App for Sepolia
1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Click **"Create App"** button
3. Fill in:
   - **Name**: `prediction-market-sepolia` (or any name)
   - **Chain**: Select **"Ethereum"**
   - **Network**: Select **"Sepolia"** (testnet)
4. Click **"Create App"**

### 1.3 Get Your API Key
1. Click on your newly created app in the dashboard
2. You'll see:
   - **API Key** (a long string like `abc123...`)
   - **HTTP URL** (like `https://eth-sepolia.g.alchemy.com/v2/abc123...`)

### 1.4 Add to `.env`
Add this to your `.env` file:

```bash
# Option 1: Just the API key (recommended)
ALCHEMY_API_KEY=your-api-key-here

# Option 2: Full URL (alternative)
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key-here
```

**Note**: If you use `ALCHEMY_SEPOLIA_URL`, you don't need `ALCHEMY_API_KEY` for Sepolia.

---

## Step 2: Get Sepolia Testnet ETH

You need Sepolia ETH to pay for gas when deploying contracts.

### Option A: Alchemy Sepolia Faucet
1. Go to [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your deployer wallet address
3. Request Sepolia ETH (free)

### Option B: Other Faucets
- [PoW Faucet](https://sepolia-faucet.pk910.de/)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

**You need at least 0.1 Sepolia ETH** to deploy contracts.

---

## Step 3: Set Deployer Private Key

1. Get your deployer wallet's **private key** (the one that has Sepolia ETH)
2. Add to `.env`:

```bash
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef...  # Your private key (starts with 0x)
```

⚠️ **Security Warning**: Never commit `.env` to git! It's already in `.gitignore`.

---

## Step 4: Create Alchemy Webhook (for Phase 5)

### 4.1 Create Webhook
1. Go to [Alchemy Notify Dashboard](https://dashboard.alchemy.com/notify)
2. Click **"Create Webhook"**
3. Select:
   - **Type**: **"Address Activity"** (monitors contract events)
   - **Network**: **"Sepolia"**
   - **Address**: Enter your **vault contract address** (you'll get this after deployment)
   - **URL**: Your webhook endpoint (e.g., `https://your-domain.com/api/webhooks/alchemy`)
4. Click **"Create Webhook"**

### 4.2 Get Signing Key
1. In the Notify dashboard, find your webhook
2. Click the **three dots (⋯)** next to it
3. Select **"Signing Key"**
4. Copy the signing key (it's a long hex string)

### 4.3 Add to `.env`
```bash
ALCHEMY_WEBHOOK_SECRET=your-signing-key-here
```

**Note**: You can create the webhook **after** deploying the vault contract (you'll need the vault address).

---

## Step 5: Deploy Contracts

Once you have:
- ✅ `ALCHEMY_API_KEY` or `ALCHEMY_SEPOLIA_URL` in `.env`
- ✅ `DEPLOYER_PRIVATE_KEY` in `.env`
- ✅ Sepolia ETH in your deployer wallet

Run:

```bash
bun run contracts:deploy:sepolia
```

This will:
1. Deploy `MockUSDC` token
2. Deploy `PredictionMarketVault` (with MockUSDC as supported token)
3. Save addresses to `deployments/sepolia.json`
4. Print the addresses to add to your `.env`

### After Deployment

Add these to your `.env`:

```bash
NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA=0x...  # From deployment output
NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA=0x...   # From deployment output
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## Step 6: Set Quote Signer (for EIP-712 Security)

The vault contract requires a **quote signer** to authorize pricing quotes.

### 6.1 Generate a New Wallet (Recommended)
Use a dedicated wallet for quote signing (not your deployer):

```bash
# Using Node.js (or any tool)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This gives you a private key. Derive the address (or use a tool like MetaMask to import it).

### 6.2 Set Quote Signer in Contract
After deployment, call:

```bash
# Using Hardhat console or a script
npx hardhat console --network sepolia
```

Then:
```javascript
const vault = await ethers.getContractAt("PredictionMarketVault", "YOUR_VAULT_ADDRESS");
await vault.setQuoteSigner("0x...QUOTE_SIGNER_ADDRESS...");
```

### 6.3 Add to `.env`
```bash
QUOTE_SIGNER_PRIVATE_KEY=0x...  # Private key of the quote signer wallet
```

---

## Troubleshooting

### Warning: "Node.js v25.2.1 is not supported by Hardhat"
- **Cause**: Hardhat officially supports Node.js v18 and v20 (LTS versions)
- **Impact**: This is a **warning**, not an error. Hardhat should still work, but you may encounter unexpected behavior
- **Fix (Optional)**: If you experience issues, consider using Node.js v18 or v20:
  ```bash
  # Using nvm (Node Version Manager)
  nvm install 20
  nvm use 20
  ```
  Or continue with your current Node.js version if everything works fine.

### Error: "Must be authenticated!"
- **Cause**: Missing or invalid `ALCHEMY_API_KEY` or `ALCHEMY_SEPOLIA_URL`
- **Fix**: Check your `.env` file has the correct API key

### Error: "Deployer has no ETH"
- **Cause**: Your deployer wallet has no Sepolia ETH
- **Fix**: Use a faucet (see Step 2)

### Error: "require is not defined in ES module scope"
- **Cause**: Deployment scripts need to be `.cjs` (CommonJS) when `package.json` has `"type": "module"`
- **Fix**: The scripts have been renamed to `.cjs` - make sure `package.json` references `.cjs` files

### Error: "QUOTE_SIGNER_NOT_CONFIGURED"
- **Cause**: Missing `QUOTE_SIGNER_PRIVATE_KEY` in `.env`
- **Fix**: Generate a quote signer wallet and add its private key to `.env`

### Webhook Not Receiving Events
- **Cause**: Wrong vault address in webhook config, or missing `ALCHEMY_WEBHOOK_SECRET`
- **Fix**: Update webhook address to match deployed vault, ensure signing key is in `.env`

---

## Summary Checklist

Before deploying:
- [ ] Alchemy account created
- [ ] Sepolia app created in Alchemy dashboard
- [ ] `ALCHEMY_API_KEY` added to `.env`
- [ ] `DEPLOYER_PRIVATE_KEY` added to `.env`
- [ ] Deployer wallet has Sepolia ETH (≥0.1 ETH)

After deploying:
- [ ] Contract addresses added to `.env` (`NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA`, etc.)
- [ ] Quote signer wallet created and `QUOTE_SIGNER_PRIVATE_KEY` added to `.env`
- [ ] `setQuoteSigner()` called on vault contract
- [ ] Webhook created in Alchemy Notify (with vault address)
- [ ] `ALCHEMY_WEBHOOK_SECRET` added to `.env`

---

## Quick Reference: All Required Env Vars

```bash
# Alchemy RPC
ALCHEMY_API_KEY=your-api-key
# OR
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key

# Deployment
DEPLOYER_PRIVATE_KEY=0x...

# After deployment
NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_CHAIN_ID=11155111

# Quote signing (after setting quoteSigner in contract)
QUOTE_SIGNER_PRIVATE_KEY=0x...

# Webhook (after creating webhook in Alchemy Notify)
ALCHEMY_WEBHOOK_SECRET=your-signing-key
```

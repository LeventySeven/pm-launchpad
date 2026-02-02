# Deployer keypair (use same address everywhere)

The program on devnet has **upgrade authority** `4Ld29gLVgD1ypWF3ipu6fUFa3HTRLLvM2J2TnCWQnhHK`.  
To deploy or upgrade, you must use the keypair for that address.

## 1. Put the keypair file in place

You need the **keypair file** (JSON array of 64 bytes) whose public key is  
`4Ld29gLVgD1ypWF3ipu6fUFa3HTRLLvM2J2TnCWQnhHK`.

**Option A – Copy your keypair into the project**

```bash
# From project root: copy your keypair to Anchor deployer path
cp /path/to/your-keypair-for-4Ld29.json anchor/deployer-keypair.json
```

**Option B – Use the script**

```bash
bun run scripts/solana/use-deployer-keypair.ts /path/to/your-keypair.json
```

## 2. Set Solana CLI to the same keypair

So `solana address` shows `4Ld29gLVgD1ypWF3ipu6fUFa3HTRLLvM2J2TnCWQnhHK`:

```bash
# From project root
solana config set --keypair "$(pwd)/anchor/deployer-keypair.json"
solana address   # should print 4Ld29gLVgD1ypWF3ipu6fUFa3HTRLLvM2J2TnCWQnhHK
```

## 3. Deploy

```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet
```

`Anchor.toml` already has `wallet = "./deployer-keypair.json"`, so Anchor uses the same keypair.

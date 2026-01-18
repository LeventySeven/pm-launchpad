import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { readFileSync } from "node:fs";
import { getSolanaRpcUrl } from "@/lib/solana/config";

function loadKeypairFromFile(path: string): Keypair {
  const raw = JSON.parse(readFileSync(path, "utf8")) as number[];
  const secret = Uint8Array.from(raw);
  return Keypair.fromSecretKey(secret);
}

async function main() {
  const keypairPath = process.env.SOLANA_KEYPAIR_PATH || `${process.env.HOME}/.config/solana/id.json`;
  const payer = loadKeypairFromFile(keypairPath);

  const rpcUrl = getSolanaRpcUrl();
  const connection = new Connection(rpcUrl, "confirmed");

  const decimals = 6;
  const mintAuthority = payer.publicKey;
  const freezeAuthority: PublicKey | null = null;

  const mint = await createMint(connection, payer, mintAuthority, freezeAuthority, decimals);

  // Mint some initial supply to payer (default: 10_000 USDC, configurable)
  const initialMajor = Number(process.env.SOLANA_DEVNET_USDC_INITIAL_SUPPLY || "10000");
  if (!Number.isFinite(initialMajor) || initialMajor < 0) {
    throw new Error("Invalid SOLANA_DEVNET_USDC_INITIAL_SUPPLY");
  }
  const initialMinor = BigInt(Math.floor(initialMajor * 10 ** decimals));

  if (initialMinor > 0n) {
    const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
    await mintTo(connection, payer, mint, ata.address, payer, initialMinor);
  }

  // Output env values user should set
  process.stdout.write("\n");
  process.stdout.write("Devnet USDC-like mint created.\n");
  process.stdout.write(`- SOLANA_USDC_MINT=${mint.toBase58()}\n`);
  process.stdout.write(`- NEXT_PUBLIC_SOLANA_USDC_MINT=${mint.toBase58()}\n`);
  process.stdout.write("\n");
  process.stdout.write(`Payer: ${payer.publicKey.toBase58()}\n`);
  process.stdout.write(`RPC: ${rpcUrl}\n`);
  process.stdout.write("\n");
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


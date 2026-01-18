import { PublicKey, clusterApiUrl } from "@solana/web3.js";

export type SolanaCluster = "devnet" | "testnet" | "mainnet-beta";

export function getSolanaCluster(): SolanaCluster {
  const raw = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || process.env.SOLANA_CLUSTER || "devnet").toLowerCase();
  if (raw === "devnet" || raw === "testnet" || raw === "mainnet-beta") return raw;
  return "devnet";
}

export function getSolanaRpcUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || process.env.SOLANA_RPC_URL;
  if (explicit && explicit.trim().length > 0) {
    const trimmed = explicit.trim();
    // `@solana/web3.js` requires http(s) for the JSON-RPC endpoint.
    // Accept scheme-less hostnames like `api.devnet.solana.com` by prefixing https://
    return trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
  }
  return clusterApiUrl(getSolanaCluster() === "mainnet-beta" ? "mainnet-beta" : getSolanaCluster());
}

export function getPredictionMarketVaultProgramId(): PublicKey {
  const raw = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || process.env.SOLANA_PROGRAM_ID;
  if (!raw) throw new Error("SOLANA_PROGRAM_ID_NOT_SET");
  return new PublicKey(raw);
}

export function getUsdcMint(): PublicKey {
  const raw = process.env.NEXT_PUBLIC_SOLANA_USDC_MINT || process.env.SOLANA_USDC_MINT;
  if (!raw) throw new Error("SOLANA_USDC_MINT_NOT_SET");
  return new PublicKey(raw);
}


/**
 * Copy anchor/deployer-keypair.json to ~/.config/solana/id.json so
 * `solana address` works (avoids path-with-space issues in Solana CLI).
 *
 * Run from project root: bun run scripts/solana/set-solana-default-keypair.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..", "..");
const DEPLOYER_KEYPAIR = join(PROJECT_ROOT, "anchor", "deployer-keypair.json");
const SOLANA_ID_PATH = join(process.env.HOME || "~", ".config", "solana", "id.json");

if (!existsSync(DEPLOYER_KEYPAIR)) {
  console.error("Not found:", DEPLOYER_KEYPAIR);
  process.exit(1);
}

const dir = join(process.env.HOME || "~", ".config", "solana");
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const keypair = readFileSync(DEPLOYER_KEYPAIR, "utf8");
writeFileSync(SOLANA_ID_PATH, keypair.trim(), "utf8");
console.log("Copied deployer keypair to:", SOLANA_ID_PATH);
console.log("Run: solana config set --keypair", SOLANA_ID_PATH);
console.log("Then: solana address");

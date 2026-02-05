/**
 * Copy a keypair file to anchor/deployer-keypair.json so Anchor and Solana CLI
 * use the same deployer (e.g. 4Ld29gLVgD1ypWF3ipu6fUFa3HTRLLvM2J2TnCWQnhHK).
 *
 * Usage: bun run scripts/solana/use-deployer-keypair.ts <path-to-keypair.json>
 * Example: bun run scripts/solana/use-deployer-keypair.ts ~/keypair-4Ld29.json
 */
import { Keypair } from "@solana/web3.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join, resolve, isAbsolute } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..", "..");
const DEPLOYER_KEYPAIR_PATH = join(PROJECT_ROOT, "anchor", "deployer-keypair.json");

const EXPECTED_DEPLOYER_ADDRESS = "4Ld29gLVgD1ypWF3ipu6fUFa3HTRLLvM2J2TnCWQnhHK";

const keypairPath = process.argv[2];
if (!keypairPath) {
  console.error("Usage: bun run scripts/solana/use-deployer-keypair.ts <path-to-keypair.json>");
  console.error("Example: bun run scripts/solana/use-deployer-keypair.ts anchor/deployer-keypair.json");
  console.error("        bun run scripts/solana/use-deployer-keypair.ts ~/keypair-4Ld29.json");
  process.exit(1);
}

function resolveKeypairPath(input: string): string {
  const expanded = input.startsWith("~") ? join(process.env.HOME || "", input.slice(1)) : input;
  if (isAbsolute(expanded)) {
    if (existsSync(expanded)) return expanded;
    // Path like /prediction-market-ru/anchor/... from project root: try relative to cwd
    const relative = expanded.startsWith("/") ? expanded.slice(1) : expanded;
    const fromCwd = resolve(process.cwd(), relative);
    if (existsSync(fromCwd)) return fromCwd;
    return expanded;
  }
  return resolve(process.cwd(), expanded);
}

let resolved = resolveKeypairPath(keypairPath);
if (!existsSync(resolved)) {
  const fallback = join(process.cwd(), "anchor", "deployer-keypair.json");
  if (existsSync(fallback)) {
    resolved = fallback;
  } else {
    console.error("Keypair file not found:", resolved);
    console.error("From project root, use: anchor/deployer-keypair.json");
    process.exit(1);
  }
}

const raw = readFileSync(resolved, "utf8");
let secretKey: number[];
try {
  secretKey = JSON.parse(raw);
} catch {
  console.error("Invalid keypair JSON:", resolved);
  process.exit(1);
}
if (!Array.isArray(secretKey) || secretKey.length !== 64) {
  console.error("Keypair must be a JSON array of 64 bytes");
  process.exit(1);
}

const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
const address = keypair.publicKey.toBase58();

writeFileSync(DEPLOYER_KEYPAIR_PATH, JSON.stringify(Array.from(keypair.secretKey)), "utf8");
console.log("Written to anchor/deployer-keypair.json");
console.log("Deployer address:", address);

if (address !== EXPECTED_DEPLOYER_ADDRESS) {
  console.warn("\nWarning: This keypair's address is", address);
  console.warn("Expected deployer (current program authority) is", EXPECTED_DEPLOYER_ADDRESS);
  console.warn("Deploy will only work if this keypair is the program's upgrade authority.");
}

const absolutePath = join(PROJECT_ROOT, "anchor", "deployer-keypair.json");
console.log("\nSet Solana CLI to use this keypair (run from project root):");
console.log(`  solana config set --keypair "${absolutePath}"`);
console.log("\nVerify:");
console.log("  solana address");

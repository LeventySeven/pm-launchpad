import { PublicKey } from "@solana/web3.js";

/**
 * Convert a UUID string (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) to 16 raw bytes.
 * This must match the Anchor PDA seed scheme used by the program.
 */
export function uuidToBytes16(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) {
    throw new Error("INVALID_UUID");
  }
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i += 1) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function deriveMarketPda(programId: PublicKey, marketUuid: string): PublicKey {
  const uuidBytes = uuidToBytes16(marketUuid);
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from("market"), Buffer.from(uuidBytes)], programId);
  return pda;
}

export function deriveConfigPda(programId: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
  return pda;
}

export function deriveUserVaultPda(programId: PublicKey, user: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from("user_vault"), user.toBuffer()], programId);
  return pda;
}

export function derivePositionPda(programId: PublicKey, marketPda: PublicKey, user: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("position"), marketPda.toBuffer(), user.toBuffer()],
    programId
  );
  return pda;
}


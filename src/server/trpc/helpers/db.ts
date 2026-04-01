import { TRPCError } from "@trpc/server";

const DEFAULT_ASSET = "VCOIN";

/**
 * Fetch the VCOIN wallet balance for a user. Returns 0 if no row exists.
 */
export async function getWalletBalance(
  db: { from: (table: string) => any },
  userId: string,
): Promise<number> {
  const { data, error } = await db
    .from("wallet_balances")
    .select("balance_minor")
    .eq("user_id", userId)
    .eq("asset_code", DEFAULT_ASSET)
    .maybeSingle();
  if (error) {
    console.warn("getWalletBalance failed", userId, error.message);
  }
  return data ? Number(data.balance_minor ?? 0) : 0;
}

/**
 * Unwrap a Supabase result, throwing a TRPCError on failure.
 * Eliminates the repeated if (result.error || !result.data) pattern.
 */
export function unwrap<T>(
  result: { data: T | null; error: { message: string } | null },
  fallbackMessage: string,
): T {
  if (result.error || !result.data) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: result.error?.message ?? fallbackMessage,
    });
  }
  return result.data;
}

/**
 * Validate market dates (closesAt <= expiresAt, both in the future).
 */
export function validateMarketDates(
  expiresAtRaw: string,
  closesAtRaw?: string | null,
): { closesAtMs: number; expiresAtMs: number } {
  const expiresAtMs = Date.parse(expiresAtRaw);
  const closesAtMs = closesAtRaw ? Date.parse(closesAtRaw) : expiresAtMs;

  if (!Number.isFinite(closesAtMs) || !Number.isFinite(expiresAtMs)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid dates" });
  }
  if (closesAtMs > expiresAtMs) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Trading close must be <= end time" });
  }
  const now = Date.now();
  if (expiresAtMs < now) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Event end time must be in the future" });
  }
  if (closesAtMs < now) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Trading close time must be in the future" });
  }
  return { closesAtMs, expiresAtMs };
}

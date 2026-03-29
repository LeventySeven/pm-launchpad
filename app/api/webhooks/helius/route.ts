import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database";
import type { JsonValue } from "@/src/types/database";

export const runtime = "nodejs";

type AnyObj = Record<string, JsonValue>;

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getJsonContentLength(req: Request): number | null {
  const raw = req.headers.get("content-length");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function extractTxSig(payload: AnyObj): string | null {
  // Common Helius payloads include `signature` or `transactionSignature` or nested.
  const direct = payload["signature"] ?? payload["transactionSignature"] ?? payload["txSig"] ?? payload["tx_sig"];
  if (typeof direct === "string" && direct.length > 0) return direct;

  const tx = payload["transaction"];
  if (tx && typeof tx === "object") {
    const sig = (tx as AnyObj)["signature"];
    if (typeof sig === "string" && sig.length > 0) return sig;
  }

  return null;
}

function extractUserPubkey(payload: AnyObj): string | null {
  const v =
    payload["userPubkey"] ??
    payload["walletPubkey"] ??
    payload["account"] ??
    payload["fromPubkey"] ??
    payload["from_pubkey"];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function extractMarketPda(payload: AnyObj): string | null {
  const v = payload["marketPda"] ?? payload["market_pda"] ?? payload["market"];
  return typeof v === "string" && v.length > 0 ? v : null;
}

export async function POST(req: Request) {
  // Fail-closed: never accept webhook traffic unless a secret is configured.
  const configured = process.env.HELIUS_WEBHOOK_SECRET;
  if (!configured || configured.length === 0) {
    return NextResponse.json({ ok: false, error: "WEBHOOK_NOT_CONFIGURED" }, { status: 500 });
  }
  const got = req.headers.get("x-webhook-secret") || "";
  if (got !== configured) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Minimal abuse protection (cheap early rejects).
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "UNSUPPORTED_CONTENT_TYPE" }, { status: 415 });
  }
  const len = getJsonContentLength(req);
  if (typeof len === "number" && len > 2_000_000) {
    return NextResponse.json({ ok: false, error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
  }

  const body = (await req.json().catch(() => null)) as JsonValue | null;
  const events: AnyObj[] = Array.isArray(body)
    ? (body as AnyObj[])
    : body && typeof body === "object"
      ? [body as AnyObj]
      : [];

  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient<Database>(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const solanaCluster = (process.env.SOLANA_CLUSTER || process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet").toLowerCase();
  const cluster = solanaCluster === "mainnet-beta" ? "mainnet-beta" : solanaCluster === "testnet" ? "testnet" : "devnet";

  // Pre-extract all events with their parsed fields
  const parsed = events.map((e) => ({
    raw: e,
    txSig: extractTxSig(e),
    userPubkey: extractUserPubkey(e),
    marketPda: extractMarketPda(e),
  }));

  // Filter to events with valid txSig
  const valid = parsed.filter((p) => p.txSig);
  const ignored = parsed.length - valid.length;

  if (valid.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, ignored });
  }

  // Batch-resolve all unique wallet addresses and market PDAs upfront (2 queries instead of N*2)
  const uniqueWallets = [...new Set(valid.map((p) => p.userPubkey).filter(Boolean))] as string[];
  const uniquePdas = [...new Set(valid.map((p) => p.marketPda).filter(Boolean))] as string[];

  const [usersResult, marketsResult] = await Promise.all([
    uniqueWallets.length > 0
      ? supabase.from("users").select("id, solana_wallet_address").in("solana_wallet_address", uniqueWallets)
      : Promise.resolve({ data: [] as { id: string; solana_wallet_address: string }[] }),
    uniquePdas.length > 0
      ? supabase.from("market_onchain_map").select("market_id, market_pda").eq("solana_cluster", cluster).in("market_pda", uniquePdas)
      : Promise.resolve({ data: [] as { market_id: string; market_pda: string }[] }),
  ]);

  const walletToUser = new Map<string, string>();
  for (const u of (usersResult.data ?? []) as { id: string; solana_wallet_address: string }[]) {
    walletToUser.set(u.solana_wallet_address, u.id);
  }

  const pdaToMarket = new Map<string, string>();
  for (const m of (marketsResult.data ?? []) as { market_id: string; market_pda: string }[]) {
    pdaToMarket.set(m.market_pda, m.market_id);
  }

  // Build rows for batch upsert
  const rows: Database["public"]["Tables"]["on_chain_transactions"]["Insert"][] = [];
  let skipped = 0;

  for (const p of valid) {
    const userId = p.userPubkey ? walletToUser.get(p.userPubkey) ?? null : null;
    if (!userId) { skipped += 1; continue; }

    const marketId = p.marketPda ? pdaToMarket.get(p.marketPda) ?? null : null;

    rows.push({
      user_id: userId,
      solana_cluster: cluster,
      tx_sig: p.txSig!,
      status: "confirmed",
      tx_type: "deposit",
      amount_minor: null,
      asset_code: "USDC",
      market_id: marketId,
      trade_id: null,
      nonce: null,
      gas_used: null,
      gas_price_gwei: null,
      block_number: null,
      block_timestamp: null,
      error_message: null,
      metadata: p.raw,
    });
  }

  // Single batch upsert instead of N individual upserts
  if (rows.length > 0) {
    await supabase.from("on_chain_transactions").upsert(rows, { onConflict: "solana_cluster,tx_sig" });
  }

  return NextResponse.json({ ok: true, processed: rows.length, ignored: ignored + skipped });
}


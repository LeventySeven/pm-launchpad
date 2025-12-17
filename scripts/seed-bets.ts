/**
 * Seed Supabase bets using the transactional RPC (place_bet_tx) so pools and balances stay consistent.
 * Usage (Bun):
 *  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... bun tsx scripts/seed-bets.ts
 *
 * Requires env vars:
 *  - SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *  - SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type UserRow = { id: string | number };
type MarketRow = { id: string | number };
type PlaceBetArgs = {
  p_user_id: string | number;
  p_market_id: string | number;
  p_side: "YES" | "NO";
  p_amount: number;
};

async function main() {
  const { data: users } = await supabase.from<UserRow>("users").select("id").limit(5);
  const { data: markets } = await supabase.from<MarketRow>("markets").select("id").limit(10);

  if (!users?.length || !markets?.length) {
    console.log("No users or markets found; skipping seeding bets.");
    return;
  }

  const bets: PlaceBetArgs[] = [];
  let userIdx = 0;
  for (const market of markets) {
    const user = users[userIdx % users.length];
    userIdx++;
    bets.push({
      p_user_id: user.id,
      p_market_id: market.id,
      p_side: Math.random() > 0.5 ? "YES" : "NO",
      p_amount: Math.max(5, Math.round(Math.random() * 50)),
    });
  }

  for (const b of bets) {
    const rpc = await supabase.rpc("place_bet_tx", b);
    if (rpc.error) {
      console.error("Failed to place bet", b, rpc.error);
    } else {
      console.log(
        `Bet OK: user ${b.p_user_id} market ${b.p_market_id} side ${b.p_side} amount ${b.p_amount}`
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


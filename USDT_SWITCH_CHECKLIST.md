## USDT Switch Checklist (DevNet -> USDT)

Scope: current system uses `VCOIN` off-chain and `USDC` for Solana/on-chain scaffolding. When switching to **USDT** (still DevNet), update **all** items below.

### Environment / Config
- Add/rename env vars to point to USDT mint:
  - `NEXT_PUBLIC_SOLANA_USDT_MINT` / `SOLANA_USDT_MINT` (new).
  - If you keep USDC vars, ensure code prefers USDT for settlement.
- `lib/solana/config.ts`: add `getUsdtMint()` (and update callers) or switch existing `getUsdcMint()` to USDT.
- `SOLANA_SETUP.md`: replace USDC mint instructions with USDT mint and devnet guidance.
- `.env.example` (ignored in repo): update sample vars and comments to USDT.

### Database: Assets, Markets, Balances, and Views
- `assets` table: insert USDT asset (code `USDT`, decimals `6`, enabled).
- `markets.settlement_asset_code`: default or migrate existing markets to `USDT`.
- `wallet_balances` / `wallet_transactions`: ensure new rows use `USDT` code.
- Migrations and views tied to VCOIN:
  - `supabase/migrations/20260104024000_signup_bonus_1500_vcoin.sql`: change bonus asset to `USDT` (and review bonus amount).
  - `supabase/migrations/20260119000200_leaderboard_public_vcoin_only.sql`: remove VCOIN-only filter or replace with USDT.
  - `supabase/migrations/20260102000100_leaderboard_public_view.sql`: update `w.asset_code = 'VCOIN'` to `USDT` (if still used).
- `db/functions/place_bet_tx.sql`:
  - Defaults to `VCOIN` (e.g., `coalesce(..., 'VCOIN')`).
  - `MAX_BET_MAJOR` comment mentions VCOIN; recalibrate for USDT.
  - Ensure decimals logic aligns with USDT (6).

### Backend: TRPC & Business Logic
- `src/server/trpc/routers/market.ts`:
  - `DEFAULT_ASSET = "VCOIN"` and `VCOIN_DECIMALS` need to become USDT.
  - Volume calculations (`deriveVolumeMajor`) assume VCOIN decimals.
- `src/server/trpc/routers/user.ts`:
  - `DEFAULT_ASSET = "VCOIN"`; mark-to-market PnL filters by VCOIN.
  - `VCOIN_DECIMALS` used for balances and pnl conversion.
- `src/server/trpc/routers/auth.ts`:
  - `DEFAULT_ASSET`, signup bonus constants, and `SIGNUP_BONUS_MINOR` assume VCOIN.
- `src/server/trpc/routers/wallet.ts`:
  - `assetCodeSchema = z.enum(["USDC"])` must include `USDT` (or switch to USDT only).
- `app/api/webhooks/helius/route.ts`:
  - Hardcoded `asset_code: "USDC"`; must be `USDT`.
  - Any parsing logic that infers mint -> asset should be updated to USDT.

### Frontend: UI / Types / Messaging
- `types.ts`:
  - `User.balance` comment references VCOIN; update to USDT.
- `components/MarketPage.tsx`:
  - `isOnChainMarket` checks `USDC`/`USDT`; ensure label/UI copy uses USDT.
  - On-chain messaging should reference USDT if shown.
- `app/page.tsx`:
  - Any user-facing text referencing VCOIN (search for VCOIN strings).
  - PnL and balances are now computed with USDT decimals.
- `components/ProfilePage.tsx` and other UI components may show asset labels.

### Solana Program + Client Scripts
- Anchor program (`anchor/programs/prediction_market_vault/src/lib.rs`):
  - `Config.usdc_mint` and mint checks are USDC-specific.
  - Rename to `settlement_mint` or `usdt_mint`, update all constraints and event text.
  - Re-deploy program if account layouts change.
- Solana mint script:
  - `scripts/solana/create-devnet-usdc-mint.ts` should be duplicated/renamed for USDT.
  - Output env vars should print `SOLANA_USDT_MINT`.
- Client config:
  - `lib/solana/config.ts` must read USDT mint env var.

### EVM / Legacy Contracts (if still needed)
- `contracts/MockUSDC.sol`: replace with MockUSDT or update symbol/name.
- `scripts/deploy/*` and `ALCHEMY_SETUP.md` refer to MockUSDC + USDC addresses.
- `deployments/*.json` artifacts will need USDT token addresses.
- `test/PredictionMarketVault.test.cjs`: references USDC/mUSDC.

### Data Migration / Backfill Tasks
- Update existing `markets` rows to `settlement_asset_code = 'USDT'`.
- Update any existing `wallet_balances` and `wallet_transactions` to USDT if migrating from VCOIN.
- Recompute leaderboard and pnl views if switching asset scope.
- If you keep old VCOIN data, decide on coexistence rules and UI filtering.

### Observability / Webhooks / External Systems
- Helius webhook filtering and any indexing should track the USDT mint.
- Any off-chain indexers or analytics using `asset_code = 'VCOIN'` or `USDC` must be updated.

### Quick Search Pointers
Use these to confirm you didn’t miss anything:
- Search for `VCOIN`, `USDC`, `USDT`, `settlement_asset_code`, `asset_code`.
- Key files: `app/page.tsx`, `src/server/trpc/routers/*.ts`, `db/functions/place_bet_tx.sql`, `supabase/migrations/*leaderboard*`, `supabase/migrations/*signup_bonus*`, `app/api/webhooks/helius/route.ts`, `lib/solana/config.ts`, `scripts/solana/*.ts`, `anchor/programs/*`.

# Supabase DB Context (public)

Generated at: `2025-12-30T01:38:24.859Z`
Supabase URL: `https://zebqsdwawldoehvupmtm.supabase.co`

Refresh: `bun run supabase:schema`

## Resources
Total: **12**

### `assets`
- `code`: `string(text)` — NOT NULL, PK
- `decimals`: `integer(integer)` — NOT NULL
- `is_enabled`: `boolean(boolean)` — NOT NULL
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `market_amm_state`
- `market_id`: `string(uuid)` — NOT NULL, PK, FK → markets.id
- `b`: `number(numeric)` — NOT NULL
- `q_yes`: `number(numeric)` — NOT NULL
- `q_no`: `number(numeric)` — NOT NULL
- `last_price_yes`: `number(numeric)` — NOT NULL
- `fee_accumulated_minor`: `integer(bigint)` — NOT NULL
- `updated_at`: `string(timestamp with time zone)` — NOT NULL

### `market_price_candles`
- `market_id`: `string(uuid)` — NOT NULL, PK, FK → markets.id
- `bucket`: `string(timestamp with time zone)` — NOT NULL, PK
- `open`: `number(numeric)` — NOT NULL
- `high`: `number(numeric)` — NOT NULL
- `low`: `number(numeric)` — NOT NULL
- `close`: `number(numeric)` — NOT NULL
- `volume_minor`: `integer(bigint)` — NOT NULL
- `trades_count`: `integer(integer)` — NOT NULL

### `markets`
- `id`: `string(uuid)` — NOT NULL, PK
- `title_rus`: `string(text)` — NOT NULL
- `title_eng`: `string(text)`
- `description`: `string(text)`
- `state`: `string(public.market_state)` — NOT NULL
- `closes_at`: `string(timestamp with time zone)` — NOT NULL
- `expires_at`: `string(timestamp with time zone)` — NOT NULL
- `resolve_outcome`: `string(public.outcome_side)`
- `settlement_asset_code`: `string(text)` — NOT NULL, FK → assets.code
- `fee_bps`: `integer(integer)` — NOT NULL
- `amm_type`: `string(text)` — NOT NULL
- `liquidity_b`: `number(numeric)` — NOT NULL
- `created_at`: `string(timestamp with time zone)` — NOT NULL
- `category_id`: `string(text)`
- `category_label_ru`: `string(text)`
- `category_label_en`: `string(text)`

### `positions`
- `user_id`: `string(uuid)` — NOT NULL, PK, FK → users.id
- `market_id`: `string(uuid)` — NOT NULL, PK, FK → markets.id
- `outcome`: `string(public.outcome_side)` — NOT NULL, PK
- `shares`: `number(numeric)` — NOT NULL
- `avg_entry_price`: `number(numeric)`
- `updated_at`: `string(timestamp with time zone)` — NOT NULL

### `referral_rewards`
- `id`: `string(uuid)` — NOT NULL, PK
- `source_user_id`: `string(uuid)` — NOT NULL, FK → users.id
- `beneficiary_user_id`: `string(uuid)` — NOT NULL, FK → users.id
- `level`: `integer(integer)` — NOT NULL
- `trade_id`: `string(uuid)` — FK → trades.id
- `market_id`: `string(uuid)` — FK → markets.id
- `asset_code`: `string(text)` — NOT NULL, FK → assets.code
- `amount_minor`: `integer(bigint)` — NOT NULL
- `status`: `string(public.ref_reward_status)` — NOT NULL
- `created_at`: `string(timestamp with time zone)` — NOT NULL
- `commission_rate_snapshot`: `number(numeric)`

### `trades`
- `id`: `string(uuid)` — NOT NULL, PK
- `market_id`: `string(uuid)` — NOT NULL, FK → markets.id
- `user_id`: `string(uuid)` — NOT NULL, FK → users.id
- `action`: `string(public.trade_action)` — NOT NULL
- `outcome`: `string(public.outcome_side)` — NOT NULL
- `asset_code`: `string(text)` — NOT NULL, FK → assets.code
- `collateral_gross_minor`: `integer(bigint)` — NOT NULL
- `fee_minor`: `integer(bigint)` — NOT NULL
- `collateral_net_minor`: `integer(bigint)` — NOT NULL
- `shares_delta`: `number(numeric)` — NOT NULL
- `price_before`: `number(numeric)`
- `price_after`: `number(numeric)`
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `trades_public`
- `id`: `string(uuid)` — PK
- `market_id`: `string(uuid)` — FK → markets.id
- `action`: `string(public.trade_action)`
- `outcome`: `string(public.outcome_side)`
- `asset_code`: `string(text)` — FK → assets.code
- `collateral_gross_minor`: `integer(bigint)`
- `fee_minor`: `integer(bigint)`
- `collateral_net_minor`: `integer(bigint)`
- `shares_delta`: `number(numeric)`
- `price_before`: `number(numeric)`
- `price_after`: `number(numeric)`
- `created_at`: `string(timestamp with time zone)`

### `user_referrals`
- `user_id`: `string(uuid)` — NOT NULL, PK, FK → users.id
- `referrer_user_id`: `string(uuid)` — FK → users.id
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `users`
- `id`: `string(uuid)` — NOT NULL, PK
- `username`: `string(text)`
- `display_name`: `string(text)`
- `email`: `string(text)`
- `created_at`: `string(timestamp with time zone)` — NOT NULL
- `is_admin`: `boolean(boolean)` — NOT NULL
- `referral_code`: `string(text)`
- `referral_commission_rate`: `number(numeric)`
- `referral_enabled`: `boolean(boolean)`

### `wallet_balances`
- `user_id`: `string(uuid)` — NOT NULL, PK, FK → users.id
- `asset_code`: `string(text)` — NOT NULL, PK, FK → assets.code
- `balance_minor`: `integer(bigint)` — NOT NULL
- `updated_at`: `string(timestamp with time zone)` — NOT NULL

### `wallet_transactions`
- `id`: `string(uuid)` — NOT NULL, PK
- `user_id`: `string(uuid)` — NOT NULL, FK → users.id
- `asset_code`: `string(text)` — NOT NULL, FK → assets.code
- `amount_minor`: `integer(bigint)` — NOT NULL
- `kind`: `string(text)` — NOT NULL
- `market_id`: `string(uuid)`
- `trade_id`: `string(uuid)`
- `external_ref`: `string(text)`
- `created_at`: `string(timestamp with time zone)` — NOT NULL

## SQL functions in repo
(These are the SQL files you deploy/apply in Supabase; names extracted from the repo, not from introspection.)

- `db/functions/place_bet_tx.sql`
  - `lmsr_cost_safe`
  - `lmsr_price_yes_safe`
  - `place_bet_tx`
  - `sell_position_tx`

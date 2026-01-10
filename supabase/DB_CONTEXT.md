# Supabase DB Context (public)

Generated at: `2026-01-08T04:46:42.166Z`
Supabase URL: `https://zebqsdwawldoehvupmtm.supabase.co`

Refresh: `bun run supabase:schema`

## Resources
Total: **24**

### `assets`
- `code`: `string(text)` — NOT NULL, PK
- `decimals`: `integer(integer)` — NOT NULL
- `is_enabled`: `boolean(boolean)` — NOT NULL
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `leaderboard_public`
- `user_id`: `string(uuid)` — PK
- `name`: `string(text)`
- `username`: `string(text)`
- `avatar_url`: `string(text)`
- `balance_minor`: `integer(bigint)`
- `pnl_minor`: `number(numeric)`
- `bet_count`: `integer(bigint)`
- `referrals`: `integer(bigint)`
- `rank`: `integer(bigint)`

### `market_amm_state`
- `market_id`: `string(uuid)` — NOT NULL, PK, FK → markets.id
- `b`: `number(numeric)` — NOT NULL
- `q_yes`: `number(numeric)` — NOT NULL
- `q_no`: `number(numeric)` — NOT NULL
- `last_price_yes`: `number(numeric)` — NOT NULL
- `fee_accumulated_minor`: `integer(bigint)` — NOT NULL
- `updated_at`: `string(timestamp with time zone)` — NOT NULL

### `market_bookmarks`
- `user_id`: `string(uuid)` — NOT NULL, PK, FK → users.id
- `market_id`: `string(uuid)` — NOT NULL, PK, FK → markets.id
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `market_categories`
- `id`: `string(text)` — NOT NULL, PK
- `label_ru`: `string(text)` — NOT NULL
- `label_en`: `string(text)` — NOT NULL
- `is_enabled`: `boolean(boolean)` — NOT NULL
- `sort_order`: `integer(integer)` — NOT NULL
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `market_comment_likes`
- `comment_id`: `string(uuid)` — NOT NULL, PK, FK → market_comments.id
- `user_id`: `string(uuid)` — NOT NULL, PK, FK → users.id
- `created_at`: `string(timestamp with time zone)` — NOT NULL

### `market_comments`
- `id`: `string(uuid)` — NOT NULL, PK
- `market_id`: `string(uuid)` — NOT NULL, FK → markets.id
- `user_id`: `string(uuid)` — NOT NULL, FK → users.id
- `body`: `string(text)` — NOT NULL
- `created_at`: `string(timestamp with time zone)` — NOT NULL
- `parent_id`: `string(uuid)` — FK → market_comments.id

### `market_comments_public`
- `id`: `string(uuid)` — PK
- `market_id`: `string(uuid)` — FK → markets.id
- `user_id`: `string(uuid)` — FK → users.id
- `parent_id`: `string(uuid)` — FK → market_comments.id
- `body`: `string(text)`
- `created_at`: `string(timestamp with time zone)`
- `author_name`: `string(text)`
- `author_username`: `string(text)`
- `author_avatar_url`: `string(text)`
- `likes_count`: `integer(integer)`

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
- `category_id`: `string(text)` — FK → market_categories.id
- `category_label_ru`: `string(text)`
- `category_label_en`: `string(text)`
- `created_by`: `string(uuid)` — FK → users.id

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
- `is_sold`: `boolean(boolean)`
- `outcome`: `string(public.outcome_side)`
- `asset_code`: `string(text)` — FK → assets.code
- `collateral_gross_minor`: `integer(bigint)`
- `fee_minor`: `integer(bigint)`
- `collateral_net_minor`: `integer(bigint)`
- `shares_delta`: `number(numeric)`
- `price_before`: `number(numeric)`
- `price_after`: `number(numeric)`
- `created_at`: `string(timestamp with time zone)`

### `trades_public_with_user`
- `id`: `string(uuid)` — PK
- `market_id`: `string(uuid)` — FK → markets.id
- `user_id`: `string(uuid)` — FK → users.id
- `action`: `string(public.trade_action)`
- `is_sold`: `boolean(boolean)`
- `outcome`: `string(public.outcome_side)`
- `asset_code`: `string(text)` — FK → assets.code
- `collateral_gross_minor`: `integer(bigint)`
- `fee_minor`: `integer(bigint)`
- `collateral_net_minor`: `integer(bigint)`
- `shares_delta`: `number(numeric)`
- `price_before`: `number(numeric)`
- `price_after`: `number(numeric)`
- `created_at`: `string(timestamp with time zone)`

### `user_market_bets_public`
- `user_id`: `string(uuid)` — FK → users.id
- `market_id`: `string(uuid)` — FK → markets.id
- `outcome`: `string(public.outcome_side)`
- `last_bet_at`: `string(timestamp with time zone)`
- `is_active`: `boolean(boolean)`
- `position_updated_at`: `string(timestamp with time zone)`

### `user_market_votes_public`
- `user_id`: `string(uuid)` — FK → users.id
- `market_id`: `string(uuid)` — FK → markets.id
- `outcome`: `string(public.outcome_side)`
- `last_bet_at`: `string(timestamp with time zone)`

### `user_pnl_daily_public`
- `user_id`: `string(uuid)` — FK → users.id
- `day`: `string(timestamp with time zone)`
- `pnl_minor`: `number(numeric)`

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
- `telegram_id`: `integer(bigint)`
- `telegram_username`: `string(text)`
- `telegram_first_name`: `string(text)`
- `telegram_last_name`: `string(text)`
- `telegram_photo_url`: `string(text)`
- `telegram_auth_date`: `string(timestamp with time zone)`
- `avatar_url`: `string(text)`

### `users_public`
- `id`: `string(uuid)` — PK
- `username`: `string(text)`
- `display_name`: `string(text)`
- `avatar_url`: `string(text)`
- `telegram_photo_url`: `string(text)`

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

### `wallet_transactions_public`
- `id`: `string(uuid)` — PK
- `user_id`: `string(uuid)` — FK → users.id
- `kind`: `string(text)`
- `amount_minor`: `integer(bigint)`
- `market_id`: `string(uuid)`
- `market_title_rus`: `string(text)`
- `market_title_eng`: `string(text)`
- `created_at`: `string(timestamp with time zone)`

## SQL functions in repo
(These are the SQL files you deploy/apply in Supabase; names extracted from the repo, not from introspection.)

- `db/functions/place_bet_tx.sql`
  - `lmsr_cost_safe`
  - `lmsr_price_yes_safe`
  - `place_bet_tx`
  - `sell_position_tx`

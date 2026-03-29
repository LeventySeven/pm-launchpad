# Yalla Market — Social Layer Implementation Plan

Generated: 2026-03-29 | Branch: main | Status: APPROVED
Reviewed by: /office-hours, /autoplan (CEO + Design + Eng)

## Overview

Build the create-and-share social loop + activity feed for community-driven prediction markets. 5-day sprint. Kill metric: >30% of market creators get 1+ friend to bet via share link.

## Core Insight

Users want to CREATE predictions, not just consume them. The social gathering is the product. Predictions are the activity. "Luma for predictions, not Polymarket with chat."

---

## Day 1: Quick Market Creation

### What
Any community member creates a binary YES/NO market in seconds. Two fields: title + resolution date. No admin needed.

### Backend: `quickCreate` tRPC procedure
- File: `src/server/trpc/routers/market.ts`
- Extract `createMarketCore` shared function from existing `createMarket` (line 3084). Both procedures call it.
- Use `protectedProcedure` (not `publicProcedure` like existing `createMarket`)
- Input: `{ communityId: uuid, title: string(5-200), resolvesAt: datetime }`
- First call: `assertCommunityRole(userId, communityId, "member")` — membership gate
- Rate limit: COUNT query `markets WHERE created_by = userId AND created_at > today` joined through `community_markets WHERE community_id = X`. Max 5/day/community.
- Field defaults: `title_eng` or `title_rus` based on lang, `title` = same value (fallback), `image_url` = null, `category` = null, `settlement_asset` = "VCOIN", `market_type` = "binary", AMM default liquidity
- After market insert: auto-insert into `community_markets` table
- **Must be atomic**: if `community_markets` insert fails, rollback market + AMM state

### Frontend: Quick-create FAB
- File: `components/CommunityProfilePage.tsx`
- Floating action button ("+") visible on ALL tabs, not just MARKETS
- Tapping opens inline form: text input + date picker (defaults 1 week) + submit
- Validation: inline error messages below fields
- Rate limit hit: disable submit, show "Daily limit reached"
- **Success flow**: form collapses, ShareCard slides up immediately, new market appears in feed

---

## Day 2: Telegram Share Card (primary focus)

### What
After creating a market or placing a bet, a bottom sheet appears with one-tap share to Telegram. Everything stays inside the mini app.

### Component: `components/ShareCard.tsx` [DONE]
- Bottom sheet (slides up, 60% height)
- Pre-formatted messages in RU + EN
- "Share to Telegram" button uses `Telegram.WebApp.switchInlineQuery` (stays in TG) or `openTelegramLink` (t.me/share URL)
- "Copy link" button as fallback
- Deeplink format: `https://t.me/yalla_bot?startapp=m_MARKET_ID`
- Non-Telegram fallback: link opens `/market/MARKET_ID` web route

### Deeplink handling [DONE]
- `HomePageClient.tsx:524` already parses `start_param` with `m_` prefix
- No webhook changes needed. `startapp` is client-side (`Telegram.WebApp.initDataUnsafe.start_param`)

### Share-link landing flow (for recipients)
- Deeplink opens mini app directly to market page
- If not authenticated: one-tap Telegram auth (existing flow)
- If no VCOIN: auto-grant starter balance (existing signup bonus)
- Bet form immediately visible. Target: 2 taps from link to bet.

### Inline bot spike (2 hours)
- Test if simplified inline YES/NO keyboard in Telegram group is feasible
- `login_url` in inline keyboard, or pre-filled bet-intent on mini app open
- If feasible: replaces part of Day 3 activity feed time
- If not: defer to Phase 2

### Aggregator link fix [DONE]
- `components/Header.tsx` — changed external `<a>` to `<button>` with `onAggregatorClick`
- Navigates to catalog within the mini app instead of opening external browser

---

## Day 3: Activity Feed

### What
Replace MESSAGES tab with ACTIVITY tab showing what's happening in the community.

### Backend: `community.activityFeed` tRPC procedure
- File: `src/server/trpc/routers/community.ts` + `src/server/services/communities.ts`
- UNION ALL across 4 sources:
  - `trades` (joined via `community_markets`) — "Bob bet YES on [title]"
  - `markets` + `community_markets` — "Alice created [title]"
  - `markets` state changes — "[title] resolved YES"
  - `community_members` — "Charlie joined"
- Join path: `trades.market_id -> community_markets.market_id -> community_markets.community_id`
- Hard 7-day window in every subquery (`WHERE created_at > now() - interval '7 days'`)
- Composite cursor: `(created_at, event_type, id)` for stable pagination
- 20 items per page, cursor-based
- Members-only (activity feed leaks trade behavior, keep scoped to community)

### Required indexes (add before building)
```sql
CREATE INDEX IF NOT EXISTS idx_trades_market_created ON trades(market_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_markets_community_market ON community_markets(community_id, market_id);
CREATE INDEX IF NOT EXISTS idx_markets_created_by_at ON markets(created_by, created_at DESC);
```

### Frontend
- File: `components/CommunityProfilePage.tsx`
- Default tab: ACTIVITY (was MARKETS)
- Tab order: ACTIVITY | MARKETS | EVENTS
- Feed item: `[avatar] [username] [verb] [market title link] [timestamp]`. Single row, no cards.
- Tap market title to navigate
- Empty state: "No activity yet. Create the first prediction!" with quick-create CTA
- Error state: "Could not load activity. Tap to retry."
- Creator highlight: items about markets YOU created get a subtle border highlight
- Infinite scroll via IntersectionObserver (existing pattern)

### Dead code cleanup
- Remove: MESSAGES tab from tabs array, its JSX block, state variables (`messages`, `messagesLoading`, `messageInput`, `sendingMessage`), handlers (`handleSendMessage`, `loadMessages`)
- Keep: `community.messages` tRPC procedure, `community_messages` DB table (for potential future use)

---

## Day 4: Dispute Mechanism + Polish

### Minimal dispute system
- New market state: `disputed`
- Any bettor can tap "Dispute resolution" after creator resolves
- Dispute notifies community admin (creator role)
- Admin can override resolution or confirm it
- Implementation: add `disputed` state + `dispute_reason` column to markets, admin override procedure

### Polish
- Telegram webhook secret token validation (security fix)
- Input sanitization on share card messages (escape Telegram markdown)
- Bilingual title fallback for quick-created markets
- Rate limit UI refinement

---

## Day 5: Real-World Test

### The Assignment
1. Identify 5-10 target Telegram communities by name (crypto, sports, politics, local events)
2. Contact admins, offer to run prediction markets in their group
3. Share the bot link, watch what happens
4. Measure the kill metric

### What to measure
- % of creators who get 1+ friend to bet via share link (kill metric, target >30%)
- Markets created per community per week (target >3)
- Activity feed daily open rate
- Share link click-through rate

---

## Phase 2 (post-validation, if kill metric >30%)

| Feature | Trigger | Effort |
|---------|---------|--------|
| Telegram bot notifications | Kill metric >30% | 2-3 days |
| Prediction contests | 3+ active communities | 1 week |
| Inline bot YES/NO buttons | Spike succeeds on Day 2 | 2-3 days |
| Copy trading / follow portfolios | 10+ active traders | 1 week |
| Daily streaks + achievements | Retention drops below 20% D7 | 3-4 days |
| Event-linked predictions | Premise 5 validated | 1 week |

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| quickCreate vs duplicate | Shared `createMarketCore` function | DRY, one AMM init path |
| Auth on quickCreate | `protectedProcedure` + `assertCommunityRole` | Consistent with community router |
| Activity feed query | UNION ALL with 7-day window + composite cursor | Performant without new infra |
| Feed visibility | Members-only | Trade behavior is private data |
| Share mechanism | `Telegram.WebApp.switchInlineQuery` | Stays inside TG, native chat picker |
| Messages tab | Replace with activity, keep DB/router | One-way door, accepted |
| Aggregator link | In-app navigation | Stays in mini app, no external browser |

---

## Files to Create

| File | Purpose |
|------|---------|
| `components/ShareCard.tsx` | Share bottom sheet [DONE] |
| `src/server/services/notifications.ts` | Phase 2: bot notification triggers |

## Files to Modify

| File | Change |
|------|--------|
| `src/server/trpc/routers/market.ts` | Add `quickCreate` procedure, extract `createMarketCore` |
| `src/server/trpc/routers/community.ts` | Add `activityFeed` procedure |
| `src/server/services/communities.ts` | Add `getActivityFeed` service function |
| `components/CommunityProfilePage.tsx` | FAB, quick-create form, activity feed tab, remove messages |
| `components/HomePageClient.tsx` | Wire ShareCard after bet success |
| `components/MarketPage.tsx` | Trigger ShareCard after bet |
| `components/Header.tsx` | Aggregator opens in-app [DONE] |
| `app/globals.css` | Slide-up animation [DONE] |
| `src/types/telegram-webapp.ts` | Add share/deeplink methods [DONE] |

## Files to Leave Alone

- `src/server/trpc/routers/auth.ts` — no auth changes
- `lib/solana/` — scaffolding, not active
- `anchor/`, `contracts/` — smart contract reference
- LMSR AMM logic — don't touch pricing

---

## GSTACK REVIEW REPORT

| Review | Trigger | Runs | Status | Key Findings |
|--------|---------|------|--------|-------------|
| Office Hours | `/office-hours` | 1 | DONE | 5 premises, cross-model perspective, "Luma for predictions" framing |
| Adversarial Spec | Spec review loop | 1 | DONE (9/10) | 11 issues found and fixed |
| CEO Review | `/autoplan` Phase 1 | 1 | DONE | No acquisition pipeline (critical), inline bot dismissed, trade privacy leak |
| Design Review | `/autoplan` Phase 2 | 1 | DONE | Creation success flow undesigned (critical), emotional peak invisible, default tab wrong |
| Eng Review | `/autoplan` Phase 3 | 1 | DONE | Extract createMarketCore (critical), UNION ALL perf, zero tests, webhook secret |

**VERDICT:** APPROVED with 3 taste decisions resolved (spike inline buttons, add dispute mechanism, 2 days share card). Ready for implementation.

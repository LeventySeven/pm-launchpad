# Pravda Market Next.js + Bun

Prediction market demo being prepared for Telegram Mini App. Current stack:
- Bun.js + Next.js (App Router) + TypeScript
- Tailwind CSS with lucide icons; shadcn/ui ready to drop in
- Supabase client libraries preinstalled for future auth/data

## Getting started
1. Install [Bun](https://bun.sh) v1.1+.
2. Install deps: `bun install`
3. Create `.env.local` and add any needed secrets (e.g. Supabase keys, Telegram bot info, Gemini API key if you use it later).
4. Run dev server: `bun dev`

## Scripts
- `bun dev` – start Next dev server
- `bun build` – production build
- `bun start` – run built app
- `bun lint` – run Next/ESLint

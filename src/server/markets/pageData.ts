import "server-only";
import { createCaller } from "../trpc/router";
import { createSupabaseUserClient, getSupabaseServiceClient } from "../supabase/client";

// ---------------------------------------------------------------------------
// SSR Data Assembly
// ---------------------------------------------------------------------------
// These functions run inside Next.js server components to pre-fetch data that
// is baked into the HTML. The client never shows a loading spinner for this
// data — it's available on first paint.
// ---------------------------------------------------------------------------

/** Race a promise against a timeout. Returns `fallback` if the promise is too slow. */
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);

const SSR_TIMEOUT_MS = 3_000;

/**
 * Build a tRPC caller that runs server-side (no HTTP round-trip).
 * Uses the anon Supabase client (no auth) since SSR pages are public.
 */
function createServerCaller() {
  const supabase = createSupabaseUserClient();
  let supabaseService = supabase;
  try {
    supabaseService = getSupabaseServiceClient();
  } catch {
    // Fall back to anon client in dev/preview envs
  }

  return createCaller({
    supabase,
    supabaseService,
    req: new Request("http://localhost"),
    cookies: {},
    responseHeaders: {},
    setCookie: () => {},
    authUser: null,
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MarketApiRow = {
  id: string;
  titleRu: string;
  titleEn: string;
  description?: string | null;
  source?: string | null;
  imageUrl?: string;
  state: string;
  createdAt: string;
  closesAt: string;
  expiresAt: string;
  marketType?: "binary" | "multi_choice";
  resolvedOutcomeId?: string | null;
  outcomes?: Array<{
    id?: string;
    marketId?: string;
    slug?: string;
    title?: string;
    iconUrl?: string | null;
    chartColor?: string | null;
    sortOrder?: number;
    isActive?: boolean;
    probability?: number;
    price?: number;
  }>;
  outcome: "YES" | "NO" | null;
  createdBy?: string | null;
  categoryId?: string | null;
  categoryLabelRu?: string | null;
  categoryLabelEn?: string | null;
  settlementAsset?: string | null;
  feeBps?: number | null;
  liquidityB?: number | null;
  priceYes: number;
  priceNo: number;
  volume: number;
  chance?: number | null;
  creatorName?: string | null;
  creatorAvatarUrl?: string | null;
};

export type MarketCategoryRow = {
  id: string;
  labelRu: string;
  labelEn: string;
};

export type HomePageInitialData = {
  initialMarkets: MarketApiRow[];
  initialCategories: MarketCategoryRow[];
  fetchedAt: number;
};

export type MarketDetailInitialData = HomePageInitialData & {
  initialMarketId: string;
  initialMarketDetail: MarketApiRow | null;
};

// ---------------------------------------------------------------------------
// Data Fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch initial data for the home/catalog page.
 * Called from the server component — result is baked into HTML.
 */
export async function getHomePageInitialData(): Promise<HomePageInitialData> {
  try {
    const caller = createServerCaller();

    const [marketsRaw, categoriesRaw] = await Promise.all([
      withTimeout(
        caller.market.listMarkets({ onlyOpen: false }),
        SSR_TIMEOUT_MS,
        [],
      ),
      withTimeout(
        caller.market.listCategories(),
        SSR_TIMEOUT_MS,
        [],
      ),
    ]);

    // The tRPC output shape matches MarketApiRow — cast directly.
    // JSON serialization via superjson already strips non-serializable values.
    const markets = (marketsRaw ?? []) as unknown as MarketApiRow[];

    const categories: MarketCategoryRow[] = (categoriesRaw ?? []).map((c) => ({
      id: c.id,
      labelRu: c.labelRu,
      labelEn: c.labelEn,
    }));

    return {
      initialMarkets: markets,
      initialCategories: categories,
      fetchedAt: Date.now(),
    };
  } catch (err) {
    console.error("[SSR] getHomePageInitialData failed:", err);
    return {
      initialMarkets: [],
      initialCategories: [],
      fetchedAt: Date.now(),
    };
  }
}

/**
 * Fetch initial data for a market detail page.
 * Includes all home page data plus the specific market detail.
 */
export async function getMarketDetailInitialData(
  marketId: string
): Promise<MarketDetailInitialData> {
  try {
    // Fetch home data and market detail in parallel, sharing one caller
    const [homeData, marketDetail] = await Promise.all([
      getHomePageInitialData(),
      withTimeout(
        createServerCaller().market.getMarket({ marketId }).catch(() => null),
        SSR_TIMEOUT_MS,
        null,
      ),
    ]);

    const detail = marketDetail
      ? (marketDetail as unknown as MarketApiRow)
      : null;

    return {
      ...homeData,
      initialMarketId: marketId,
      initialMarketDetail: detail,
    };
  } catch (err) {
    console.error("[SSR] getMarketDetailInitialData failed:", err);
    return {
      initialMarkets: [],
      initialCategories: [],
      fetchedAt: Date.now(),
      initialMarketId: marketId,
      initialMarketDetail: null,
    };
  }
}

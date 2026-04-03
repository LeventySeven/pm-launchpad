'use client';

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { trpcClient } from "@/src/utils/trpcClient";
import CommunityCard from "@/components/CommunityCard";
import MarketCard from "@/components/MarketCard";
import type { CommunityPublic } from "@/src/server/services/communities";
import type { Market, User } from "@/types";

type DiscoverPageProps = {
  lang: "RU" | "EN";
  onCommunityClick: (slug: string) => void;
  onCreateCommunity: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  /** All markets (for feed tab) */
  markets?: Market[];
  user?: User | null;
  onMarketClick?: (market: Market) => void;
  onQuickBet?: (market: Market, side: "YES" | "NO") => void;
  onUserClick?: (userId: string) => void;
};

const CATEGORY_ICONS: Record<string, string> = {
  politics: "\u{1F3DB}\u{FE0F}",
  crypto: "\u{20BF}",
  sports: "\u{26BD}",
  entertainment: "\u{1F3AC}",
  science: "\u{1F52C}",
  business: "\u{1F4BC}",
  technology: "\u{1F4BB}",
  world: "\u{1F30D}",
};

type HubTab = "FEED" | "COMMUNITIES";

export default function DiscoverPage({
  lang,
  onCommunityClick,
  onCreateCommunity,
  isLoggedIn,
  onLogin,
  markets = [],
  user,
  onMarketClick,
  onQuickBet,
  onUserClick,
}: DiscoverPageProps) {
  const [hubTab, setHubTab] = useState<HubTab>("FEED");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ category: string; count: number }>>([]);
  const [communities, setCommunities] = useState<CommunityPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Feed: user's communities + their markets
  const [userCommunities, setUserCommunities] = useState<CommunityPublic[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await trpcClient.community.categories.query();
      setCategories(cats);
    } catch { /* silent */ }
  }, []);

  const loadCommunities = useCallback(async (opts?: { category?: string; search?: string }) => {
    const isSearching = !!(opts?.search || opts?.category);
    if (isSearching) setSearchLoading(true);
    else setLoading(true);
    try {
      const result = await trpcClient.community.list.query({
        category: opts?.category ?? undefined,
        search: opts?.search ?? undefined,
        limit: 20,
      });
      setCommunities(result.communities);
    } catch {
      setCommunities([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, []);

  const loadUserFeed = useCallback(async () => {
    if (!user) return;
    setFeedLoading(true);
    try {
      const myCommunities = await trpcClient.community.userCommunities.query({ userId: user.id });
      setUserCommunities(myCommunities);
    } catch { /* silent */ } finally { setFeedLoading(false); }
  }, [user]);

  useEffect(() => {
    void loadCategories();
    void loadCommunities();
    if (user) void loadUserFeed();
  }, [loadCategories, loadCommunities, loadUserFeed, user]);

  useEffect(() => {
    if (hubTab !== "COMMUNITIES") return;
    const timer = setTimeout(() => {
      void loadCommunities({
        category: activeCategory ?? undefined,
        search: search.trim() || undefined,
      });
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [activeCategory, search, loadCommunities, hubTab]);

  // Build feed items: markets from user's communities
  const feedMarketIds = new Set(
    userCommunities.flatMap(() => []) // We don't have market IDs here, so show recent markets instead
  );
  // For the feed, show recent markets sorted by creation date
  const recentMarkets = [...markets]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 20);

  return (
    <div className="px-4 pt-2">
      {/* Twitter-style tab toggle */}
      <div className="flex items-center border-b border-zinc-900 mb-3">
        {(["FEED", "COMMUNITIES"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setHubTab(t)}
            className={`flex-1 py-3 text-center text-sm font-semibold transition relative ${
              hubTab === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t === "FEED"
              ? lang === "RU" ? "Лента" : "Feed"
              : lang === "RU" ? "Сообщества" : "Communities"}
            {hubTab === t && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-[rgba(245,68,166,1)]" />
            )}
          </button>
        ))}
      </div>

      {/* ═══ FEED TAB ═══ */}
      {hubTab === "FEED" && (
        <div>
          {!user ? (
            <div className="text-center py-16">
              <div className="text-zinc-500 text-sm mb-3">
                {lang === "RU" ? "Войдите, чтобы видеть ленту" : "Sign in to see your feed"}
              </div>
              <button onClick={onLogin} className="px-4 py-2 rounded-full bg-[rgba(245,68,166,1)] text-white text-xs font-semibold">
                {lang === "RU" ? "Войти" : "Sign in"}
              </button>
            </div>
          ) : feedLoading ? (
            <div className="text-center py-12 text-zinc-500">
              <Loader2 size={20} className="animate-spin mx-auto" />
            </div>
          ) : (
            <div>
              {/* User's communities row */}
              {userCommunities.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    {lang === "RU" ? "Ваши сообщества" : "Your Communities"}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2" data-swipe-ignore="true">
                    {userCommunities.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onCommunityClick(c.slug)}
                        className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70 transition"
                      >
                        {c.bannerUrl ? (
                          <img src={c.bannerUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-zinc-300 font-medium max-w-[80px] truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent markets as feed */}
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                {lang === "RU" ? "Последние прогнозы" : "Recent Predictions"}
              </div>
              {recentMarkets.length > 0 ? (
                <div className="space-y-3 pb-8">
                  {recentMarkets.map((m) => (
                    <div key={m.id}>
                      {/* Creator attribution */}
                      {m.creatorName && (
                        <div className="flex items-center gap-2 mb-1.5">
                          <img src="/pink.svg" alt="" className="h-4 w-4" />
                          <span className="text-xs text-zinc-500">
                            <span className="font-medium text-zinc-300">{m.creatorName}</span>
                            {" "}{lang === "RU" ? "создал" : "created"}
                          </span>
                          <span className="text-[10px] text-zinc-600 ml-auto">
                            {m.createdAt && new Date(m.createdAt).toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      )}
                      <MarketCard
                        market={m}
                        bookmarked={false}
                        onClick={() => onMarketClick?.(m)}
                        onQuickBet={onQuickBet ? (side) => onQuickBet(m, side) : () => {}}
                        lang={lang}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-sm">
                  {lang === "RU" ? "Пока нет прогнозов" : "No predictions yet"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ COMMUNITIES TAB ═══ */}
      {hubTab === "COMMUNITIES" && (
        <div>
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "RU" ? "Найти сообщество..." : "Find a community..."}
              className="w-full h-10 rounded-full bg-zinc-950 border border-zinc-900 px-4 pl-10 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-zinc-600" />
            {searchLoading && <Loader2 size={16} className="absolute right-3.5 top-3 text-zinc-600 animate-spin" />}
          </div>

          {/* Create */}
          <button
            type="button"
            onClick={isLoggedIn ? onCreateCommunity : onLogin}
            className="w-full mb-4 h-11 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 hover:bg-zinc-950/60 transition flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white"
          >
            <Plus size={16} />
            {lang === "RU" ? "Создать сообщество" : "Create Community"}
          </button>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="mb-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                {lang === "RU" ? "Категории" : "Categories"}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition ${
                    !activeCategory
                      ? "border-[rgba(245,68,166,1)] bg-[rgba(245,68,166,0.12)] text-white"
                      : "border-zinc-900 bg-black text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {lang === "RU" ? "Все" : "All"}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.category}
                    type="button"
                    onClick={() => setActiveCategory(activeCategory === c.category ? null : c.category)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition ${
                      activeCategory === c.category
                        ? "border-[rgba(245,68,166,1)] bg-[rgba(245,68,166,0.12)] text-white"
                        : "border-zinc-900 bg-black text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {CATEGORY_ICONS[c.category] ?? ""} {c.category} ({c.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Community grid */}
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            {activeCategory ?? (lang === "RU" ? "Сообщества" : "Communities")}
          </div>
          {loading ? (
            <div className="text-center py-12 text-zinc-500">
              <Loader2 size={20} className="animate-spin mx-auto mb-2" />
            </div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 pb-8">
              {communities.map((c) => (
                <CommunityCard key={c.id} community={c} onClick={() => onCommunityClick(c.slug)} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-sm">
              {search ? (lang === "RU" ? "Ничего не найдено" : "No results") : (lang === "RU" ? "Пока нет сообществ" : "No communities yet")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

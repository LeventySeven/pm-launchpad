'use client';

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { trpcClient } from "@/src/utils/trpcClient";
import CommunityCard from "@/components/CommunityCard";
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

  // Feed
  const [userCommunities, setUserCommunities] = useState<CommunityPublic[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  type GlobalFeedItem = {
    id: string; type: "bet" | "join" | "community_created" | "market_created";
    userId: string; userName: string; userAvatar: string | null;
    marketId: string | null; marketTitle: string | null;
    communityId: string | null; communityName: string | null; communitySlug: string | null;
    outcome: string | null; createdAt: string;
  };
  const [feedItems, setFeedItems] = useState<GlobalFeedItem[]>([]);

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
    setFeedLoading(true);
    try {
      const [feedResult, commResult] = await Promise.all([
        trpcClient.community.globalFeed.query(),
        user ? trpcClient.community.userCommunities.query({ userId: user.id }) : Promise.resolve([]),
      ]);
      setFeedItems(feedResult as GlobalFeedItem[]);
      setUserCommunities(commResult);
    } catch { /* silent */ } finally { setFeedLoading(false); }
  }, [user]);

  useEffect(() => {
    void loadCategories();
    void loadCommunities();
    void loadUserFeed();
  }, [loadCategories, loadCommunities, loadUserFeed]);

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
          {/* User's communities horizontal scroll */}
          {userCommunities.length > 0 && (
            <div className="mb-4">
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

          {/* Global social feed */}
          {feedLoading ? (
            <div className="text-center py-12 text-zinc-500">
              <Loader2 size={20} className="animate-spin mx-auto" />
            </div>
          ) : feedItems.length > 0 ? (
            <div className="divide-y divide-zinc-900/60 pb-8">
              {feedItems.map((item) => {
                const timeStr = new Date(item.createdAt).toLocaleDateString(
                  lang === "RU" ? "ru-RU" : "en-US", { month: "short", day: "numeric" }
                );

                // ── Bet: "Slava placed a bet YES on 'Will BTC...'" ──
                if (item.type === "bet") {
                  const market = markets.find((m) => m.id === item.marketId);
                  return (
                    <div key={item.id} className="py-3">
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(190,255,29,1)" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <button type="button" onClick={() => item.userId && onUserClick?.(item.userId)} className="shrink-0">
                          {item.userAvatar ? (
                            <img src={item.userAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {item.userName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="font-semibold text-white">{item.userName}</span>
                            <span className="text-zinc-400"> {lang === "RU" ? "поставил" : "placed a bet"} </span>
                            {item.outcome && (
                              <span className={`font-bold ${item.outcome === "YES" ? "text-[rgba(190,255,29,1)]" : "text-[rgba(245,68,166,1)]"}`}>
                                {item.outcome}
                              </span>
                            )}
                            {item.marketTitle && (
                              <span className="text-zinc-400"> {lang === "RU" ? "на" : "on"} </span>
                            )}
                          </div>
                          {item.marketTitle && (
                            <button
                              type="button"
                              onClick={() => market && onMarketClick?.(market)}
                              className="text-sm text-[rgba(245,68,166,1)] hover:underline text-left mt-0.5 line-clamp-2"
                            >
                              &ldquo;{item.marketTitle}&rdquo;
                            </button>
                          )}
                          <div className="text-[10px] text-zinc-600 mt-1">{timeStr}</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ── Join: "Slava joined Bitcoin Puppets" ──
                if (item.type === "join") {
                  return (
                    <div key={item.id} className="py-3">
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(245,68,166,1)" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </div>
                        <button type="button" onClick={() => item.userId && onUserClick?.(item.userId)} className="shrink-0">
                          {item.userAvatar ? (
                            <img src={item.userAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {item.userName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="font-semibold text-white">{item.userName}</span>
                            <span className="text-zinc-400"> {lang === "RU" ? "присоединился к" : "joined"} </span>
                            {item.communitySlug ? (
                              <button
                                type="button"
                                onClick={() => item.communitySlug && onCommunityClick(item.communitySlug)}
                                className="font-semibold text-white hover:underline"
                              >
                                {item.communityName}
                              </button>
                            ) : (
                              <span className="font-semibold text-white">{item.communityName}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-600 mt-1">{timeStr}</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ── Community created: "Slava created Bitcoin Puppets" ──
                if (item.type === "community_created") {
                  return (
                    <div key={item.id} className="py-3">
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(99,102,241,1)" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        </div>
                        <button type="button" onClick={() => item.userId && onUserClick?.(item.userId)} className="shrink-0">
                          {item.userAvatar ? (
                            <img src={item.userAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                              {item.userName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">
                            <span className="font-semibold text-white">{item.userName}</span>
                            <span className="text-zinc-400"> {lang === "RU" ? "создал сообщество" : "created"} </span>
                            {item.communitySlug ? (
                              <button
                                type="button"
                                onClick={() => item.communitySlug && onCommunityClick(item.communitySlug)}
                                className="font-semibold text-white hover:underline"
                              >
                                {item.communityName}
                              </button>
                            ) : (
                              <span className="font-semibold text-white">{item.communityName}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-600 mt-1">{timeStr}</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-zinc-500 text-sm mb-3">
                {lang === "RU" ? "Пока нет активности" : "No activity yet"}
              </div>
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

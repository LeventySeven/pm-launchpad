import React, { useEffect, useMemo, useState } from "react";
import { X, Clock } from "lucide-react";
import type { Market } from "../types";
import FollowButton from "@/components/FollowButton";

type PublicUser = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  telegramPhotoUrl: string | null;
};

type PublicComment = {
  id: string;
  marketId: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  likesCount: number;
};

type PublicBet = {
  marketId: string;
  outcome: "YES" | "NO" | null;
  lastBetAt: string;
  isActive: boolean;
};

type RecentMarket = {
  id: string;
  title: string;
  imageUrl?: string;
  feeMajor?: number;
};

export type ProfileCommunity = {
  id: string;
  slug: string;
  name: string;
  bannerUrl: string | null;
};

type PublicUserProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lang: "RU" | "EN";
  loading: boolean;
  error: string | null;
  user: PublicUser | null;
  pnlMajor: number;
  bets: PublicBet[];
  comments: PublicComment[];
  markets: Market[];
  communities?: ProfileCommunity[];
  onMarketClick: (marketId: string) => void;
  onCommunityClick?: (slug: string) => void;
  followStatus?: { isFollowing: boolean; isFollowedBy: boolean } | null;
  followerCount?: number;
  followingCount?: number;
  marketsCreated?: number;
  totalVolumeMajor?: number;
  onFollow?: () => Promise<void>;
  onUnfollow?: () => Promise<void>;
};

const hashStringToInt = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const accentPairFromSeed = (seed: string) => {
  const h = hashStringToInt(seed);
  const hueA = h % 360;
  const hueB = (hueA + 32 + ((h >> 8) % 48)) % 360;
  return {
    a: `hsla(${hueA}, 85%, 58%, 0.20)`,
    b: `hsla(${hueB}, 85%, 58%, 0.16)`,
  };
};

const accentPairFromHue = (hueA: number) => {
  const hueB = (hueA + 28) % 360;
  return {
    a: `hsla(${hueA}, 85%, 58%, 0.20)`,
    b: `hsla(${hueB}, 85%, 58%, 0.16)`,
  };
};

const hueFromRgb = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  if (d < 1e-9) return 0;
  let h = 0;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
};

const sampleAvatarHue = async (src: string): Promise<number | null> => {
  try {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("AVATAR_LOAD_FAILED"));
    });
    img.src = src;
    await loaded;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return hueFromRgb(data[0] ?? 0, data[1] ?? 0, data[2] ?? 0);
  } catch {
    return null;
  }
};

const formatCompact = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
};

const formatFollowers = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const PublicUserProfileModal: React.FC<PublicUserProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  loading,
  error,
  user,
  pnlMajor,
  bets,
  comments,
  markets,
  communities,
  onMarketClick,
  onCommunityClick,
  followStatus,
  followerCount,
  followingCount,
  marketsCreated,
  totalVolumeMajor,
  onFollow,
  onUnfollow,
}) => {
  const marketById = useMemo(() => new Map(markets.map((m) => [m.id, m])), [markets]);
  const displayName = user ? (user.displayName ?? user.username) : "";
  const avatarSrc = user ? (user.avatarUrl ?? user.telegramPhotoUrl) : null;

  const accentSeed = String(user?.avatarUrl ?? user?.telegramPhotoUrl ?? user?.id ?? displayName ?? "seed");
  const [accent, setAccent] = useState(() => accentPairFromSeed(accentSeed));

  useEffect(() => {
    const src = avatarSrc && avatarSrc.trim().length > 0 ? avatarSrc : null;
    if (!src) {
      setAccent(accentPairFromSeed(accentSeed));
      return;
    }
    let cancelled = false;
    void (async () => {
      const hue = await sampleAvatarHue(src);
      if (cancelled) return;
      setAccent(hue === null ? accentPairFromSeed(accentSeed) : accentPairFromHue(hue));
    })();
    return () => { cancelled = true; };
  }, [avatarSrc, accentSeed]);

  // Recent markets: markets created by this user (from bets data for now, or the catalog)
  const recentMarkets = useMemo(() => {
    // Show markets the user has bet on recently (template shows "Recent Markets" with fees)
    const seen = new Set<string>();
    return (bets ?? [])
      .filter((b) => b.isActive)
      .sort((a, b) => new Date(b.lastBetAt).getTime() - new Date(a.lastBetAt).getTime())
      .slice(0, 5)
      .map((b) => {
        if (seen.has(b.marketId)) return null;
        seen.add(b.marketId);
        const m = marketById.get(b.marketId);
        if (!m) return null;
        return {
          id: m.id,
          title: lang === "RU" ? (m.titleRu ?? m.title) : (m.titleEn ?? m.title),
          imageUrl: m.imageUrl,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [bets, marketById, lang]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      data-swipe-ignore="true"
    >
      <div className="w-full max-w-md bg-[#111111] border border-zinc-800/60 rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)] sm:max-h-[92vh] flex flex-col mt-6 sm:mt-0">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full border border-zinc-800 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
          aria-label={lang === "RU" ? "Закрыть" : "Close"}
        >
          <X size={16} />
        </button>

        {loading ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            {lang === "RU" ? "Загрузка..." : "Loading..."}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-zinc-500 text-sm">{error}</div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-5 pb-6">
              {/* ── Header: Avatar + Name + Followers + Follow Button ── */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border-2 border-zinc-700 bg-zinc-900 overflow-hidden flex items-center justify-center shrink-0">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-zinc-400 font-bold text-lg">
                      {displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-white truncate">
                    {displayName || (lang === "RU" ? "Пользователь" : "User")}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {formatFollowers(followerCount ?? 0)} {lang === "RU" ? "подписчиков" : "Followers"}
                  </div>
                </div>
                {followStatus && onFollow && onUnfollow && (
                  <FollowButton
                    isFollowing={followStatus.isFollowing}
                    isFollowedBy={followStatus.isFollowedBy}
                    onFollow={onFollow}
                    onUnfollow={onUnfollow}
                    lang={lang}
                    size="md"
                  />
                )}
              </div>

              {/* ── Stats Cards: Markets Created + Total Volume ── */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="border border-zinc-800/60 bg-zinc-900/40 rounded-2xl p-4">
                  <div className="text-xs text-zinc-500 mb-1">
                    {lang === "RU" ? "Рынков создано" : "Markets Created"}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {marketsCreated ?? 0}
                  </div>
                </div>
                <div className="border border-zinc-800/60 bg-zinc-900/40 rounded-2xl p-4">
                  <div className="text-xs text-zinc-500 mb-1">
                    {lang === "RU" ? "Общий объём" : "Total Volume"}
                  </div>
                  <div className="text-2xl font-bold text-[rgba(190,255,29,1)]">
                    {formatCompact(totalVolumeMajor ?? 0)}
                  </div>
                </div>
              </div>

              {/* ── Communities ── */}
              {communities && communities.length > 0 && (
                <div className="mt-5">
                  <div className="text-sm font-bold text-white mb-3">
                    {lang === "RU" ? "Сообщества" : "Communities"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {communities.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onCommunityClick?.(c.slug)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-900/70 transition"
                      >
                        <div className="h-5 w-5 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                          {c.bannerUrl ? (
                            <img src={c.bannerUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-500 text-[9px] font-bold">
                              {c.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-zinc-300 font-medium truncate max-w-[120px]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Recent Markets ── */}
              {recentMarkets.length > 0 && (
                <div className="mt-6">
                  <div className="text-sm font-bold text-white mb-3">
                    {lang === "RU" ? "Недавние рынки" : "Recent Markets"}
                  </div>
                  <div className="space-y-2">
                    {recentMarkets.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onMarketClick(m.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:bg-zinc-900/60 transition text-left"
                      >
                        <div className="h-10 w-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                          {m.imageUrl && !m.imageUrl.startsWith("data:") ? (
                            <img src={m.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs font-bold">
                              {m.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-zinc-200 font-medium truncate">{m.title}</div>
                          <div className="text-xs text-zinc-600 mt-0.5 truncate">
                            {lang === "RU" ? "Рынок" : "Market"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Bets / Comments (collapsible) ── */}
              {(bets.length > 0 || comments.length > 0) && (
                <div className="mt-6 pt-4 border-t border-zinc-800/40">
                  {bets.filter((b) => b.isActive).length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                        {lang === "RU" ? "Активные ставки" : "Active Bets"}
                      </div>
                      <div className="space-y-1.5">
                        {bets
                          .filter((b) => b.isActive)
                          .sort((a, b) => new Date(b.lastBetAt).getTime() - new Date(a.lastBetAt).getTime())
                          .slice(0, 5)
                          .map((b) => {
                            const m = marketById.get(b.marketId);
                            const title = m ? ((lang === "RU" ? m.titleRu : m.titleEn) || m.title) : b.marketId;
                            const sideColor = b.outcome === "YES" ? "text-[rgba(190,255,29,1)]" : "text-[rgba(245,68,166,1)]";
                            return (
                              <button
                                key={`${b.marketId}:${b.outcome}`}
                                type="button"
                                onClick={() => onMarketClick(b.marketId)}
                                className="w-full text-left p-2.5 rounded-xl bg-zinc-900/30 hover:bg-zinc-900/60 transition text-sm"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-zinc-300 truncate">{title}</span>
                                  <span className={`shrink-0 font-semibold text-xs ${sideColor}`}>
                                    {b.outcome === "YES" ? (lang === "RU" ? "Да" : "Yes") : (lang === "RU" ? "Нет" : "No")}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicUserProfileModal;

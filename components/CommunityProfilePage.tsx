'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Users, BarChart3, Globe, Lock, Plus, Loader2 } from "lucide-react";
import { trpcClient } from "@/src/utils/trpcClient";
import type { Market, User } from "@/types";
import MarketCard from "@/components/MarketCard";

type CommunityData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  privacy: string;
  category: string | null;
  memberCount: number;
  marketCount: number;
  createdBy: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  createdAt: string;
};

type MemberInfo = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  joinedAt: string;
};

type CommunityProfilePageProps = {
  communitySlug: string;
  user: User | null;
  lang: "RU" | "EN";
  markets: Market[];
  onBack: () => void;
  onMarketClick: (market: Market) => void;
  onLogin: () => void;
  onUserClick: (userId: string) => void;
};

const hashStringToInt = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export default function CommunityProfilePage({
  communitySlug,
  user,
  lang,
  markets,
  onBack,
  onMarketClick,
  onLogin,
  onUserClick,
}: CommunityProfilePageProps) {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [tab, setTab] = useState<"MARKETS" | "MEMBERS">("MARKETS");
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [communityMarketIds, setCommunityMarketIds] = useState<string[]>([]);

  const loadCommunity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trpcClient.community.bySlug.query({ slug: communitySlug });
      setCommunity(data);

      // Load market IDs
      const marketData = await trpcClient.community.marketIds.query({
        communityId: data.id,
        limit: 50,
      });
      setCommunityMarketIds(marketData.marketIds);

      // Check membership
      if (user) {
        const userCommunities = await trpcClient.community.userCommunities.query({ userId: user.id });
        const membership = userCommunities.find((c) => c.id === data.id);
        setIsMember(!!membership);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load community");
    } finally {
      setLoading(false);
    }
  }, [communitySlug, user]);

  useEffect(() => {
    void loadCommunity();
  }, [loadCommunity]);

  const loadMembers = useCallback(async () => {
    if (!community) return;
    setMembersLoading(true);
    try {
      const data = await trpcClient.community.members.query({
        communityId: community.id,
        limit: 50,
      });
      setMembers(data.members);
    } catch {
      // Silently fail
    } finally {
      setMembersLoading(false);
    }
  }, [community]);

  useEffect(() => {
    if (tab === "MEMBERS" && members.length === 0) {
      void loadMembers();
    }
  }, [tab, members.length, loadMembers]);

  const handleJoin = async () => {
    if (!user) {
      onLogin();
      return;
    }
    if (!community) return;
    setJoinLoading(true);
    try {
      if (isMember) {
        await trpcClient.community.leave.mutate({ communityId: community.id });
        setIsMember(false);
      } else {
        await trpcClient.community.join.mutate({ communityId: community.id });
        setIsMember(true);
      }
      await loadCommunity();
    } catch {
      // Silently fail
    } finally {
      setJoinLoading(false);
    }
  };

  // Map community market IDs to actual Market objects from the catalog
  const communityMarkets = useMemo(() => {
    const marketMap = new Map(markets.map((m) => [m.id, m]));
    return communityMarketIds
      .map((id) => marketMap.get(id))
      .filter((m): m is Market => m !== undefined);
  }, [markets, communityMarketIds]);

  const hue = community ? hashStringToInt(community.slug) % 360 : 200;
  const gradientA = `hsla(${hue}, 85%, 58%, 0.20)`;
  const gradientB = `hsla(${(hue + 30) % 360}, 85%, 58%, 0.16)`;

  if (loading) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-zinc-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center py-20 text-zinc-500">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" />
          {lang === "RU" ? "Загрузка..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-zinc-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center py-20 text-zinc-500">
          {error || (lang === "RU" ? "Сообщество не найдено" : "Community not found")}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header with gradient */}
      <div
        className="relative overflow-hidden p-5 pb-6"
        style={{
          backgroundImage: community.bannerUrl
            ? `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9)), url(${community.bannerUrl})`
            : `radial-gradient(600px 200px at 50% 0%, ${gradientA}, transparent 70%), radial-gradient(400px 150px at 80% 20%, ${gradientB}, transparent 60%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-full border border-zinc-900 bg-black/60 backdrop-blur hover:bg-black/80 flex items-center justify-center text-zinc-300 mb-4"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {community.privacy === "private" ? (
                <Lock size={14} className="text-zinc-400 shrink-0" />
              ) : (
                <Globe size={14} className="text-zinc-400 shrink-0" />
              )}
              {community.category && (
                <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
                  {community.category}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-white">{community.name}</h1>
            {community.description && (
              <p className="text-sm text-zinc-400 mt-1 line-clamp-3">{community.description}</p>
            )}
          </div>

          <button
            onClick={handleJoin}
            disabled={joinLoading || memberRole === "creator"}
            className={`shrink-0 h-9 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition inline-flex items-center gap-2 ${
              isMember
                ? "border border-zinc-700 bg-zinc-950/60 text-zinc-200 hover:border-red-500/50 hover:text-red-400"
                : "bg-[rgba(245,68,166,1)] text-white hover:opacity-90"
            } disabled:opacity-50`}
          >
            {joinLoading && <Loader2 size={14} className="animate-spin" />}
            {isMember
              ? lang === "RU" ? "Участник" : "Joined"
              : lang === "RU" ? "Вступить" : "Join"}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Users size={14} />
            <span className="font-semibold text-white">{community.memberCount}</span>
            {lang === "RU" ? "участников" : "members"}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <BarChart3 size={14} />
            <span className="font-semibold text-white">{community.marketCount}</span>
            {lang === "RU" ? "рынков" : "markets"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3">
        <div className="flex items-center gap-2 border border-zinc-900 bg-black rounded-full p-1 mb-4">
          {(["MARKETS", "MEMBERS"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                tab === t
                  ? "bg-zinc-950 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t === "MARKETS"
                ? lang === "RU" ? "Рынки" : "Markets"
                : lang === "RU" ? "Участники" : "Members"}
            </button>
          ))}
        </div>

        {/* Markets tab */}
        {tab === "MARKETS" && (
          <div>
            {communityMarkets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {communityMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    bookmarked={false}
                    onClick={() => onMarketClick(market)}
                    onQuickBet={() => {}}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 text-sm">
                {lang === "RU" ? "Пока нет рынков" : "No markets yet"}
              </div>
            )}
          </div>
        )}

        {/* Members tab */}
        {tab === "MEMBERS" && (
          <div>
            {membersLoading ? (
              <div className="text-center py-12 text-zinc-500">
                <Loader2 size={20} className="animate-spin mx-auto" />
              </div>
            ) : members.length > 0 ? (
              <div className="space-y-2">
                {members.map((m) => (
                  <button
                    key={m.userId}
                    type="button"
                    onClick={() => onUserClick(m.userId)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-900 bg-black hover:bg-zinc-950/60 transition text-left"
                  >
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                        {(m.displayName ?? m.username).slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate">
                        {m.displayName ?? m.username}
                      </div>
                      <div className="text-[11px] text-zinc-500">@{m.username}</div>
                    </div>
                    {m.role !== "member" && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        {m.role}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 text-sm">
                {lang === "RU" ? "Нет участников" : "No members"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Users, BarChart3, Globe, Lock, Plus, Loader2, Search, Check, Calendar, MessageCircle, X, Send, MapPin, ChevronDown } from "lucide-react";
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

type EventData = {
  id: string;
  groupId: string | null;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  creatorName: string;
  creatorAvatarUrl: string | null;
};

type EventGroupData = {
  id: string;
  title: string;
  color: string;
};

type MessageData = {
  id: string;
  userId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  body: string;
  createdAt: string;
};

type CommunityProfilePageProps = {
  communitySlug: string;
  user: User | null;
  lang: "RU" | "EN";
  markets: Market[];
  onBack: () => void;
  onMarketClick: (market: Market) => void;
  onQuickBet?: (market: Market, side: "YES" | "NO") => void;
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
  onQuickBet,
  onLogin,
  onUserClick,
}: CommunityProfilePageProps) {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [tab, setTab] = useState<"MARKETS" | "EVENTS" | "MESSAGES">("MARKETS");
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersDropdownOpen, setMembersDropdownOpen] = useState(false);
  // Events
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventGroups, setEventGroups] = useState<EventGroupData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  // Messages
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [communityMarketIds, setCommunityMarketIds] = useState<string[]>([]);
  // Add market modal state
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [addMarketSearch, setAddMarketSearch] = useState("");
  const [addingMarketId, setAddingMarketId] = useState<string | null>(null);
  // Optimistic member count for instant UI
  const [optimisticMemberCount, setOptimisticMemberCount] = useState<number | null>(null);

  const loadCommunity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch community data and market IDs in parallel
      const data = await trpcClient.community.bySlug.query({ slug: communitySlug });
      setCommunity(data);
      setOptimisticMemberCount(null);

      const [marketData, membershipData] = await Promise.all([
        trpcClient.community.marketIds.query({ communityId: data.id, limit: 50 }),
        user
          ? trpcClient.community.members.query({ communityId: data.id, limit: 1 })
              .then(() => trpcClient.community.userCommunities.query({ userId: user.id }))
          : Promise.resolve([]),
      ]);

      setCommunityMarketIds(marketData.marketIds);

      if (user && Array.isArray(membershipData)) {
        const membership = membershipData.find((c: { id: string }) => c.id === data.id);
        setIsMember(!!membership);
        setMemberRole(null); // Would need a dedicated endpoint for exact role
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
      // Check current user's role
      if (user) {
        const myMembership = data.members.find((m) => m.userId === user.id);
        if (myMembership) {
          setMemberRole(myMembership.role);
        }
      }
    } catch {
      // Silently fail
    } finally {
      setMembersLoading(false);
    }
  }, [community, user]);

  // Load members when dropdown opens or MEMBERS tab isn't used for dropdown
  useEffect(() => {
    if (membersDropdownOpen && members.length === 0) {
      void loadMembers();
    }
  }, [membersDropdownOpen, members.length, loadMembers]);

  const loadEvents = useCallback(async () => {
    if (!community) return;
    setEventsLoading(true);
    try {
      const [groupsData, eventsData] = await Promise.all([
        trpcClient.community.eventGroups.query({ communityId: community.id }),
        trpcClient.community.events.query({
          communityId: community.id,
          groupId: selectedGroupId ?? undefined,
          limit: 30,
        }),
      ]);
      setEventGroups(groupsData.map((g) => ({ id: g.id, title: g.title, color: g.color })));
      setEvents(eventsData.events.map((e) => ({
        id: e.id,
        groupId: e.groupId,
        title: e.title,
        description: e.description,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        location: e.location,
        creatorName: e.creatorName,
        creatorAvatarUrl: e.creatorAvatarUrl,
      })));
    } catch { /* silent */ } finally { setEventsLoading(false); }
  }, [community, selectedGroupId]);

  useEffect(() => {
    if (tab === "EVENTS") void loadEvents();
  }, [tab, loadEvents]);

  const loadMessages = useCallback(async () => {
    if (!community) return;
    setMessagesLoading(true);
    try {
      const data = await trpcClient.community.messages.query({ communityId: community.id, limit: 50 });
      setMessages(data.messages.map((m) => ({
        id: m.id,
        userId: m.userId,
        authorName: m.authorName,
        authorAvatarUrl: m.authorAvatarUrl,
        body: m.body,
        createdAt: m.createdAt,
      })));
    } catch { /* silent */ } finally { setMessagesLoading(false); }
  }, [community]);

  useEffect(() => {
    if (tab === "MESSAGES") void loadMessages();
  }, [tab, loadMessages]);

  const handleSendMessage = async () => {
    if (!community || !user || !messageInput.trim() || sendingMessage) return;
    setSendingMessage(true);
    try {
      const msg = await trpcClient.community.postMessage.mutate({
        communityId: community.id,
        body: messageInput.trim(),
      });
      setMessages((prev) => [{
        id: msg.id,
        userId: msg.userId,
        authorName: msg.authorName,
        authorAvatarUrl: msg.authorAvatarUrl,
        body: msg.body,
        createdAt: msg.createdAt,
      }, ...prev]);
      setMessageInput("");
    } catch { /* silent */ } finally { setSendingMessage(false); }
  };

  const handleJoin = async () => {
    if (!user) {
      onLogin();
      return;
    }
    if (!community) return;
    setJoinLoading(true);

    // Optimistic update
    const wasMember = isMember;
    const prevCount = optimisticMemberCount ?? community.memberCount;
    setIsMember(!wasMember);
    setOptimisticMemberCount(wasMember ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      if (wasMember) {
        await trpcClient.community.leave.mutate({ communityId: community.id });
      } else {
        await trpcClient.community.join.mutate({ communityId: community.id });
      }
    } catch {
      // Revert on error
      setIsMember(wasMember);
      setOptimisticMemberCount(null);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleAddMarket = async (marketId: string) => {
    if (!community || !user) return;
    setAddingMarketId(marketId);
    try {
      await trpcClient.community.addMarket.mutate({
        communityId: community.id,
        marketId,
      });
      setCommunityMarketIds((prev) => [...prev, marketId]);
      setCommunity((prev) =>
        prev ? { ...prev, marketCount: prev.marketCount + 1 } : prev,
      );
    } catch {
      // Silently fail — likely duplicate
    } finally {
      setAddingMarketId(null);
    }
  };

  // Map community market IDs to actual Market objects from the catalog
  const communityMarketIdSet = useMemo(() => new Set(communityMarketIds), [communityMarketIds]);
  const communityMarkets = useMemo(() => {
    const marketMap = new Map(markets.map((m) => [m.id, m]));
    return communityMarketIds
      .map((id) => marketMap.get(id))
      .filter((m): m is Market => m !== undefined);
  }, [markets, communityMarketIds]);

  // Markets available to add (not already in community)
  const addableMarkets = useMemo(() => {
    if (!addMarketSearch.trim()) return [];
    const q = addMarketSearch.toLowerCase().trim();
    return markets
      .filter((m) => !communityMarketIdSet.has(m.id))
      .filter((m) => {
        const title = (lang === "RU" ? m.titleRu : m.titleEn) || m.title;
        return title.toLowerCase().includes(q);
      })
      .slice(0, 8);
  }, [markets, communityMarketIdSet, addMarketSearch, lang]);

  const displayMemberCount = optimisticMemberCount ?? community?.memberCount ?? 0;
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

  const isCreator = user?.id === community.createdBy;

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
            disabled={joinLoading || isCreator}
            className={`shrink-0 h-9 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition inline-flex items-center gap-2 ${
              isMember
                ? "border border-zinc-700 bg-zinc-950/60 text-zinc-200 hover:border-red-500/50 hover:text-red-400"
                : "bg-[rgba(245,68,166,1)] text-white hover:opacity-90"
            } disabled:opacity-50`}
          >
            {joinLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isMember ? (
              <Check size={14} />
            ) : null}
            {isMember
              ? lang === "RU" ? "Участник" : "Joined"
              : lang === "RU" ? "Вступить" : "Join"}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => { setMembersDropdownOpen(true); }}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <Users size={14} />
            <span className="font-semibold text-white">{displayMemberCount}</span>
            {lang === "RU" ? "участников" : "members"}
            <ChevronDown size={12} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <BarChart3 size={14} />
            <span className="font-semibold text-white">{community.marketCount}</span>
            {lang === "RU" ? "рынков" : "markets"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3">
        <div className="flex items-center gap-1 border border-zinc-900 bg-black rounded-full p-1 mb-4">
          {(["MARKETS", "EVENTS", "MESSAGES"] as const).map((t) => {
            const labels: Record<typeof t, { ru: string; en: string; icon: React.ReactNode }> = {
              MARKETS: { ru: "Рынки", en: "Markets", icon: <BarChart3 size={12} /> },
              EVENTS: { ru: "События", en: "Events", icon: <Calendar size={12} /> },
              MESSAGES: { ru: "Чат", en: "Chat", icon: <MessageCircle size={12} /> },
            };
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                  tab === t
                    ? "bg-zinc-950 text-white border border-zinc-800"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {labels[t].icon}
                {lang === "RU" ? labels[t].ru : labels[t].en}
              </button>
            );
          })}
        </div>

        {/* Markets tab */}
        {tab === "MARKETS" && (
          <div>
            {/* Add Market button (for members) */}
            {isMember && (
              <div className="mb-3">
                {showAddMarket ? (
                  <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-3">
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={addMarketSearch}
                        onChange={(e) => setAddMarketSearch(e.target.value)}
                        placeholder={lang === "RU" ? "Найти рынок для добавления..." : "Search markets to add..."}
                        autoFocus
                        className="w-full h-10 rounded-full bg-zinc-950 border border-zinc-900 px-4 pl-10 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      />
                      <Search size={16} className="absolute left-3.5 top-3 text-zinc-600" />
                    </div>
                    {addableMarkets.length > 0 && (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {addableMarkets.map((m) => {
                          const title = (lang === "RU" ? m.titleRu : m.titleEn) || m.title;
                          const isAdding = addingMarketId === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              disabled={isAdding}
                              onClick={() => void handleAddMarket(m.id)}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/70 transition text-left disabled:opacity-50"
                            >
                              <div className="h-8 w-8 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                                {m.imageUrl && !m.imageUrl.startsWith("data:") ? (
                                  <img src={m.imageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-zinc-600 text-[10px] font-bold">
                                    {title.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-zinc-200 truncate flex-1">{title}</span>
                              {isAdding ? (
                                <Loader2 size={14} className="animate-spin text-zinc-500 shrink-0" />
                              ) : (
                                <Plus size={14} className="text-zinc-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {addMarketSearch.trim() && addableMarkets.length === 0 && (
                      <div className="text-center py-3 text-xs text-zinc-500">
                        {lang === "RU" ? "Ничего не найдено" : "No results"}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMarket(false);
                        setAddMarketSearch("");
                      }}
                      className="mt-2 w-full h-8 rounded-full text-xs text-zinc-500 hover:text-white transition"
                    >
                      {lang === "RU" ? "Закрыть" : "Cancel"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddMarket(true)}
                    className="w-full h-10 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 hover:bg-zinc-950/60 transition flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white"
                  >
                    <Plus size={14} />
                    {lang === "RU" ? "Добавить рынок" : "Add Market"}
                  </button>
                )}
              </div>
            )}

            {communityMarkets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {communityMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    bookmarked={false}
                    onClick={() => onMarketClick(market)}
                    onQuickBet={onQuickBet ? (side) => onQuickBet(market, side) : () => {}}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 text-sm">
                {isMember
                  ? lang === "RU" ? "Добавьте первый рынок!" : "Add the first market!"
                  : lang === "RU" ? "Пока нет рынков" : "No markets yet"}
              </div>
            )}
          </div>
        )}

        {/* Events tab */}
        {tab === "EVENTS" && (
          <div>
            {/* Event group filter chips */}
            {eventGroups.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(null)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition border ${
                    selectedGroupId === null
                      ? "border-zinc-600 bg-zinc-900 text-white"
                      : "border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {lang === "RU" ? "Все" : "All"}
                </button>
                {eventGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition border ${
                      selectedGroupId === g.id
                        ? "text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    style={{
                      borderColor: selectedGroupId === g.id ? g.color : undefined,
                      backgroundColor: selectedGroupId === g.id ? `${g.color}20` : undefined,
                    }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: g.color }} />
                    {g.title}
                  </button>
                ))}
              </div>
            )}

            {eventsLoading ? (
              <div className="text-center py-12 text-zinc-500">
                <Loader2 size={20} className="animate-spin mx-auto" />
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-3">
                {events.map((ev) => {
                  const group = eventGroups.find((g) => g.id === ev.groupId);
                  const date = new Date(ev.startsAt);
                  const isPast = date.getTime() < Date.now();
                  return (
                    <div key={ev.id} className={`border border-zinc-800/60 bg-zinc-950/40 rounded-2xl p-4 ${isPast ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {group && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${group.color}30`, color: group.color }}>
                                {group.title}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-white">{ev.title}</div>
                          {ev.description && <div className="text-xs text-zinc-400 mt-1 line-clamp-2">{ev.description}</div>}
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {date.toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {ev.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                <span className="truncate max-w-[120px]">{ev.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-center bg-zinc-900 rounded-xl px-3 py-2 border border-zinc-800">
                          <div className="text-lg font-bold text-white leading-none">{date.getDate()}</div>
                          <div className="text-[10px] uppercase text-zinc-400">{date.toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US", { month: "short" })}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 text-sm">
                {lang === "RU" ? "Нет событий" : "No events yet"}
              </div>
            )}
          </div>
        )}

        {/* Messages tab */}
        {tab === "MESSAGES" && (
          <div className="flex flex-col" style={{ minHeight: 300 }}>
            {!isMember ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                {lang === "RU" ? "Вступите в сообщество, чтобы читать и писать сообщения" : "Join the community to read and write messages"}
              </div>
            ) : (
              <>
                {/* Message input */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSendMessage(); } }}
                    placeholder={lang === "RU" ? "Написать сообщение..." : "Write a message..."}
                    className="flex-1 h-10 rounded-full bg-zinc-950 border border-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSendMessage()}
                    disabled={!messageInput.trim() || sendingMessage}
                    className="h-10 w-10 rounded-full bg-[rgba(245,68,166,1)] hover:opacity-90 disabled:opacity-40 flex items-center justify-center transition"
                  >
                    {sendingMessage ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
                  </button>
                </div>

                {/* Messages list */}
                {messagesLoading ? (
                  <div className="text-center py-12 text-zinc-500">
                    <Loader2 size={20} className="animate-spin mx-auto" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isOwn = msg.userId === user?.id;
                      return (
                        <div key={msg.id} className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <div className="shrink-0">
                            {msg.authorAvatarUrl ? (
                              <img src={msg.authorAvatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                {msg.authorName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className={`max-w-[75%] ${isOwn ? "text-right" : ""}`}>
                            <div className="text-[11px] text-zinc-500 mb-0.5">{msg.authorName}</div>
                            <div className={`inline-block px-3 py-2 rounded-2xl text-sm ${isOwn ? "bg-[rgba(245,68,166,0.15)] text-zinc-100" : "bg-zinc-900 text-zinc-200"}`}>
                              {msg.body}
                            </div>
                            <div className="text-[10px] text-zinc-600 mt-0.5">
                              {new Date(msg.createdAt).toLocaleTimeString(lang === "RU" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    {lang === "RU" ? "Нет сообщений. Начните разговор!" : "No messages yet. Start the conversation!"}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Members Dropdown Overlay ── */}
      {membersDropdownOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setMembersDropdownOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#111111] border border-zinc-800/60 rounded-2xl overflow-hidden max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/40">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} />
                {lang === "RU" ? "Участники и подписчики" : "Members & Subscribers"}
                <span className="text-zinc-500 font-normal">({displayMemberCount})</span>
              </div>
              <button
                type="button"
                onClick={() => setMembersDropdownOpen(false)}
                className="h-8 w-8 rounded-full border border-zinc-800 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {membersLoading ? (
                <div className="text-center py-8 text-zinc-500">
                  <Loader2 size={20} className="animate-spin mx-auto" />
                </div>
              ) : members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((m) => (
                    <button
                      key={m.userId}
                      type="button"
                      onClick={() => { setMembersDropdownOpen(false); onUserClick(m.userId); }}
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
                        <div className="text-sm font-medium text-white truncate">{m.displayName ?? m.username}</div>
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
                <div className="text-center py-8 text-zinc-500 text-sm">
                  {lang === "RU" ? "Нет участников" : "No members"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

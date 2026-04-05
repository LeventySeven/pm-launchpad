'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Users, BarChart3, Globe, Lock, Plus, Loader2, Search, Check, Calendar, MessageCircle, X, Send, MapPin, ChevronDown, Camera, Image as ImageIcon } from "lucide-react";
import { trpcClient } from "@/src/utils/trpcClient";
import type { Market, User } from "@/types";
import MarketCard from "@/components/MarketCard";
import ShareCard from "@/components/ShareCard";

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
  imageUrl: string | null;
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
  const [tab, setTab] = useState<"ACTIVITY" | "MARKETS" | "EVENTS">("ACTIVITY");
  // Quick create
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateTitle, setQuickCreateTitle] = useState("");
  const [quickCreateDate, setQuickCreateDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  });
  const [quickCreateLoading, setQuickCreateLoading] = useState(false);
  const [quickCreateError, setQuickCreateError] = useState<string | null>(null);
  // Activity feed — mixed: join events + market cards
  type FeedItem = { id: string; type: "join" | "market"; userName: string; userAvatar: string | null; marketId: string | null; createdAt: string; market?: Market | null };
  const [activityItems, setActivityItems] = useState<FeedItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  // Share card state
  const [shareCardOpen, setShareCardOpen] = useState(false);
  const [shareCardMarketId, setShareCardMarketId] = useState("");
  const [shareCardTitle, setShareCardTitle] = useState("");
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersDropdownOpen, setMembersDropdownOpen] = useState(false);
  // Events
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventGroups, setEventGroups] = useState<EventGroupData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  // Event creation
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventImageFile, setNewEventImageFile] = useState<File | null>(null);
  const [newEventImagePreview, setNewEventImagePreview] = useState<string | null>(null);
  const [createEventLoading, setCreateEventLoading] = useState(false);
  const [createEventError, setCreateEventError] = useState<string | null>(null);
  const eventImageInputRef = useRef<HTMLInputElement | null>(null);
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
        imageUrl: e.imageUrl,
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

  // Messages loading removed — tab replaced by activity feed

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

  // Quick-create market handler
  const handleQuickCreate = async () => {
    if (!community || !user || quickCreateLoading) return;
    const title = quickCreateTitle.trim();
    if (title.length < 5) { setQuickCreateError(lang === "RU" ? "Минимум 5 символов" : "Minimum 5 characters"); return; }
    setQuickCreateLoading(true);
    setQuickCreateError(null);
    try {
      const result = await trpcClient.market.quickCreate.mutate({
        communityId: community.id,
        title,
        resolvesAt: new Date(quickCreateDate).toISOString(),
        lang,
      });
      setQuickCreateOpen(false);
      setQuickCreateTitle("");
      // Show share card
      setShareCardMarketId(result.id);
      setShareCardTitle(result.title);
      setShareCardOpen(true);
      // Refresh market list
      void loadCommunity();
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("DAILY_LIMIT")) {
        setQuickCreateError(lang === "RU" ? "Достигнут дневной лимит" : "Daily limit reached");
      } else {
        setQuickCreateError(lang === "RU" ? "Не удалось создать" : "Failed to create");
      }
    } finally { setQuickCreateLoading(false); }
  };

  // Event creation handler
  const handleCreateEvent = async () => {
    if (!community || !user || createEventLoading) return;
    const title = newEventTitle.trim();
    if (title.length < 2) {
      setCreateEventError(lang === "RU" ? "Введите название" : "Enter a title");
      return;
    }
    setCreateEventLoading(true);
    setCreateEventError(null);
    try {
      let imageUrl: string | undefined;
      if (newEventImageFile) {
        const fd = new FormData();
        fd.append("file", newEventImageFile);
        const resp = await fetch("/api/market-image/upload", { method: "POST", body: fd });
        const data = (await resp.json()) as { imageUrl?: string; error?: string };
        if (!resp.ok || !data.imageUrl) throw new Error(data.error || "UPLOAD_FAILED");
        imageUrl = data.imageUrl;
      }
      await trpcClient.community.createEvent.mutate({
        communityId: community.id,
        title,
        description: newEventDescription.trim() || undefined,
        imageUrl,
        startsAt: new Date(newEventDate).toISOString(),
        endsAt: newEventEndDate ? new Date(newEventEndDate).toISOString() : undefined,
        location: newEventLocation.trim() || undefined,
      });
      setShowCreateEvent(false);
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventLocation("");
      setNewEventImageFile(null);
      setNewEventImagePreview(null);
      setNewEventEndDate("");
      void loadEvents();
    } catch {
      setCreateEventError(lang === "RU" ? "Не удалось создать событие" : "Failed to create event");
    } finally {
      setCreateEventLoading(false);
    }
  };

  // Activity feed: mix member joins + community market cards, sorted by date
  const loadActivityFeed = useCallback(async () => {
    if (!community) return;
    setActivityLoading(true);
    try {
      const [marketData, membersData] = await Promise.all([
        trpcClient.community.marketIds.query({ communityId: community.id, limit: 50 }),
        trpcClient.community.members.query({ communityId: community.id, limit: 30 }),
      ]);

      const items: FeedItem[] = [];

      // Join events
      for (const m of (membersData.members ?? [])) {
        items.push({
          id: `join-${m.userId}`,
          type: "join",
          userName: m.displayName ?? m.username,
          userAvatar: m.avatarUrl,
          marketId: null,
          createdAt: m.joinedAt,
        });
      }

      // Market cards — match IDs against the `markets` prop passed from parent
      const communityMarketIds = new Set(marketData.marketIds ?? []);
      for (const mkt of markets) {
        if (communityMarketIds.has(mkt.id)) {
          items.push({
            id: `market-${mkt.id}`,
            type: "market",
            userName: mkt.creatorName ?? "",
            userAvatar: mkt.creatorAvatarUrl ?? null,
            marketId: mkt.id,
            createdAt: mkt.createdAt ?? new Date().toISOString(),
            market: mkt,
          });
        }
      }

      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivityItems(items.slice(0, 50));
    } catch { /* silent */ } finally { setActivityLoading(false); }
  }, [community, markets]);

  useEffect(() => {
    if (tab === "ACTIVITY" && activityItems.length === 0) void loadActivityFeed();
  }, [tab, activityItems.length, loadActivityFeed]);


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
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="h-9 w-9 rounded-full border border-zinc-900 bg-black/60 backdrop-blur hover:bg-black/80 flex items-center justify-center text-zinc-300"
          >
            <ArrowLeft size={16} />
          </button>
          {(isCreator || memberRole === "moderator") && (
            <label className="h-9 px-3 rounded-full border border-zinc-900 bg-black/60 backdrop-blur hover:bg-black/80 flex items-center justify-center gap-1.5 text-zinc-300 cursor-pointer text-[10px] font-semibold uppercase tracking-wider">
              <Camera size={14} />
              {lang === "RU" ? "Баннер" : "Banner"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !community) return;
                  const form = new FormData();
                  form.append("file", file);
                  form.append("communityId", community.id);
                  try {
                    const res = await fetch("/api/community-banner/upload", { method: "POST", body: form });
                    const json = await res.json();
                    if (json.bannerUrl) {
                      setCommunity((prev) => prev ? { ...prev, bannerUrl: json.bannerUrl } : prev);
                    }
                  } catch { /* silent */ }
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>

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
          {(["ACTIVITY", "MARKETS", "EVENTS"] as const).map((t) => {
            const labels: Record<typeof t, { ru: string; en: string; icon: React.ReactNode }> = {
              ACTIVITY: { ru: "Лента", en: "Feed", icon: <MessageCircle size={12} /> },
              MARKETS: { ru: "Рынки", en: "Markets", icon: <BarChart3 size={12} /> },
              EVENTS: { ru: "События", en: "Events", icon: <Calendar size={12} /> },
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
            {/* Create event button */}
            {isMember && (
              <button
                type="button"
                onClick={() => { if (!user) { onLogin(); return; } setShowCreateEvent(true); }}
                className="w-full mb-4 h-11 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 hover:bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} />
                {lang === "RU" ? "Создать событие" : "Create event"}
              </button>
            )}

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
                    <div key={ev.id} className={`border border-zinc-800/60 bg-zinc-950/40 rounded-2xl overflow-hidden ${isPast ? "opacity-60" : ""}`}>
                      {ev.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ev.imageUrl} alt={ev.title} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-4">
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

        {/* Activity feed tab */}
        {tab === "ACTIVITY" && (
          <div>
            {activityLoading ? (
              <div className="text-center py-12 text-zinc-500">
                <Loader2 size={20} className="animate-spin mx-auto" />
              </div>
            ) : activityItems.length > 0 ? (
              <div className="space-y-3">
                {activityItems.map((item) => {
                  // Market card in feed
                  if (item.type === "market" && item.market) {
                    return (
                      <MarketCard
                        key={item.id}
                        market={item.market}
                        bookmarked={false}
                        onClick={() => onMarketClick(item.market!)}
                        onQuickBet={onQuickBet ? (side) => onQuickBet(item.market!, side) : () => {}}
                        lang={lang}
                      />
                    );
                  }
                  // Join event row
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => item.userName && onUserClick(item.id.replace("join-", ""))}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-950/20 hover:bg-zinc-950/40 transition text-left"
                    >
                      {item.userAvatar ? (
                        <img src={item.userAvatar} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">
                          {item.userName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-zinc-300">
                          <span className="font-medium text-white">{item.userName}</span>
                          {" "}
                          {lang === "RU" ? "присоединился" : "joined"}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-600 shrink-0">
                        {new Date(item.createdAt).toLocaleDateString(lang === "RU" ? "ru-RU" : "en-US", { month: "short", day: "numeric" })}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-zinc-500 text-sm mb-3">
                  {lang === "RU" ? "Пока нет активности" : "No activity yet"}
                </div>
                {isMember && (
                  <button
                    type="button"
                    onClick={() => setQuickCreateOpen(true)}
                    className="px-4 py-2 rounded-full bg-[rgba(245,68,166,1)] text-white text-xs font-semibold"
                  >
                    {lang === "RU" ? "Создать первый прогноз!" : "Create the first prediction!"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FAB: Quick Create (visible on all tabs for members) ── */}
      {isMember && !quickCreateOpen && (
        <button
          type="button"
          onClick={() => { if (!user) { onLogin(); return; } setQuickCreateOpen(true); }}
          className="fixed bottom-24 right-5 z-50 h-14 w-14 rounded-full bg-[rgba(245,68,166,1)] shadow-lg shadow-pink-500/20 hover:opacity-90 flex items-center justify-center transition"
        >
          <Plus size={24} className="text-white" />
        </button>
      )}

      {/* ── Quick Create Overlay ── */}
      {quickCreateOpen && (
        <div className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={() => setQuickCreateOpen(false)}>
          <div className="w-full max-w-md bg-[#111111] border-t border-zinc-800/60 rounded-t-2xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-0 pb-3">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
            <div className="text-sm font-bold text-white mb-4">
              {lang === "RU" ? "Новый прогноз" : "New Prediction"}
            </div>
            <input
              type="text"
              value={quickCreateTitle}
              onChange={(e) => setQuickCreateTitle(e.target.value)}
              placeholder={lang === "RU" ? "Что произойдёт?" : "What will happen?"}
              autoFocus
              maxLength={200}
              className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 mb-3"
            />
            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs text-zinc-500 shrink-0">{lang === "RU" ? "Дата:" : "Resolves:"}</label>
              <input
                type="datetime-local"
                value={quickCreateDate}
                onChange={(e) => setQuickCreateDate(e.target.value)}
                className="flex-1 h-10 rounded-lg bg-zinc-950 border border-zinc-900 px-3 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              />
            </div>
            {quickCreateError && (
              <div className="text-xs text-red-400 mb-3">{quickCreateError}</div>
            )}
            <button
              type="button"
              onClick={() => void handleQuickCreate()}
              disabled={quickCreateLoading || quickCreateTitle.trim().length < 5}
              className="w-full h-12 rounded-full bg-[rgba(245,68,166,1)] hover:opacity-90 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              {quickCreateLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {lang === "RU" ? "Создать" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* ── Create Event Modal ── */}
      {showCreateEvent && (
        <div className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowCreateEvent(false)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#111111] border-t border-zinc-800/60 rounded-t-2xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-0 pb-3">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white">
                {lang === "RU" ? "Новое событие" : "New Event"}
              </div>
              <button
                type="button"
                onClick={() => setShowCreateEvent(false)}
                className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/60 flex items-center justify-center text-zinc-400"
              >
                <X size={14} />
              </button>
            </div>

            {/* Image upload */}
            <input
              ref={eventImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setNewEventImageFile(f);
                if (f) {
                  const url = URL.createObjectURL(f);
                  setNewEventImagePreview(url);
                } else {
                  setNewEventImagePreview(null);
                }
              }}
            />
            {newEventImagePreview ? (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={newEventImagePreview} alt="" className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => { setNewEventImageFile(null); setNewEventImagePreview(null); }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => eventImageInputRef.current?.click()}
                className="w-full mb-3 h-20 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 hover:bg-zinc-950/60 text-zinc-500 hover:text-zinc-300 flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <ImageIcon size={20} />
                <span className="text-[11px]">{lang === "RU" ? "Добавить обложку" : "Add cover image"}</span>
              </button>
            )}

            {/* Title */}
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder={lang === "RU" ? "Название события" : "Event title"}
              autoFocus
              maxLength={200}
              className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 mb-3"
            />

            {/* Description */}
            <textarea
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              placeholder={lang === "RU" ? "Описание (необязательно)" : "Description (optional)"}
              maxLength={2000}
              rows={2}
              className="w-full rounded-xl bg-zinc-950 border border-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 mb-3 resize-none"
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  {lang === "RU" ? "Начало" : "Start"}
                </label>
                <input
                  type="datetime-local"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full h-10 rounded-lg bg-zinc-950 border border-zinc-900 px-3 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                  {lang === "RU" ? "Конец" : "End"}
                </label>
                <input
                  type="datetime-local"
                  value={newEventEndDate}
                  onChange={(e) => setNewEventEndDate(e.target.value)}
                  className="w-full h-10 rounded-lg bg-zinc-950 border border-zinc-900 px-3 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                placeholder={lang === "RU" ? "Место (необязательно)" : "Location (optional)"}
                maxLength={500}
                className="flex-1 h-10 rounded-lg bg-zinc-950 border border-zinc-900 px-3 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              />
            </div>

            {createEventError && (
              <div className="text-xs text-red-400 mb-3">{createEventError}</div>
            )}

            <button
              type="button"
              onClick={() => void handleCreateEvent()}
              disabled={createEventLoading || newEventTitle.trim().length < 2}
              className="w-full h-12 rounded-full bg-[rgba(245,68,166,1)] hover:opacity-90 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              {createEventLoading ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
              {lang === "RU" ? "Создать событие" : "Create Event"}
            </button>
          </div>
        </div>
      )}

      {/* ── Share Card ── */}
      <ShareCard
        isOpen={shareCardOpen}
        onClose={() => setShareCardOpen(false)}
        lang={lang}
        marketTitle={shareCardTitle}
        marketId={shareCardMarketId}
        action="created"
      />

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

import "server-only";
import { TRPCError } from "@trpc/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";
import type { CreateCommunityInput, UpdateCommunityInput, CommunityListInput } from "../../lib/validations/communities";

type DbClient = SupabaseClient<Database, "public">;

// Helper types
type CreatorInfo = { name: string; avatar: string | null };

export type CommunityPublic = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  privacy: string;
  category: string | null;
  memberCount: number;
  marketCount: number;
  totalVolumeMinor: number;
  importanceScore: number;
  createdAt: string;
  createdBy: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
};

type MemberInfo = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  joinedAt: string;
};

function mapCommunity(r: Record<string, unknown>): CommunityPublic {
  return {
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    description: r.description ? String(r.description) : null,
    bannerUrl: r.banner_url ? String(r.banner_url) : null,
    privacy: String(r.privacy ?? "public"),
    category: r.category ? String(r.category) : null,
    memberCount: Number(r.member_count ?? 0),
    marketCount: Number(r.market_count ?? 0),
    totalVolumeMinor: Number(r.total_volume_minor ?? 0),
    importanceScore: Number(r.importance_score ?? 0),
    createdAt: String(r.created_at),
    createdBy: String(r.created_by),
    creatorName: String(r.creator_name ?? ""),
    creatorAvatarUrl: r.creator_avatar_url ? String(r.creator_avatar_url) : null,
  };
}

export async function createCommunity(
  userId: string,
  input: CreateCommunityInput,
  db: DbClient,
): Promise<CommunityPublic> {
  // Check slug uniqueness
  const { data: existing } = await (db as any)
    .from("communities")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  if (existing) {
    throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
  }

  const { data: community, error } = await (db as any)
    .from("communities")
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      banner_url: input.bannerUrl ?? null,
      privacy: input.privacy ?? "public",
      category: input.category ?? null,
      created_by: userId,
    })
    .select("*")
    .single();

  if (error || !community) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message ?? "Failed to create community" });
  }

  // Auto-join creator with 'creator' role
  await db.from("community_members").insert({
    community_id: community.id,
    user_id: userId,
    role: "creator",
  });

  // Fetch via the public view for consistent shape
  return getCommunityBySlug(community.slug, db);
}

export async function updateCommunity(
  userId: string,
  input: UpdateCommunityInput,
  db: DbClient,
): Promise<CommunityPublic> {
  // Assert creator or moderator
  await assertCommunityRole(userId, input.communityId, "moderator", db);

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.bannerUrl !== undefined) updates.banner_url = input.bannerUrl;
  if (input.privacy !== undefined) updates.privacy = input.privacy;
  if (input.category !== undefined) updates.category = input.category;

  const { error } = await (db as any)
    .from("communities")
    .update(updates)
    .eq("id", input.communityId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const { data: updated } = await (db as any)
    .from("communities")
    .select("slug")
    .eq("id", input.communityId)
    .single();

  return getCommunityBySlug(updated!.slug, db);
}

export async function getCommunityBySlug(
  slug: string,
  db: DbClient,
): Promise<CommunityPublic> {
  const { data, error } = await (db as any)
    .from("communities")
    .select(`
      id, slug, name, description, banner_url, privacy, category,
      member_count, market_count, total_volume_minor, importance_score,
      created_at, created_by
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Community not found" });
  }

  // Fetch creator info in parallel with nothing else — but avoids blocking
  // the main thread by keeping it a single await.
  const { data: creator } = await (db as any)
    .from("users")
    .select("display_name, username, avatar_url, telegram_photo_url")
    .eq("id", data.created_by)
    .maybeSingle();

  return mapCommunity({
    ...data,
    creator_name: creator?.display_name ?? creator?.username ?? "",
    creator_avatar_url: creator?.avatar_url ?? creator?.telegram_photo_url ?? null,
  });
}

export async function listCommunities(
  input: CommunityListInput,
  db: DbClient,
): Promise<{ communities: CommunityPublic[]; nextCursor: string | null }> {
  let query = db
    .from("communities")
    .select(`
      id, slug, name, description, banner_url, privacy, category,
      member_count, market_count, total_volume_minor, importance_score,
      created_at, created_by
    `)
    .eq("privacy", "public")
    .order("importance_score", { ascending: false })
    .limit(input.limit + 1);

  if (input.category) {
    query = query.eq("category", input.category);
  }

  if (input.search) {
    query = query.textSearch("search_tsv", input.search, { type: "plain" });
  }

  if (input.cursor) {
    query = query.lt("id", input.cursor);
  }

  const { data, error } = await query;
  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const rows = data ?? [];
  const hasMore = rows.length > input.limit;
  const pageRows = hasMore ? rows.slice(0, input.limit) : rows;
  const nextCursor = hasMore ? String(pageRows[pageRows.length - 1]?.id ?? "") : null;

  // Batch fetch creator info
  const creatorIds = [...new Set(pageRows.map((r) => r.created_by))];
  const { data: creators } = creatorIds.length > 0
    ? await (db as any)
        .from("users")
        .select("id, display_name, username, avatar_url, telegram_photo_url")
        .in("id", creatorIds)
    : { data: [] };

  const creatorsMap = new Map<string, CreatorInfo>(
    (creators ?? []).map((u) => [
      String(u.id),
      {
        name: u.display_name ?? u.username ?? "",
        avatar: u.avatar_url ?? u.telegram_photo_url ?? null,
      },
    ]),
  );

  return {
    communities: pageRows.map((r) => {
      const creator = creatorsMap.get(r.created_by);
      return mapCommunity({
        ...r,
        creator_name: creator?.name ?? "",
        creator_avatar_url: creator?.avatar ?? null,
      });
    }),
    nextCursor,
  };
}

export async function listCommunityCategories(
  db: DbClient,
): Promise<Array<{ category: string; count: number }>> {
  const { data, error } = await (db as any)
    .from("communities")
    .select("category")
    .eq("privacy", "public")
    .not("category", "is", null);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const cat = String(row.category);
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function joinCommunity(
  userId: string,
  communityId: string,
  db: DbClient,
) {
  // Verify community exists
  const { data: community } = await (db as any)
    .from("communities")
    .select("id")
    .eq("id", communityId)
    .maybeSingle();

  if (!community) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Community not found" });
  }

  const { error } = await db.from("community_members").insert({
    community_id: communityId,
    user_id: userId,
    role: "member",
  });

  if (error) {
    if (String(error.message).toLowerCase().includes("duplicate")) {
      return { communityId, userId, role: "member" as const };
    }
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  return { communityId, userId, role: "member" as const };
}

export async function leaveCommunity(
  userId: string,
  communityId: string,
  db: DbClient,
) {
  // Prevent creator from leaving
  const { data: membership } = await (db as any)
    .from("community_members")
    .select("role")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Not a member" });
  }

  if (membership.role === "creator") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Creator cannot leave their community" });
  }

  const { error } = await (db as any)
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", userId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  return { communityId, userId };
}

export async function getCommunityMembers(
  communityId: string,
  cursor: string | undefined,
  limit: number,
  db: DbClient,
): Promise<{ members: MemberInfo[]; nextCursor: string | null }> {
  let query = db
    .from("community_members")
    .select("user_id, role, joined_at")
    .eq("community_id", communityId)
    .order("joined_at", { ascending: true })
    .limit(limit + 1);

  if (cursor) {
    query = query.gt("joined_at", cursor);
  }

  const { data, error } = await query;
  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.joined_at ?? null : null;

  if (pageRows.length === 0) {
    return { members: [], nextCursor: null };
  }

  const userIds = pageRows.map((r) => r.user_id);
  const { data: users } = await (db as any)
    .from("users")
    .select("id, username, display_name, avatar_url, telegram_photo_url")
    .in("id", userIds);

  type UserRow = { id: string; username: string; display_name: string | null; avatar_url: string | null; telegram_photo_url: string | null };
  const usersMap = new Map<string, UserRow>(
    (users ?? []).map((u: UserRow) => [String(u.id), u]),
  );

  return {
    members: pageRows.map((r) => {
      const u = usersMap.get(r.user_id);
      return {
        userId: r.user_id,
        username: u?.username ?? "",
        displayName: u?.display_name ?? null,
        avatarUrl: u?.avatar_url ?? u?.telegram_photo_url ?? null,
        role: r.role,
        joinedAt: r.joined_at,
      };
    }),
    nextCursor,
  };
}

export async function getUserCommunities(
  userId: string,
  db: DbClient,
): Promise<CommunityPublic[]> {
  const { data: memberships, error } = await (db as any)
    .from("community_members")
    .select("community_id")
    .eq("user_id", userId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  if (!memberships || memberships.length === 0) return [];

  const communityIds = memberships.map((m) => m.community_id);
  const { data: communities } = await (db as any)
    .from("communities")
    .select(`
      id, slug, name, description, banner_url, privacy, category,
      member_count, market_count, total_volume_minor, importance_score,
      created_at, created_by
    `)
    .in("id", communityIds);

  if (!communities) return [];

  const creatorIds = [...new Set(communities.map((c) => c.created_by))];
  const { data: creators } = creatorIds.length > 0
    ? await (db as any)
        .from("users")
        .select("id, display_name, username, avatar_url, telegram_photo_url")
        .in("id", creatorIds)
    : { data: [] };

  const creatorsMap2 = new Map<string, CreatorInfo>(
    (creators ?? []).map((u) => [
      String(u.id),
      { name: u.display_name ?? u.username ?? "", avatar: u.avatar_url ?? u.telegram_photo_url ?? null },
    ]),
  );

  return communities.map((r) => {
    const creator = creatorsMap2.get(r.created_by);
    return mapCommunity({
      ...r,
      creator_name: creator?.name ?? "",
      creator_avatar_url: creator?.avatar ?? null,
    });
  });
}

export async function addMarketToCommunity(
  userId: string,
  communityId: string,
  marketId: string,
  db: DbClient,
) {
  // Assert member
  await assertCommunityRole(userId, communityId, "member", db);

  // Verify market exists
  const { data: market } = await (db as any)
    .from("markets")
    .select("id")
    .eq("id", marketId)
    .maybeSingle();

  if (!market) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Market not found" });
  }

  const { error } = await db.from("community_markets").insert({
    community_id: communityId,
    market_id: marketId,
    added_by: userId,
  });

  if (error) {
    if (String(error.message).toLowerCase().includes("duplicate")) {
      return { communityId, marketId };
    }
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  return { communityId, marketId };
}

export async function removeMarketFromCommunity(
  userId: string,
  communityId: string,
  marketId: string,
  db: DbClient,
) {
  // Check if user is creator/mod or the one who added it
  const { data: link } = await (db as any)
    .from("community_markets")
    .select("added_by")
    .eq("community_id", communityId)
    .eq("market_id", marketId)
    .maybeSingle();

  if (!link) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Market not in community" });
  }

  if (link.added_by !== userId) {
    // Must be creator or moderator to remove others' additions
    await assertCommunityRole(userId, communityId, "moderator", db);
  }

  const { error } = await (db as any)
    .from("community_markets")
    .delete()
    .eq("community_id", communityId)
    .eq("market_id", marketId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  return { communityId, marketId };
}

export async function getCommunityMarketIds(
  communityId: string,
  cursor: string | undefined,
  limit: number,
  db: DbClient,
): Promise<{ marketIds: string[]; nextCursor: string | null }> {
  let query = db
    .from("community_markets")
    .select("market_id, added_at")
    .eq("community_id", communityId)
    .order("added_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("added_at", cursor);
  }

  const { data, error } = await query;
  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.added_at ?? null : null;

  return {
    marketIds: pageRows.map((r) => r.market_id),
    nextCursor,
  };
}

/** Assert that a user has at least the given role in a community. */
async function assertCommunityRole(
  userId: string,
  communityId: string,
  minRole: "member" | "moderator" | "creator",
  db: DbClient,
) {
  const { data: membership } = await (db as any)
    .from("community_members")
    .select("role")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this community" });
  }

  const roleHierarchy: Record<string, number> = { member: 0, moderator: 1, creator: 2 };
  const userLevel = roleHierarchy[membership.role] ?? 0;
  const requiredLevel = roleHierarchy[minRole] ?? 0;

  if (userLevel < requiredLevel) {
    throw new TRPCError({ code: "FORBIDDEN", message: `Requires ${minRole} role or higher` });
  }
}

// ---------------------------------------------------------------------------
// Event Groups
// ---------------------------------------------------------------------------

export type EventGroupPublic = {
  id: string;
  communityId: string;
  title: string;
  description: string | null;
  color: string;
  sortOrder: number;
  createdBy: string;
  createdAt: string;
};

export async function listEventGroups(
  communityId: string,
  db: DbClient,
): Promise<EventGroupPublic[]> {
  const { data, error } = await (db as any)
    .from("community_event_groups")
    .select("id, community_id, title, description, color, sort_order, created_by, created_at")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

  return (data ?? []).map((r) => ({
    id: String(r.id),
    communityId: String(r.community_id),
    title: String(r.title),
    description: r.description ? String(r.description) : null,
    color: String(r.color ?? "#6366f1"),
    sortOrder: Number(r.sort_order),
    createdBy: String(r.created_by),
    createdAt: String(r.created_at),
  }));
}

export async function createEventGroup(
  userId: string,
  communityId: string,
  input: { title: string; description?: string; color?: string },
  db: DbClient,
): Promise<EventGroupPublic> {
  await assertCommunityRole(userId, communityId, "moderator", db);

  const { data, error } = await (db as any)
    .from("community_event_groups")
    .insert({
      community_id: communityId,
      title: input.title,
      description: input.description ?? null,
      color: input.color ?? "#6366f1",
      created_by: userId,
    })
    .select("id, community_id, title, description, color, sort_order, created_by, created_at")
    .single();

  if (error || !data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message ?? "Failed to create event group" });

  return {
    id: String(data.id),
    communityId: String(data.community_id),
    title: String(data.title),
    description: data.description ? String(data.description) : null,
    color: String(data.color ?? "#6366f1"),
    sortOrder: Number(data.sort_order),
    createdBy: String(data.created_by),
    createdAt: String(data.created_at),
  };
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export type EventPublic = {
  id: string;
  communityId: string;
  groupId: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  createdBy: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  createdAt: string;
};

export async function listEvents(
  communityId: string,
  input: { groupId?: string; upcoming?: boolean; cursor?: string; limit: number },
  db: DbClient,
): Promise<{ events: EventPublic[]; nextCursor: string | null }> {
  let query = (db as any)
    .from("community_events")
    .select("id, community_id, group_id, title, description, image_url, starts_at, ends_at, location, created_by, created_at")
    .eq("community_id", communityId)
    .order("starts_at", { ascending: true })
    .limit(input.limit + 1);

  if (input.groupId) query = query.eq("group_id", input.groupId);
  if (input.upcoming) query = query.gte("starts_at", new Date().toISOString());
  if (input.cursor) query = query.gt("starts_at", input.cursor);

  const { data, error } = await query;
  if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

  const rows = data ?? [];
  const hasMore = rows.length > input.limit;
  const pageRows = hasMore ? rows.slice(0, input.limit) : rows;
  const nextCursor = hasMore ? String(pageRows[pageRows.length - 1]?.starts_at ?? "") : null;

  // Batch fetch creators
  const creatorIds = [...new Set(pageRows.map((r: any) => String(r.created_by)))] as string[];
  const { data: creators } = creatorIds.length > 0
    ? await db.from("users").select("id, display_name, username, avatar_url, telegram_photo_url").in("id", creatorIds)
    : { data: [] };

  const creatorsMap = new Map<string, CreatorInfo>(
    (creators ?? []).map((u) => [String(u.id), { name: u.display_name ?? u.username ?? "", avatar: u.avatar_url ?? u.telegram_photo_url ?? null }]),
  );

  return {
    events: pageRows.map((r: any) => {
      const creator = creatorsMap.get(r.created_by);
      return {
        id: String(r.id),
        communityId: String(r.community_id),
        groupId: r.group_id ? String(r.group_id) : null,
        title: String(r.title),
        description: r.description ? String(r.description) : null,
        imageUrl: r.image_url ? String(r.image_url) : null,
        startsAt: String(r.starts_at),
        endsAt: r.ends_at ? String(r.ends_at) : null,
        location: r.location ? String(r.location) : null,
        createdBy: String(r.created_by),
        creatorName: creator?.name ?? "",
        creatorAvatarUrl: creator?.avatar ?? null,
        createdAt: String(r.created_at),
      };
    }),
    nextCursor,
  };
}

export async function createEvent(
  userId: string,
  communityId: string,
  input: { groupId?: string; title: string; description?: string; imageUrl?: string; startsAt: string; endsAt?: string; location?: string },
  db: DbClient,
): Promise<EventPublic> {
  // Any member can create events
  await assertCommunityRole(userId, communityId, "member", db);

  const { data, error } = await (db as any)
    .from("community_events")
    .insert({
      community_id: communityId,
      group_id: input.groupId ?? null,
      title: input.title,
      description: input.description ?? null,
      image_url: input.imageUrl ?? null,
      starts_at: input.startsAt,
      ends_at: input.endsAt ?? null,
      location: input.location ?? null,
      created_by: userId,
    })
    .select("id, community_id, group_id, title, description, image_url, starts_at, ends_at, location, created_by, created_at")
    .single();

  if (error || !data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message ?? "Failed to create event" });

  const { data: creator } = await db.from("users").select("display_name, username, avatar_url, telegram_photo_url").eq("id", userId).maybeSingle();

  return {
    id: String(data.id),
    communityId: String(data.community_id),
    groupId: data.group_id ? String(data.group_id) : null,
    title: String(data.title),
    description: data.description ? String(data.description) : null,
    imageUrl: data.image_url ? String(data.image_url) : null,
    startsAt: String(data.starts_at),
    endsAt: data.ends_at ? String(data.ends_at) : null,
    location: data.location ? String(data.location) : null,
    createdBy: String(data.created_by),
    creatorName: creator?.display_name ?? creator?.username ?? "",
    creatorAvatarUrl: creator?.avatar_url ?? creator?.telegram_photo_url ?? null,
    createdAt: String(data.created_at),
  };
}

// ---------------------------------------------------------------------------
// Community Messages
// ---------------------------------------------------------------------------

export type MessagePublic = {
  id: string;
  communityId: string;
  userId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  body: string;
  replyTo: string | null;
  createdAt: string;
};

export async function listMessages(
  communityId: string,
  input: { cursor?: string; limit: number },
  db: DbClient,
): Promise<{ messages: MessagePublic[]; nextCursor: string | null }> {
  let query = (db as any)
    .from("community_messages")
    .select("id, community_id, user_id, body, reply_to, created_at")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(input.limit + 1);

  if (input.cursor) query = query.lt("created_at", input.cursor);

  const { data, error } = await query;
  if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

  const rows = data ?? [];
  const hasMore = rows.length > input.limit;
  const pageRows = hasMore ? rows.slice(0, input.limit) : rows;
  const nextCursor = hasMore ? String(pageRows[pageRows.length - 1]?.created_at ?? "") : null;

  // Batch fetch authors
  const authorIds = [...new Set(pageRows.map((r: any) => String(r.user_id)))] as string[];
  const { data: authors } = authorIds.length > 0
    ? await db.from("users").select("id, display_name, username, avatar_url, telegram_photo_url").in("id", authorIds)
    : { data: [] };

  const authorsMap = new Map<string, CreatorInfo>(
    (authors ?? []).map((u) => [String(u.id), { name: u.display_name ?? u.username ?? "", avatar: u.avatar_url ?? u.telegram_photo_url ?? null }]),
  );

  return {
    messages: pageRows.map((r: any) => {
      const author = authorsMap.get(r.user_id);
      return {
        id: String(r.id),
        communityId: String(r.community_id),
        userId: String(r.user_id),
        authorName: author?.name ?? "",
        authorAvatarUrl: author?.avatar ?? null,
        body: String(r.body),
        replyTo: r.reply_to ? String(r.reply_to) : null,
        createdAt: String(r.created_at),
      };
    }),
    nextCursor,
  };
}

export async function postMessage(
  userId: string,
  communityId: string,
  input: { body: string; replyTo?: string },
  db: DbClient,
): Promise<MessagePublic> {
  await assertCommunityRole(userId, communityId, "member", db);

  const { data, error } = await (db as any)
    .from("community_messages")
    .insert({
      community_id: communityId,
      user_id: userId,
      body: input.body,
      reply_to: input.replyTo ?? null,
    })
    .select("id, community_id, user_id, body, reply_to, created_at")
    .single();

  if (error || !data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message ?? "Failed to post message" });

  const { data: author } = await db.from("users").select("display_name, username, avatar_url, telegram_photo_url").eq("id", userId).maybeSingle();

  return {
    id: String(data.id),
    communityId: String(data.community_id),
    userId: String(data.user_id),
    authorName: author?.display_name ?? author?.username ?? "",
    authorAvatarUrl: author?.avatar_url ?? author?.telegram_photo_url ?? null,
    body: String(data.body),
    replyTo: data.reply_to ? String(data.reply_to) : null,
    createdAt: String(data.created_at),
  };
}

export async function deleteMessage(
  userId: string,
  messageId: string,
  db: DbClient,
): Promise<void> {
  const { error } = await (db as any)
    .from("community_messages")
    .delete()
    .eq("id", messageId)
    .eq("user_id", userId);

  if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
}

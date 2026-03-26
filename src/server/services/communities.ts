import "server-only";
import { TRPCError } from "@trpc/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";
import type { CreateCommunityInput, UpdateCommunityInput, CommunityListInput } from "../../lib/validations/communities";

type DbClient = SupabaseClient<Database, "public">;

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
  const { data: existing } = await db
    .from("communities")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  if (existing) {
    throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
  }

  const { data: community, error } = await db
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

  const { error } = await db
    .from("communities")
    .update(updates)
    .eq("id", input.communityId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const { data: updated } = await db
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
  const { data, error } = await db
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

  // Fetch creator info
  const { data: creator } = await db
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
    ? await db
        .from("users")
        .select("id, display_name, username, avatar_url, telegram_photo_url")
        .in("id", creatorIds)
    : { data: [] };

  const creatorsMap = new Map(
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
  const { data, error } = await db
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
  const { data: community } = await db
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
  const { data: membership } = await db
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

  const { error } = await db
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
  const { data: users } = await db
    .from("users")
    .select("id, username, display_name, avatar_url, telegram_photo_url")
    .in("id", userIds);

  const usersMap = new Map(
    (users ?? []).map((u) => [String(u.id), u]),
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
  const { data: memberships, error } = await db
    .from("community_members")
    .select("community_id")
    .eq("user_id", userId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  if (!memberships || memberships.length === 0) return [];

  const communityIds = memberships.map((m) => m.community_id);
  const { data: communities } = await db
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
    ? await db
        .from("users")
        .select("id, display_name, username, avatar_url, telegram_photo_url")
        .in("id", creatorIds)
    : { data: [] };

  const creatorsMap = new Map(
    (creators ?? []).map((u) => [
      String(u.id),
      { name: u.display_name ?? u.username ?? "", avatar: u.avatar_url ?? u.telegram_photo_url ?? null },
    ]),
  );

  return communities.map((r) => {
    const creator = creatorsMap.get(r.created_by);
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
  const { data: market } = await db
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
  const { data: link } = await db
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

  const { error } = await db
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
  const { data: membership } = await db
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

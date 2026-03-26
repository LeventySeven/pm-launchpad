import "server-only";
import { TRPCError } from "@trpc/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";

type DbClient = SupabaseClient<Database, "public">;

type FollowUserInfo = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  followerCount: number;
  followingCount: number;
};

type FollowStatus = {
  isFollowing: boolean;
  isFollowedBy: boolean;
};

export async function followUser(
  userId: string,
  targetUserId: string,
  db: DbClient,
) {
  if (userId === targetUserId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot follow yourself" });
  }

  // Verify target exists
  const { data: target } = await db
    .from("users")
    .select("id")
    .eq("id", targetUserId)
    .maybeSingle();

  if (!target) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const { error } = await db
    .from("user_follows")
    .insert({ follower_id: userId, following_id: targetUserId });

  if (error) {
    // Duplicate follow is a no-op
    if (String(error.message).toLowerCase().includes("duplicate")) {
      return { followerId: userId, followingId: targetUserId };
    }
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  return { followerId: userId, followingId: targetUserId };
}

export async function unfollowUser(
  userId: string,
  targetUserId: string,
  db: DbClient,
) {
  const { error } = await db
    .from("user_follows")
    .delete()
    .eq("follower_id", userId)
    .eq("following_id", targetUserId);

  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  return { followerId: userId, followingId: targetUserId };
}

export async function getFollowStatus(
  userId: string,
  targetUserId: string,
  db: DbClient,
): Promise<FollowStatus> {
  const [followingRes, followedByRes] = await Promise.all([
    db
      .from("user_follows")
      .select("follower_id")
      .eq("follower_id", userId)
      .eq("following_id", targetUserId)
      .maybeSingle(),
    db
      .from("user_follows")
      .select("follower_id")
      .eq("follower_id", targetUserId)
      .eq("following_id", userId)
      .maybeSingle(),
  ]);

  return {
    isFollowing: !!followingRes.data,
    isFollowedBy: !!followedByRes.data,
  };
}

/** Batch check follow status for multiple target users (avoids N+1). */
export async function batchFollowStatus(
  userId: string,
  targetUserIds: string[],
  db: DbClient,
): Promise<Map<string, FollowStatus>> {
  if (targetUserIds.length === 0) return new Map();

  const [followingRes, followedByRes] = await Promise.all([
    db
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId)
      .in("following_id", targetUserIds),
    db
      .from("user_follows")
      .select("follower_id")
      .eq("following_id", userId)
      .in("follower_id", targetUserIds),
  ]);

  const followingSet = new Set(
    (followingRes.data ?? []).map((r) => String(r.following_id)),
  );
  const followedBySet = new Set(
    (followedByRes.data ?? []).map((r) => String(r.follower_id)),
  );

  const result = new Map<string, FollowStatus>();
  for (const id of targetUserIds) {
    result.set(id, {
      isFollowing: followingSet.has(id),
      isFollowedBy: followedBySet.has(id),
    });
  }
  return result;
}

export async function getFollowers(
  userId: string,
  cursor: string | undefined,
  limit: number,
  db: DbClient,
): Promise<{ users: FollowUserInfo[]; nextCursor: string | null }> {
  let query = db
    .from("user_follows")
    .select("follower_id, created_at")
    .eq("following_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.created_at ?? null : null;

  if (pageRows.length === 0) {
    return { users: [], nextCursor: null };
  }

  const userIds = pageRows.map((r) => String(r.follower_id));
  const { data: users } = await db
    .from("users")
    .select("id, username, display_name, avatar_url, telegram_photo_url, follower_count, following_count")
    .in("id", userIds);

  const usersMap = new Map(
    (users ?? []).map((u) => [
      String(u.id),
      {
        id: String(u.id),
        username: u.username,
        displayName: u.display_name,
        avatarUrl: u.avatar_url ?? u.telegram_photo_url,
        followerCount: u.follower_count ?? 0,
        followingCount: u.following_count ?? 0,
      },
    ]),
  );

  return {
    users: userIds
      .map((id) => usersMap.get(id))
      .filter((u): u is FollowUserInfo => u !== undefined),
    nextCursor,
  };
}

export async function getFollowing(
  userId: string,
  cursor: string | undefined,
  limit: number,
  db: DbClient,
): Promise<{ users: FollowUserInfo[]; nextCursor: string | null }> {
  let query = db
    .from("user_follows")
    .select("following_id, created_at")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.created_at ?? null : null;

  if (pageRows.length === 0) {
    return { users: [], nextCursor: null };
  }

  const userIds = pageRows.map((r) => String(r.following_id));
  const { data: users } = await db
    .from("users")
    .select("id, username, display_name, avatar_url, telegram_photo_url, follower_count, following_count")
    .in("id", userIds);

  const usersMap = new Map(
    (users ?? []).map((u) => [
      String(u.id),
      {
        id: String(u.id),
        username: u.username,
        displayName: u.display_name,
        avatarUrl: u.avatar_url ?? u.telegram_photo_url,
        followerCount: u.follower_count ?? 0,
        followingCount: u.following_count ?? 0,
      },
    ]),
  );

  return {
    users: userIds
      .map((id) => usersMap.get(id))
      .filter((u): u is FollowUserInfo => u !== undefined),
    nextCursor,
  };
}

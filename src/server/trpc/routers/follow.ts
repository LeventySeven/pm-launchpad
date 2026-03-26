import "server-only";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { FollowInputSchema, FollowListInputSchema } from "@/src/lib/validations/follows";
import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowers,
  getFollowing,
} from "@/src/server/services/follows";

export const followRouter = router({
  follow: protectedProcedure
    .input(FollowInputSchema)
    .mutation(({ ctx, input }) =>
      followUser(ctx.userId, input.targetUserId, ctx.supabaseService),
    ),

  unfollow: protectedProcedure
    .input(FollowInputSchema)
    .mutation(({ ctx, input }) =>
      unfollowUser(ctx.userId, input.targetUserId, ctx.supabaseService),
    ),

  status: protectedProcedure
    .input(z.object({ targetUserId: z.string().uuid() }))
    .query(({ ctx, input }) =>
      getFollowStatus(ctx.userId, input.targetUserId, ctx.supabaseService),
    ),

  followers: publicProcedure
    .input(FollowListInputSchema)
    .query(({ ctx, input }) =>
      getFollowers(input.userId, input.cursor, input.limit, ctx.supabaseService),
    ),

  following: publicProcedure
    .input(FollowListInputSchema)
    .query(({ ctx, input }) =>
      getFollowing(input.userId, input.cursor, input.limit, ctx.supabaseService),
    ),
});

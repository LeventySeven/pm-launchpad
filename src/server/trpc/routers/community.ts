import "server-only";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  CreateCommunityInputSchema,
  UpdateCommunityInputSchema,
  AddMarketToCommunityInputSchema,
  CommunityListInputSchema,
} from "@/src/lib/validations/communities";
import * as communityService from "@/src/server/services/communities";

export const communityRouter = router({
  create: protectedProcedure
    .input(CreateCommunityInputSchema)
    .mutation(({ ctx, input }) =>
      communityService.createCommunity(ctx.userId, input, ctx.supabaseService),
    ),

  update: protectedProcedure
    .input(UpdateCommunityInputSchema)
    .mutation(({ ctx, input }) =>
      communityService.updateCommunity(ctx.userId, input, ctx.supabaseService),
    ),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) =>
      communityService.getCommunityBySlug(input.slug, ctx.supabaseService),
    ),

  list: publicProcedure
    .input(CommunityListInputSchema)
    .query(({ ctx, input }) =>
      communityService.listCommunities(input, ctx.supabaseService),
    ),

  categories: publicProcedure
    .query(({ ctx }) =>
      communityService.listCommunityCategories(ctx.supabaseService),
    ),

  join: protectedProcedure
    .input(z.object({ communityId: z.string().uuid() }))
    .mutation(({ ctx, input }) =>
      communityService.joinCommunity(ctx.userId, input.communityId, ctx.supabaseService),
    ),

  leave: protectedProcedure
    .input(z.object({ communityId: z.string().uuid() }))
    .mutation(({ ctx, input }) =>
      communityService.leaveCommunity(ctx.userId, input.communityId, ctx.supabaseService),
    ),

  members: publicProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      cursor: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(({ ctx, input }) =>
      communityService.getCommunityMembers(input.communityId, input.cursor, input.limit, ctx.supabaseService),
    ),

  marketIds: publicProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      cursor: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(({ ctx, input }) =>
      communityService.getCommunityMarketIds(input.communityId, input.cursor, input.limit, ctx.supabaseService),
    ),

  addMarket: protectedProcedure
    .input(AddMarketToCommunityInputSchema)
    .mutation(({ ctx, input }) =>
      communityService.addMarketToCommunity(ctx.userId, input.communityId, input.marketId, ctx.supabaseService),
    ),

  removeMarket: protectedProcedure
    .input(AddMarketToCommunityInputSchema)
    .mutation(({ ctx, input }) =>
      communityService.removeMarketFromCommunity(ctx.userId, input.communityId, input.marketId, ctx.supabaseService),
    ),

  userCommunities: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(({ ctx, input }) =>
      communityService.getUserCommunities(input.userId, ctx.supabaseService),
    ),
});

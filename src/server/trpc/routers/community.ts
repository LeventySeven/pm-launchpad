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

  // ── Event Groups ──

  eventGroups: publicProcedure
    .input(z.object({ communityId: z.string().uuid() }))
    .query(({ ctx, input }) =>
      communityService.listEventGroups(input.communityId, ctx.supabaseService),
    ),

  createEventGroup: protectedProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    }))
    .mutation(({ ctx, input }) =>
      communityService.createEventGroup(ctx.userId, input.communityId, { title: input.title, description: input.description, color: input.color }, ctx.supabaseService),
    ),

  // ── Events ──

  events: publicProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      groupId: z.string().uuid().optional(),
      upcoming: z.boolean().optional(),
      cursor: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(({ ctx, input }) =>
      communityService.listEvents(input.communityId, { groupId: input.groupId, upcoming: input.upcoming, cursor: input.cursor, limit: input.limit }, ctx.supabaseService),
    ),

  createEvent: protectedProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      groupId: z.string().uuid().optional(),
      title: z.string().min(1).max(200),
      description: z.string().max(2000).optional(),
      imageUrl: z.string().url().optional(),
      startsAt: z.string().datetime(),
      endsAt: z.string().datetime().optional(),
      location: z.string().max(500).optional(),
    }))
    .mutation(({ ctx, input }) =>
      communityService.createEvent(ctx.userId, input.communityId, {
        groupId: input.groupId, title: input.title, description: input.description,
        imageUrl: input.imageUrl, startsAt: input.startsAt, endsAt: input.endsAt, location: input.location,
      }, ctx.supabaseService),
    ),

  // ── Messages ──

  messages: publicProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      cursor: z.string().optional(),
      limit: z.number().min(1).max(50).default(30),
    }))
    .query(({ ctx, input }) =>
      communityService.listMessages(input.communityId, { cursor: input.cursor, limit: input.limit }, ctx.supabaseService),
    ),

  postMessage: protectedProcedure
    .input(z.object({
      communityId: z.string().uuid(),
      body: z.string().min(1).max(2000),
      replyTo: z.string().uuid().optional(),
    }))
    .mutation(({ ctx, input }) =>
      communityService.postMessage(ctx.userId, input.communityId, { body: input.body, replyTo: input.replyTo }, ctx.supabaseService),
    ),

  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string().uuid() }))
    .mutation(({ ctx, input }) =>
      communityService.deleteMessage(ctx.userId, input.messageId, ctx.supabaseService),
    ),
});

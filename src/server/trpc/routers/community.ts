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

  /** Global social feed: recent bets, community joins, community creations, market creations */
  globalFeed: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(30) }).optional())
    .query(async ({ ctx }) => {
      const db = ctx.supabaseService;
      const limit = 30;

      // Fetch 3 streams in parallel, then merge + sort
      const [tradesResult, membersResult, communitiesResult] = await Promise.all([
        // Recent trades (bets)
        db.from("trades" as any)
          .select("id, user_id, market_id, action, outcome, created_at")
          .order("created_at", { ascending: false })
          .limit(limit),
        // Recent community joins
        (db as any).from("community_members")
          .select("user_id, community_id, joined_at")
          .order("joined_at", { ascending: false })
          .limit(limit),
        // Recent community creations
        (db as any).from("communities")
          .select("id, slug, name, created_by, created_at, banner_url")
          .order("created_at", { ascending: false })
          .limit(15),
      ]);

      const trades = (tradesResult.data ?? []) as any[];
      const joins = (membersResult.data ?? []) as any[];
      const newCommunities = (communitiesResult.data ?? []) as any[];

      // Collect all user IDs + market IDs + community IDs for batch lookup
      const userIds = new Set<string>();
      const marketIds = new Set<string>();
      const communityIds = new Set<string>();

      for (const t of trades) { userIds.add(t.user_id); marketIds.add(t.market_id); }
      for (const j of joins) { userIds.add(j.user_id); communityIds.add(j.community_id); }
      for (const c of newCommunities) { userIds.add(c.created_by); }

      // Batch fetch users, markets, communities
      const [usersResult, marketsResult, commResult] = await Promise.all([
        userIds.size > 0
          ? db.from("users").select("id, username, display_name, avatar_url, telegram_photo_url").in("id", [...userIds])
          : Promise.resolve({ data: [] }),
        marketIds.size > 0
          ? db.from("markets").select("id, title_eng, title_rus").in("id", [...marketIds])
          : Promise.resolve({ data: [] }),
        communityIds.size > 0
          ? (db as any).from("communities").select("id, slug, name, banner_url").in("id", [...communityIds])
          : Promise.resolve({ data: [] }),
      ]);

      type UInfo = { name: string; avatar: string | null };
      type MInfo = { title: string };
      type CInfo = { name: string; slug: string; bannerUrl: string | null };
      const usersMap = new Map<string, UInfo>((usersResult.data ?? []).map((u: any) => [
        String(u.id), { name: u.display_name ?? u.username ?? "", avatar: u.avatar_url ?? u.telegram_photo_url ?? null },
      ]));
      const marketsMap = new Map<string, MInfo>((marketsResult.data ?? []).map((m: any) => [
        String(m.id), { title: m.title_eng ?? m.title_rus ?? "" },
      ]));
      const commMap = new Map<string, CInfo>((commResult.data ?? []).map((c: any) => [
        String(c.id), { name: c.name, slug: c.slug, bannerUrl: c.banner_url ?? null },
      ]));

      type FeedItem = {
        id: string;
        type: "bet" | "join" | "community_created" | "market_created";
        userId: string;
        userName: string;
        userAvatar: string | null;
        marketId: string | null;
        marketTitle: string | null;
        communityId: string | null;
        communityName: string | null;
        communitySlug: string | null;
        outcome: string | null;
        createdAt: string;
      };

      const items: FeedItem[] = [];

      // Trades → bets
      for (const t of trades) {
        const u = usersMap.get(t.user_id);
        const m = marketsMap.get(t.market_id);
        items.push({
          id: `bet-${t.id}`,
          type: "bet",
          userId: t.user_id,
          userName: u?.name ?? "",
          userAvatar: u?.avatar ?? null,
          marketId: t.market_id,
          marketTitle: m?.title ?? null,
          communityId: null,
          communityName: null,
          communitySlug: null,
          outcome: t.outcome ?? null,
          createdAt: t.created_at,
        });
      }

      // Joins
      for (const j of joins) {
        const u = usersMap.get(j.user_id);
        const c = commMap.get(j.community_id);
        items.push({
          id: `join-${j.user_id}-${j.community_id}`,
          type: "join",
          userId: j.user_id,
          userName: u?.name ?? "",
          userAvatar: u?.avatar ?? null,
          marketId: null,
          marketTitle: null,
          communityId: j.community_id,
          communityName: c?.name ?? null,
          communitySlug: c?.slug ?? null,
          outcome: null,
          createdAt: j.joined_at,
        });
      }

      // Community creations
      for (const c of newCommunities) {
        const u = usersMap.get(c.created_by);
        items.push({
          id: `comm-${c.id}`,
          type: "community_created",
          userId: c.created_by,
          userName: u?.name ?? "",
          userAvatar: u?.avatar ?? null,
          marketId: null,
          marketTitle: null,
          communityId: c.id,
          communityName: c.name,
          communitySlug: c.slug,
          outcome: null,
          createdAt: c.created_at,
        });
      }

      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return items.slice(0, limit);
    }),
});

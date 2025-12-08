import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const userShape = {
  id: z.number(),
  telegramId: z.number(),
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  balance: z.number(),
};

export const userRouter = router({
  registerUser: publicProcedure
    .input(
      z.object({
        telegramId: z.number(),
        username: z.string().optional(),
        displayName: z.string().optional(),
      })
    )
    .output(z.object(userShape))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx;
      const { telegramId } = input;
      const username = input.username?.trim() || null;
      const displayName =
        input.displayName?.trim() || username || `tg-${telegramId}`;

      const existing = await supabase
        .from("users")
        .select("id, telegram_id, username, display_name, balance")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (existing.data) {
        const u = existing.data;
        return {
          id: Number(u.id),
          telegramId: Number(u.telegram_id),
          username: u.username,
          displayName: u.display_name,
          balance: Number(u.balance),
        };
      }

      const insert = await supabase
        .from("users")
        .insert({
          telegram_id: telegramId,
          username,
          display_name: displayName,
        })
        .select("id, telegram_id, username, display_name, balance")
        .single();

      if (insert.error || !insert.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: insert.error?.message ?? "Failed to create user",
        });
      }

      const u = insert.data;
      return {
        id: Number(u.id),
        telegramId: Number(u.telegram_id),
        username: u.username,
        displayName: u.display_name,
        balance: Number(u.balance),
      };
    }),

  getMe: publicProcedure
    .input(z.object({ telegramId: z.number() }))
    .output(z.object(userShape))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;
      const { telegramId } = input;

      const user = await supabase
        .from("users")
        .select("id, telegram_id, username, display_name, balance")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (!user.data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const u = user.data;
      return {
        id: Number(u.id),
        telegramId: Number(u.telegram_id),
        username: u.username,
        displayName: u.display_name,
        balance: Number(u.balance),
      };
    }),
});


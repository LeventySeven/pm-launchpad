import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/** Procedure that requires authentication. Injects `ctx.userId` for convenience. */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.authUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.authUser.id,
      authUser: ctx.authUser, // guaranteed non-null
    },
  });
});


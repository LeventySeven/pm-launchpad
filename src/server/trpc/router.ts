import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { userRouter } from "./routers/user";
import { marketRouter } from "./routers/market";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createCaller = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  user: userRouter,
  market: marketRouter,
});

export type AppRouter = typeof appRouter;


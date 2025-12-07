import { userRouter } from "./routers/user";
import { marketRouter } from "./routers/market";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  market: marketRouter,
});

export const createCaller = appRouter.createCaller;
export type AppRouter = typeof appRouter;


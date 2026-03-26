import { userRouter } from "./routers/user";
import { marketRouter } from "./routers/market";
import { authRouter } from "./routers/auth";
import { walletRouter } from "./routers/wallet";
import { followRouter } from "./routers/follow";
import { communityRouter } from "./routers/community";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  market: marketRouter,
  auth: authRouter,
  wallet: walletRouter,
  follow: followRouter,
  community: communityRouter,
});

export const createCaller = appRouter.createCaller;
export type AppRouter = typeof appRouter;


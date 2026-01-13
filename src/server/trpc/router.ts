import { userRouter } from "./routers/user";
import { marketRouter } from "./routers/market";
import { authRouter } from "./routers/auth";
import { walletRouter } from "./routers/wallet";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  market: marketRouter,
  auth: authRouter,
  wallet: walletRouter,
});

export const createCaller = appRouter.createCaller;
export type AppRouter = typeof appRouter;


import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/src/server/trpc/router";
import { createContext } from "@/src/server/trpc/context";

// Ensure this route is always dynamic and runs on Node (Supabase service key not allowed on edge).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
    responseMeta({ ctx }) {
      if (ctx?.responseHeaders) {
        // IMPORTANT: Fetch Response headers must handle multiple `Set-Cookie` values.
        // Our context stores multi-value headers as string[]; convert them to a Headers instance
        // so we can append each value.
        const headers = new Headers();
        for (const [key, value] of Object.entries(ctx.responseHeaders)) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
          } else if (typeof value === "string") {
            headers.set(key, value);
          }
        }
        return { headers };
      }
      return {};
    },
  });

export { handler as GET, handler as POST };


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
        // Convert our multi-value headers format to HTTPHeaders (Record<string, string | string[]>)
        // tRPC's fetch adapter will handle converting this to a proper Headers object.
        const headers: Record<string, string | string[]> = {};
        for (const [key, value] of Object.entries(ctx.responseHeaders)) {
          if (Array.isArray(value)) {
            // For multi-value headers like Set-Cookie, keep as array
            headers[key] = value;
          } else if (typeof value === "string") {
            headers[key] = value;
          }
        }
        return { headers };
      }
      return {};
    },
  });

export { handler as GET, handler as POST };


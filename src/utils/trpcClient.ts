import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/src/server/trpc/router";

const getBaseUrl = () => {
  // IMPORTANT:
  // tRPC's `httpBatchLink` requires an absolute http(s) URL when evaluated in a non-browser
  // environment (e.g. Next.js prerender / edge runtime). A relative URL like `/api/trpc`
  // will crash the build with: "Endpoint URL must start with `http:` or `https:`."
  if (typeof window !== "undefined") {
    const origin = window.location?.origin;
    if (origin && (origin.startsWith("http://") || origin.startsWith("https://"))) return origin;
  }

  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? process.env.VERCEL_URL : undefined);

  if (raw && raw.trim().length > 0) {
    const trimmed = raw.trim();
    return trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
  }

  return "http://localhost:3000";
};

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // Ensure auth cookies are always sent (important for WebViews / cross-origin edge cases).
      fetch(url, options = {}) {
        return fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            ...options.headers,
          },
        });
      },
    }),
  ],
});


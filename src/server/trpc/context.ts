import { supabaseServerClient } from "../supabase/client";
import type { inferAsyncReturnType } from "@trpc/server";

function parseCookies(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
}

export const createContext = (opts: { req: Request }) => {
  const supabase = supabaseServerClient();
  const responseHeaders: Record<string, string | string[]> = {};
  const cookies = parseCookies(opts.req);

  const appendHeader = (key: string, value: string) => {
    const existing = responseHeaders[key];
    if (!existing) {
      responseHeaders[key] = value;
    } else if (Array.isArray(existing)) {
      responseHeaders[key] = [...existing, value];
    } else {
      responseHeaders[key] = [existing, value];
    }
  };

  return {
    supabase,
    req: opts.req,
    cookies,
    responseHeaders,
    setCookie: (value: string) => appendHeader("set-cookie", value),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;


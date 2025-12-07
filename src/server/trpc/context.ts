import { supabaseServerClient } from "../supabase/client";
import type { inferAsyncReturnType } from "@trpc/server";

export const createContext = () => {
  const supabase = supabaseServerClient();
  return { supabase };
};

export type Context = inferAsyncReturnType<typeof createContext>;


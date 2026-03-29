import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Supabase connection string — get from Dashboard → Project Settings → Database → Connection string (URI)
    // Use the "Session mode" pooler URI (port 5432) for drizzle-kit push
    url: process.env.DATABASE_URL!,
  },
});

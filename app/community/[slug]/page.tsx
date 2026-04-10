import type { Metadata } from "next";
import { headers } from "next/headers";
import { getHomePageInitialData } from "@/src/server/markets/pageData";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 15;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getBaseUrl = async () => {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  return host ? `${proto}://${host}` : "";
};

const fetchCommunityPreview = async (slug: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_SECRET;
  if (!url || !anon) return null;

  const endpoint =
    `${url.replace(/\/$/, "")}/rest/v1/communities_public` +
    `?slug=eq.${encodeURIComponent(slug)}` +
    `&select=name,description,banner_url,member_count,market_count`;

  const res = await fetch(endpoint, {
    next: { revalidate: 300 },
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as Array<{
    name?: string | null;
    description?: string | null;
    banner_url?: string | null;
    member_count?: number | null;
    market_count?: number | null;
  }>;
  const row = rows[0] ?? null;
  if (!row) return null;
  return {
    name: (row.name || "Community").trim(),
    description: row.description?.trim() ?? null,
    bannerUrl: row.banner_url?.trim() ?? null,
    memberCount: row.member_count ?? 0,
    marketCount: row.market_count ?? 0,
  };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();
  const preview = await fetchCommunityPreview(slug);
  const title = preview ? `${preview.name} — Yalla Market` : "Yalla Market";
  const desc = preview
    ? `${preview.memberCount} members · ${preview.marketCount} markets${preview.description ? ` — ${preview.description.slice(0, 120)}` : ""}`
    : "Yalla Market";
  const image = preview?.bannerUrl ?? `${baseUrl}/white.svg`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [image],
    },
  };
};

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const initialData = await getHomePageInitialData();

  return (
    <HomePageClient
      initialMarkets={initialData.initialMarkets}
      initialCategories={initialData.initialCategories}
      fetchedAt={initialData.fetchedAt}
      initialCommunitySlug={slug}
    />
  );
}

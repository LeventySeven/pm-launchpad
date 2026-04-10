import type { Metadata } from "next";
import { headers } from "next/headers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getBaseUrl = async () => {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  return host ? `${proto}://${host}` : "";
};

type CommunityPreview = {
  name: string;
  description: string | null;
  bannerUrl: string | null;
  memberCount: number;
  marketCount: number;
  creatorName: string;
  creatorAvatarUrl: string | null;
};

const fetchCommunityPreview = async (slug: string): Promise<CommunityPreview | null> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_SECRET;
  if (!url || !anon) return null;

  const endpoint =
    `${url.replace(/\/$/, "")}/rest/v1/communities_public` +
    `?slug=eq.${encodeURIComponent(slug)}` +
    `&select=name,description,banner_url,member_count,market_count,creator_name,creator_avatar_url`;

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
    creator_name?: string | null;
    creator_avatar_url?: string | null;
  }>;
  const row = rows[0] ?? null;
  if (!row) return null;
  return {
    name: (row.name || "Community").trim(),
    description: row.description?.trim() ?? null,
    bannerUrl: row.banner_url?.trim() ?? null,
    memberCount: row.member_count ?? 0,
    marketCount: row.market_count ?? 0,
    creatorName: (row.creator_name || "").trim(),
    creatorAvatarUrl: row.creator_avatar_url?.trim() ?? null,
  };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();
  const preview = await fetchCommunityPreview(slug);
  const title = preview?.name ?? "Yalla Market";
  const desc = preview
    ? `${preview.memberCount} members · ${preview.marketCount} markets${preview.description ? ` — ${preview.description.slice(0, 120)}` : ""}`
    : "Yalla Market";
  const image = preview?.bannerUrl ?? `${baseUrl}/white.svg`;
  const url = `${baseUrl}/share/community/${slug}`;

  return {
    title,
    description: desc,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: desc,
      url,
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

export default async function ShareCommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();
  const target = baseUrl ? `${baseUrl}/community/${encodeURIComponent(slug)}` : `/community/${encodeURIComponent(slug)}`;
  const preview = await fetchCommunityPreview(slug);
  const name = preview?.name ?? "Community";
  const desc = preview?.description ?? null;
  const banner = preview?.bannerUrl ?? null;
  const members = preview?.memberCount ?? 0;
  const markets = preview?.marketCount ?? 0;
  const creatorName = preview?.creatorName ?? "";
  const creatorAvatar = preview?.creatorAvatarUrl ?? null;

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="refresh" content={`1; url=${target}`} />
        <script>{`(function () { try { setTimeout(function () { try { window.location.replace(${JSON.stringify(target)}); } catch { window.location.href = ${JSON.stringify(target)}; } }, 200); } catch (e) {} })();`}</script>
      </head>
      <body
        style={{
          background: "#000",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          margin: 0,
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 20,
              border: "1px solid rgba(24,24,27,1)",
              background: "rgba(0,0,0,1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
              overflow: "hidden",
            }}
          >
            {/* Banner / gradient header */}
            <div
              style={{
                height: 100,
                background: banner
                  ? `url(${banner}) center/cover no-repeat`
                  : "linear-gradient(135deg, rgba(245,68,166,0.25) 0%, rgba(190,255,29,0.12) 100%)",
                borderBottom: "1px solid rgba(24,24,27,1)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                }}
              />
            </div>

            {/* Content */}
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.3, wordBreak: "break-word" }}>
                {name}
              </div>

              {desc && (
                <div style={{ fontSize: 13, color: "rgba(161,161,170,1)", marginTop: 6, lineHeight: 1.5 }}>
                  {desc.length > 140 ? desc.slice(0, 137) + "..." : desc}
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,68,166,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5" }}>{members}</span>
                  <span style={{ fontSize: 11, color: "rgba(113,113,122,1)" }}>members</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(190,255,29,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5" }}>{markets}</span>
                  <span style={{ fontSize: 11, color: "rgba(113,113,122,1)" }}>markets</span>
                </div>
              </div>

              {/* Creator */}
              {creatorName && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(24,24,27,1)" }}>
                  {creatorAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={creatorAvatar} alt="" style={{ width: 22, height: 22, borderRadius: 999, objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(39,39,42,1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "rgba(161,161,170,1)" }}>
                      {creatorName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: 12, color: "rgba(161,161,170,1)" }}>
                    Created by <span style={{ color: "#f4f4f5", fontWeight: 600 }}>{creatorName}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(24,24,27,1)" }}>
              <div style={{ fontSize: 13, color: "rgba(161,161,170,1)" }}>Opening…</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "rgba(113,113,122,1)" }}>
                If nothing happens,{" "}
                <a href={target} style={{ color: "#f4f4f5", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  open in web
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

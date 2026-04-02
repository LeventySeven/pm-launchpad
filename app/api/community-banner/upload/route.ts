import { getSupabaseServiceClient } from "@/src/server/supabase/client";
import { verifyAuthToken } from "@/src/server/auth/jwt";
import { parseCookies } from "@/src/server/http/cookies";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const cookies = parseCookies(req);
  const token = cookies["auth_token"];
  if (!token) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let payload: { sub: string };
  try {
    payload = (await verifyAuthToken(token)) as { sub: string };
  } catch {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const communityId = form.get("communityId");

  if (!(file instanceof File)) {
    return Response.json({ error: "MISSING_FILE" }, { status: 400 });
  }
  if (typeof communityId !== "string" || !communityId.trim()) {
    return Response.json({ error: "MISSING_COMMUNITY_ID" }, { status: 400 });
  }

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  if (!allowedTypes.has(file.type)) {
    return Response.json({ error: "INVALID_FILE_TYPE" }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024; // 5MB for banners
  if (file.size > maxBytes) {
    return Response.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
  }

  const extMap: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = extMap[file.type] ?? "jpg";

  const supabase = getSupabaseServiceClient();

  // Verify user is creator or moderator of this community
  const { data: membership } = await supabase
    .from("community_members" as any)
    .select("role")
    .eq("community_id", communityId)
    .eq("user_id", payload.sub)
    .maybeSingle();

  if (!membership || !["creator", "moderator"].includes(String((membership as any).role))) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const objectName = `communities/${communityId}/${Date.now()}_${randomBytes(6).toString("hex")}.${ext}`;

  const uploadRes = await supabase.storage.from("avatars").upload(objectName, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });

  if (uploadRes.error) {
    return Response.json({ error: uploadRes.error.message }, { status: 500 });
  }

  const publicUrl = supabase.storage.from("avatars").getPublicUrl(objectName).data.publicUrl;

  // Update community banner_url
  const { error: updateError } = await supabase
    .from("communities" as any)
    .update({ banner_url: publicUrl })
    .eq("id", communityId);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({ bannerUrl: publicUrl });
}

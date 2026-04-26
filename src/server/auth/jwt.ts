import { SignJWT, jwtVerify } from "jose";

const JWT_ISSUER = "pravda-app";
const JWT_AUDIENCE = "pravda-users";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_SAME_SITE = IS_PROD ? "None" : "Lax";
const COOKIE_SECURE_PART = IS_PROD ? "Secure;" : "";
let warnedAboutFallbackSecret = false;

function getKey() {
  const jwtSecret = process.env.AUTH_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!jwtSecret || jwtSecret.length < 48) {
    throw new Error(
      "AUTH_JWT_SECRET is not set or too short (min 48 chars), and SUPABASE_SERVICE_ROLE_KEY is unavailable for fallback"
    );
  }

  if (!process.env.AUTH_JWT_SECRET && !warnedAboutFallbackSecret) {
    warnedAboutFallbackSecret = true;
    console.warn(
      "AUTH_JWT_SECRET is not set; using SUPABASE_SERVICE_ROLE_KEY as the server-only app JWT signing fallback."
    );
  }

  return new TextEncoder().encode(jwtSecret);
}

type JwtPayload = {
  sub: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

export async function signAuthToken(payload: JwtPayload) {
  const key = getKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .sign(key);
}

export async function verifyAuthToken(token: string) {
  const key = getKey();
  const { payload } = await jwtVerify<JwtPayload>(token, key, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
  return payload;
}

export function authCookie(token: string) {
  const maxAge = TOKEN_TTL_SECONDS;
  return `auth_token=${token}; HttpOnly; Path=/; SameSite=${COOKIE_SAME_SITE}; Max-Age=${maxAge}; ${COOKIE_SECURE_PART}`.trimEnd();
}

export function clearAuthCookie() {
  return `auth_token=; HttpOnly; Path=/; SameSite=${COOKIE_SAME_SITE}; Max-Age=0; ${COOKIE_SECURE_PART}`.trimEnd();
}

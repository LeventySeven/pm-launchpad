import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import type { Session } from "@supabase/supabase-js";
import { authCookie, clearAuthCookie, signAuthToken, verifyAuthToken } from "../../auth/jwt";
import type { PublicUser } from "../../auth/types";
import type { Database } from "../../../types/database";
import { toMajorUnits } from "../helpers/pricing";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SUPABASE_ACCESS_COOKIE = "sb_access_token";
const SUPABASE_REFRESH_COOKIE = "sb_refresh_token";
const SUPABASE_REFRESH_MAX_AGE = 60 * 60 * 24 * 180; // 180 days
const sameSiteCookie = process.env.NODE_ENV === "production" ? "None" : "Lax";
const secureCookie = process.env.NODE_ENV === "production" ? "Secure;" : "";

const buildCookie = (name: string, value: string, maxAgeSeconds: number) =>
  `${name}=${value}; HttpOnly; Path=/; SameSite=${sameSiteCookie}; Max-Age=${maxAgeSeconds}; ${secureCookie}`.trimEnd();

const clearCookie = (name: string) => buildCookie(name, "", 0);

const supabaseAccessCookie = (token: string, expiresIn?: number | null) =>
  buildCookie(SUPABASE_ACCESS_COOKIE, token, Math.max(1, expiresIn ?? 3600));

const supabaseRefreshCookie = (token: string) =>
  buildCookie(SUPABASE_REFRESH_COOKIE, token, SUPABASE_REFRESH_MAX_AGE);

const persistSupabaseSession = (session: Session, setCookie: (value: string) => void) => {
  if (session?.access_token) {
    setCookie(supabaseAccessCookie(session.access_token, session.expires_in));
  }
  if (session?.refresh_token) {
    setCookie(supabaseRefreshCookie(session.refresh_token));
  }
};

const DEFAULT_ASSET = "TOMATO";
const TOMATO_DECIMALS = 6;
const SIGNUP_BONUS_MAJOR = 1000;
const SIGNUP_BONUS_MINOR = SIGNUP_BONUS_MAJOR * Math.pow(10, TOMATO_DECIMALS);

const emailSchema = z.string().email().max(255);
const usernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_.-]+$/, "Username may contain letters, numbers, _, ., -");
const passwordSchema = z.string().min(8).max(128);

const publicColumns =
  "id, email, username, display_name, avatar_url, telegram_photo_url, referral_code, referral_commission_rate, referral_enabled, created_at, is_admin, solana_wallet_address, solana_cluster, solana_wallet_connected_at";

const USERS_TABLE = "users" as const;
const WALLET_BALANCES_TABLE = "wallet_balances" as const;

type DbUserRow = Database["public"]["Tables"]["users"]["Row"];

type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type WalletBalanceInsert = Database["public"]["Tables"]["wallet_balances"]["Insert"];
type WalletBalanceRow = Pick<Database["public"]["Tables"]["wallet_balances"]["Row"], "balance_minor">;

/**
 * Fetch user row + wallet balance in a single parallel call.
 * Eliminates the repeated sequential user-then-wallet pattern.
 */
async function fetchUserWithBalance(
  db: ReturnType<typeof import("../../supabase/client").getSupabaseServiceClient>,
  userId: string,
): Promise<{ userRow: DbUserRow; balanceMinor: number } | null> {
  const [userResult, walletResult] = await Promise.all([
    db.from(USERS_TABLE).select(publicColumns).eq("id", userId).maybeSingle(),
    db.from(WALLET_BALANCES_TABLE).select("balance_minor").eq("user_id", userId).eq("asset_code", DEFAULT_ASSET).maybeSingle(),
  ]);
  if (userResult.error || !userResult.data) return null;
  const wallet = walletResult.data as WalletBalanceRow | null;
  return {
    userRow: userResult.data as DbUserRow,
    balanceMinor: wallet ? Number(wallet.balance_minor ?? 0) : 0,
  };
}

const TELEGRAM_PLACEHOLDER_DOMAIN = "telegram.local";
const buildTelegramEmail = (telegramId: number) => `tg_${telegramId}@${TELEGRAM_PLACEHOLDER_DOMAIN}`;
const buildTelegramUsername = (telegramId: number) => `tg_${telegramId}`;

const telegramUserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  photo_url: z.string().url().optional(),
});

const parseTelegramInitData = (initData: string, botToken: string) => {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "TELEGRAM_INITDATA_MISSING_HASH" });
  }

  params.delete("hash");

  const entries: Array<[string, string]> = [];
  for (const [k, v] of params.entries()) {
    entries.push([k, v]);
  }
  entries.sort(([a], [b]) => a.localeCompare(b));

  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

  // Telegram WebApp validation:
  // secret_key = HMAC_SHA256(key="WebAppData", message=botToken)
  // expected_hash = HMAC_SHA256(key=secret_key, message=dataCheckString)
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expectedHashHex = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    const a = Buffer.from(expectedHashHex, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "TELEGRAM_INITDATA_INVALID_HASH" });
    }
  } catch (err) {
    if (err instanceof TRPCError) throw err;
    throw new TRPCError({ code: "UNAUTHORIZED", message: "TELEGRAM_INITDATA_INVALID_HASH" });
  }

  const authDateRaw = params.get("auth_date");
  const authDate = authDateRaw ? Number(authDateRaw) : null;
  if (authDate && Number.isFinite(authDate)) {
    const now = Math.floor(Date.now() / 1000);
    const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days
    if (authDate > now + 60 || now - authDate > maxAgeSeconds) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "TELEGRAM_INITDATA_EXPIRED" });
    }
  }

  const userJson = params.get("user");
  if (!userJson) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "TELEGRAM_INITDATA_MISSING_USER" });
  }

  type TelegramUserJson = {
    id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    photo_url?: string;
  };

  let userParsed: TelegramUserJson;
  try {
    userParsed = JSON.parse(userJson) as TelegramUserJson;
  } catch {
    throw new TRPCError({ code: "BAD_REQUEST", message: "TELEGRAM_INITDATA_BAD_USER" });
  }

  const user = telegramUserSchema.parse(userParsed);
  return { user, authDate };
};

const toPublicUser = (row: DbUserRow, balanceMinor: number = 0): PublicUser => ({
  id: String(row.id),
  email: row.email,
  username: row.username,
  displayName: row.display_name,
  avatarUrl: row.avatar_url ?? null,
  telegramPhotoUrl: row.telegram_photo_url ?? null,
  referralCode: row.referral_code,
  referralCommissionRate:
    row.referral_commission_rate === null || row.referral_commission_rate === undefined
      ? null
      : Number(row.referral_commission_rate),
  referralEnabled: row.referral_enabled,
  balance: toMajorUnits(balanceMinor, TOMATO_DECIMALS),
  createdAt: new Date(row.created_at).toISOString(),
  isAdmin: Boolean(row.is_admin),
  solanaWalletAddress: row.solana_wallet_address ?? null,
  solanaCluster: row.solana_cluster ?? null,
  solanaWalletConnectedAt: row.solana_wallet_connected_at
    ? new Date(row.solana_wallet_connected_at).toISOString()
    : null,
});

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        username: usernameSchema,
        password: passwordSchema,
        displayName: z.string().trim().min(2).max(32).optional(),
        referralCode: z.string().trim().min(1).max(64).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, supabaseService, setCookie } = ctx;
      const email = input.email.toLowerCase().trim();
      const username = input.username.trim();
      const displayName = input.displayName?.trim() || username;
      const referralCode = input.referralCode?.trim() || null;

      // Block signups with reserved internal email domain
      if (email.endsWith(`@${TELEGRAM_PLACEHOLDER_DOMAIN}`)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This email domain is reserved" });
      }

      const [byEmail, byUsername] = await Promise.all([
        supabaseService.from("users").select("id").eq("email", email).maybeSingle(),
        supabaseService.from("users").select("id").eq("username", username).maybeSingle(),
      ]);

      if (byEmail.error || byUsername.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: byEmail.error?.message ?? byUsername.error?.message ?? "Lookup failed",
        });
      }

      const existing = { data: byEmail.data ?? byUsername.data };

      if (existing.data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email or username already exists",
        });
      }

      const createdUser = await supabaseService.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
        user_metadata: { username },
      });

      if (createdUser.error || !createdUser.data?.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: createdUser.error?.message ?? "Failed to register user",
        });
      }

      const userId = createdUser.data.user.id;

      const payload: UserInsert = {
        id: userId,
        email,
        username,
        display_name: displayName,
        is_admin: false,
        referral_code: null,
      };

      const inserted = await supabaseService
        .from("users")
        .upsert(payload, { onConflict: "id" })
        .select(publicColumns)
        .single();

      if (inserted.error || !inserted.data) {
        await supabase.auth.admin.deleteUser(userId);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: inserted.error?.message ?? "Failed to create user",
        });
      }

      // Initialize wallet balance for new user
      await supabaseService
        .from("wallet_balances")
        .upsert(
          {
            user_id: inserted.data.id,
            asset_code: DEFAULT_ASSET,
            balance_minor: SIGNUP_BONUS_MINOR,
          } as WalletBalanceInsert,
          // IMPORTANT: do not overwrite balances (or DB-trigger-based bonus) if row already exists.
          { onConflict: "user_id,asset_code", ignoreDuplicates: true }
        );

      // Fetch wallet balance + attach referral + auto-login in parallel
      const walletPromise = supabaseService
        .from(WALLET_BALANCES_TABLE)
        .select("balance_minor")
        .eq("user_id", inserted.data.id)
        .eq("asset_code", DEFAULT_ASSET)
        .maybeSingle();

      const referralPromise = referralCode
        ? supabaseService
            .from("users")
            .select("id, referral_enabled")
            .eq("referral_code", referralCode)
            .maybeSingle()
            .then(({ data: referrerRow }) => {
              if (referrerRow?.id && referrerRow.id !== userId && referrerRow.referral_enabled === true) {
                return supabaseService
                  .from("user_referrals")
                  .upsert({ user_id: userId, referrer_user_id: referrerRow.id }, { onConflict: "user_id" });
              }
            })
        : Promise.resolve();

      const autoLoginPromise = supabase.auth.signInWithPassword({
        email,
        password: input.password,
      });

      const [walletResult, , autoLogin] = await Promise.all([
        walletPromise,
        referralPromise,
        autoLoginPromise,
      ]);

      if (walletResult.error) {
        console.warn("signUp: wallet fetch failed", walletResult.error.message);
      }
      const wallet = walletResult.data as WalletBalanceRow | null;
      const balanceMinor = wallet ? Number(wallet.balance_minor ?? 0) : 0;

      if (autoLogin.error || !autoLogin.data?.session) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: autoLogin.error?.message ?? "Failed to start session",
        });
      }

      persistSupabaseSession(autoLogin.data.session, setCookie);

      const token = await signAuthToken({
        sub: String(inserted.data.id),
        email: inserted.data.email,
        username: inserted.data.username,
        isAdmin: Boolean(inserted.data.is_admin),
      });
      setCookie(authCookie(token));

      return { user: toPublicUser(inserted.data as DbUserRow, balanceMinor) };
    }),

  login: publicProcedure
    .input(
      z.object({
        emailOrUsername: z.string().min(1),
        password: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, supabaseService, setCookie } = ctx;
      const emailOrUsername = input.emailOrUsername.trim();

      let loginEmail = emailOrUsername.toLowerCase();
      if (!emailOrUsername.includes("@")) {
        const { data: usernameRow, error: usernameError } = await supabaseService
        .from("users")
          .select("email")
          .eq("username", emailOrUsername)
        .maybeSingle();

        if (usernameError || !usernameRow) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
        loginEmail = usernameRow.email.toLowerCase();
      }

      const signIn = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: input.password,
      });

      if (signIn.error || !signIn.data?.user || !signIn.data.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const authUser = signIn.data.user;

      const result = await fetchUserWithBalance(supabaseService, authUser.id);
      if (!result) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }

      persistSupabaseSession(signIn.data.session, setCookie);

      const token = await signAuthToken({
        sub: String(result.userRow.id),
        email: result.userRow.email,
        username: result.userRow.username,
        isAdmin: Boolean(result.userRow.is_admin),
      });
      setCookie(authCookie(token));

      return { user: toPublicUser(result.userRow, result.balanceMinor) };
    }),

  /**
   * Telegram Mini App one-click login.
   * Validates initData, upserts a user by telegram_id, then creates a Supabase session
   * (required because core trading RPCs rely on auth.uid()).
   */
  telegramLogin: publicProcedure
    .input(
      z.object({
        initData: z.string().min(1).max(8192),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, supabaseService, setCookie } = ctx;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "TELEGRAM_BOT_TOKEN_NOT_SET" });
      }

      const { user: tgUser, authDate } = parseTelegramInitData(input.initData, botToken);
      const telegramId = tgUser.id;
      const email = buildTelegramEmail(telegramId);

      // Avoid overwriting user's custom nickname/username if they already exist.
      const existing = await supabaseService
        .from("users")
        .select("id, email, username, display_name, is_admin, avatar_url")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (existing.error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: existing.error.message });
      }

      const existingRow = existing.data as Pick<
        DbUserRow,
        "id" | "email" | "username" | "display_name" | "is_admin" | "avatar_url"
      > | null;

      const fallbackUsername = tgUser.username?.trim() || buildTelegramUsername(telegramId);
      const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ").trim();
      const desiredDisplayName = fullName || fallbackUsername;

      const username = existingRow?.username?.trim() || fallbackUsername;
      const displayName = existingRow?.display_name?.trim() || desiredDisplayName;
      const avatarUrl =
        existingRow?.avatar_url?.trim() ||
        tgUser.photo_url?.trim() ||
        null;

      // We rotate the password on every Telegram login so we never need to store it.
      const password = randomBytes(24).toString("base64url");

      let authUserId = existingRow?.id ?? null;

      if (!authUserId) {
        const created = await supabaseService.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            username,
            telegram_id: telegramId,
          },
        });

        if (created.error || !created.data?.user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: created.error?.message ?? "Failed to create Supabase auth user",
          });
        }

        authUserId = created.data.user.id;
      } else {
        // Ensure we can sign in with the rotated password and keep metadata in sync.
        const updatedAuth = await supabaseService.auth.admin.updateUserById(authUserId, {
          password,
          email_confirm: true,
          user_metadata: {
            username,
            telegram_id: telegramId,
          },
        });
        if (updatedAuth.error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: updatedAuth.error.message,
          });
        }
      }

      const payload: UserInsert = {
        id: authUserId,
        email,
        username,
        display_name: displayName,
        // Single source of truth for the avatar shown in-app:
        // - first Telegram login sets avatar_url from photo_url
        // - later user can override avatar_url manually
        // - we never overwrite an existing avatar_url here
        avatar_url: avatarUrl,
        telegram_id: telegramId,
        telegram_username: tgUser.username ?? null,
        telegram_first_name: tgUser.first_name ?? null,
        telegram_last_name: tgUser.last_name ?? null,
        telegram_photo_url: tgUser.photo_url ?? null,
        telegram_auth_date: authDate ? new Date(authDate * 1000).toISOString() : null,
      };

      const upserted = await supabaseService
        .from("users")
        .upsert(payload, { onConflict: "id" })
        .select(publicColumns)
        .single();

      if (upserted.error || !upserted.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: upserted.error?.message ?? "Failed to upsert user",
        });
      }

      // Ensure wallet exists (idempotent)
      await supabaseService
        .from("wallet_balances")
        .upsert(
          {
            user_id: upserted.data.id,
            asset_code: DEFAULT_ASSET,
            balance_minor: SIGNUP_BONUS_MINOR,
          } as WalletBalanceInsert,
          // IMPORTANT: do not overwrite initial credit (1500 TOMATO) if your DB trigger already created it.
          { onConflict: "user_id,asset_code", ignoreDuplicates: true }
        );

      // Create a Supabase session for this user (required for auth.uid() in RPCs).
      const signIn = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signIn.error || !signIn.data?.session) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: signIn.error?.message ?? "Failed to create Supabase session",
        });
      }

      persistSupabaseSession(signIn.data.session, setCookie);

      // Fetch wallet balance in parallel with JWT signing
      const [walletResult, token] = await Promise.all([
        supabaseService
          .from(WALLET_BALANCES_TABLE)
          .select("balance_minor")
          .eq("user_id", upserted.data.id)
          .eq("asset_code", DEFAULT_ASSET)
          .maybeSingle(),
        signAuthToken({
          sub: String(upserted.data.id),
          email: upserted.data.email,
          username: upserted.data.username,
          isAdmin: Boolean((upserted.data as DbUserRow).is_admin),
        }),
      ]);
      setCookie(authCookie(token));

      if (walletResult.error) {
        console.warn("telegramLogin: wallet fetch failed", walletResult.error.message);
      }
      const wallet = walletResult.data as WalletBalanceRow | null;
      const balanceMinor = wallet ? Number(wallet.balance_minor ?? 0) : 0;

      return { user: toPublicUser(upserted.data as DbUserRow, balanceMinor) };
    }),

  refreshSession: publicProcedure.mutation(async ({ ctx }) => {
    const { supabase, supabaseService, cookies, setCookie } = ctx;
    const refreshToken = cookies?.[SUPABASE_REFRESH_COOKIE];

    if (!refreshToken) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "REFRESH_TOKEN_MISSING" });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      setCookie(clearCookie(SUPABASE_ACCESS_COOKIE));
      setCookie(clearCookie(SUPABASE_REFRESH_COOKIE));
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: error?.message ?? "REFRESH_FAILED",
      });
    }

    persistSupabaseSession(data.session, setCookie);

    const sessionUserId = data.session.user?.id;
    if (!sessionUserId) {
      setCookie(clearCookie(SUPABASE_ACCESS_COOKIE));
      setCookie(clearCookie(SUPABASE_REFRESH_COOKIE));
      throw new TRPCError({ code: "UNAUTHORIZED", message: "REFRESH_FAILED" });
    }

    try {
      const result = await fetchUserWithBalance(supabaseService, sessionUserId);
      if (!result) {
        setCookie(clearCookie(SUPABASE_ACCESS_COOKIE));
        setCookie(clearCookie(SUPABASE_REFRESH_COOKIE));
        throw new TRPCError({ code: "UNAUTHORIZED", message: "REFRESH_FAILED" });
      }

      const token = await signAuthToken({
        sub: String(result.userRow.id),
        email: result.userRow.email,
        username: result.userRow.username,
        isAdmin: Boolean(result.userRow.is_admin),
      });
      setCookie(authCookie(token));

      return { user: toPublicUser(result.userRow, result.balanceMinor) };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      console.warn("Failed to hydrate user after refresh", err);
      setCookie(clearCookie(SUPABASE_ACCESS_COOKIE));
      setCookie(clearCookie(SUPABASE_REFRESH_COOKIE));
      throw new TRPCError({ code: "UNAUTHORIZED", message: "REFRESH_FAILED" });
    }
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    const { supabaseService, cookies } = ctx;
    const token = cookies?.auth_token;
    if (!token) return null;

    try {
      const payload = await verifyAuthToken(token);
      const result = await fetchUserWithBalance(supabaseService, payload.sub);
      if (!result) return null;
      return toPublicUser(result.userRow, result.balanceMinor);
    } catch {
      return null;
    }
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.setCookie(clearAuthCookie());
    ctx.setCookie(clearCookie(SUPABASE_ACCESS_COOKIE));
    ctx.setCookie(clearCookie(SUPABASE_REFRESH_COOKIE));
    return { success: true };
  }),
});

import { Bot, type Context, webhookCallback } from "grammy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const START_TEXT = `Welcome to YALLA!
Here's what you can do:
- Bet on any event - sports, crypto, politics, memes
- Create your own prediction market in seconds
- Earn fees from markets you create

No initial liquidity needed. No permissions required.
Tap the button below to start predicting ⬇️`;

const getMiniAppUrl = () => process.env.TELEGRAM_MINIAPP_URL?.trim() || null;

const token = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";

const isStartCommandText = (text: string | undefined) => {
  if (!text) return false;
  const trimmed = text.trim();
  // Supports:
  // - /start
  // - /start@BotUsername
  // - /start payload
  // - /start@BotUsername payload
  // - start
  return /^\/?start(?:@[a-zA-Z0-9_]{3,})?(?:\s+.+)?$/i.test(trimmed);
};

const replyWithStart = async (ctx: Context) => {
  const miniAppUrl = getMiniAppUrl();
  if (!miniAppUrl) {
    // Keep /start responsive even if env is temporarily missing/misconfigured.
    console.warn("[telegram webhook] TELEGRAM_MINIAPP_URL is not configured");
    await ctx.reply(START_TEXT);
    return;
  }

  await ctx.reply(START_TEXT, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open Yalla Market",
            web_app: { url: miniAppUrl },
          },
        ],
      ],
    },
  });
};

// Lazy-initialize bot and webhook handler only when token is available.
// This prevents build failures when TELEGRAM_BOT_TOKEN is not set.
let webhookHandler: ((req: Request) => Promise<Response>) | null = null;

function getWebhookHandler() {
  if (webhookHandler) return webhookHandler;
  if (!token) {
    console.warn("[telegram webhook] TELEGRAM_BOT_TOKEN is not configured — webhook disabled.");
    return null;
  }

  const bot = new Bot(token);
  bot.catch((err) => {
    console.error("[telegram webhook] unhandled bot error", err.error);
  });

  bot.on("message:text", async (ctx) => {
    if (!isStartCommandText(ctx.message.text)) return;
    console.info("[telegram webhook] start command received", {
      text: ctx.message.text,
      chatId: ctx.chat?.id,
      fromId: ctx.from?.id,
    });
    await replyWithStart(ctx);
  });
  bot.callbackQuery("start", async (ctx) => {
    await ctx.answerCallbackQuery();
    await replyWithStart(ctx);
  });

  webhookHandler = webhookCallback(bot, "std/http");
  return webhookHandler;
}

export const POST = async (req: Request) => {
  try {
    // Validate Telegram webhook secret token if configured
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
    if (webhookSecret) {
      const headerSecret = req.headers.get("x-telegram-bot-api-secret-token") ?? "";
      if (headerSecret !== webhookSecret) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const handler = getWebhookHandler();
    if (!handler) {
      return new Response("Telegram webhook not configured", { status: 503 });
    }
    return await handler(req);
  } catch (err) {
    console.error("[telegram webhook] POST handler failed", err);
    return new Response("ok");
  }
};

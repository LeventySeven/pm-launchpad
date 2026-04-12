"use client";

import { useState, useCallback } from "react";
import { X, Copy, Send, Check } from "lucide-react";

type ShareCardProps = {
  isOpen: boolean;
  onClose: () => void;
  lang: "RU" | "EN";
  /** The market title to share */
  marketTitle: string;
  /** The market UUID */
  marketId: string;
  /** What action triggered the share card */
  action: "created" | "bet_yes" | "bet_no";
  /** Price at bet time (for bet actions) */
  price?: number;
  /** The Telegram bot username (without @) for deeplinks */
  botUsername?: string;
};

const getTelegram = () =>
  typeof window !== "undefined" ? window.Telegram : undefined;

export default function ShareCard({
  isOpen,
  onClose,
  lang,
  marketTitle,
  marketId,
  action,
  price,
  botUsername,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const bot = botUsername || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "yalla_bot";

  // This deeplink opens the mini app INSIDE Telegram, not in a browser
  const tgDeeplink = `https://t.me/${bot}?startapp=m_${marketId}`;

  // Fallback web URL for non-Telegram contexts
  const webUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/market/${marketId}`;

  const shareText = (() => {
    const title = marketTitle.length > 80 ? marketTitle.slice(0, 77) + "..." : marketTitle;
    if (action === "created") {
      return lang === "RU"
        ? `Я создал прогноз: "${title}" — что думаете?\n${tgDeeplink}`
        : `I created a prediction: "${title}" — what do you think?\n${tgDeeplink}`;
    }
    const side = action === "bet_yes" ? (lang === "RU" ? "ДА" : "YES") : (lang === "RU" ? "НЕТ" : "NO");
    const priceStr = price != null ? ` @ ${(price * 100).toFixed(0)}%` : "";
    return lang === "RU"
      ? `Я поставил ${side}${priceStr} на "${title}". Докажи, что я не прав!\n${tgDeeplink}`
      : `I bet ${side}${priceStr} on "${title}". Prove me wrong!\n${tgDeeplink}`;
  })();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement("textarea");
      ta.value = shareText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  const handleShareTelegram = useCallback(() => {
    const tg = getTelegram()?.WebApp;

    // Method 1: switchInlineQuery — opens Telegram's native chat picker
    // This keeps the user inside Telegram and lets them pick which chat to share to
    if (tg?.switchInlineQuery) {
      tg.switchInlineQuery(shareText, ["users", "groups", "channels"]);
      return;
    }

    // Method 2: openTelegramLink — opens a t.me share URL inside Telegram
    // This also stays inside Telegram (no external browser)
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(tgDeeplink)}&text=${encodeURIComponent(
      shareText.replace(tgDeeplink, "").trim()
    )}`;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(shareUrl);
      return;
    }

    // Method 3: Fallback for non-Telegram contexts (web browser)
    window.open(shareUrl, "_blank");
  }, [shareText, tgDeeplink]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#111111] border-t border-zinc-800/60 rounded-t-2xl overflow-hidden animate-slide-up mb-20"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "60vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="text-sm font-bold text-white">
            {lang === "RU" ? "Поделиться" : "Share"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-zinc-800 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6">
          {/* Preview */}
          <div className="border border-zinc-800/60 bg-zinc-950/40 rounded-xl p-4 mb-4">
            <div className="text-xs text-zinc-500 mb-1">
              {action === "created"
                ? lang === "RU" ? "Вы создали прогноз" : "You created a prediction"
                : lang === "RU" ? "Вы проголосовали" : "You voted"}
            </div>
            <div className="text-sm text-white font-medium">{marketTitle}</div>
            {action !== "created" && price != null && (
              <div className={`text-xs font-semibold mt-1 ${action === "bet_yes" ? "text-[rgba(190,255,29,1)]" : "text-[rgba(245,68,166,1)]"}`}>
                {action === "bet_yes" ? "YES" : "NO"} @ {(price * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Share message preview */}
          <div className="text-xs text-zinc-500 mb-4 whitespace-pre-line break-words bg-zinc-950 rounded-lg p-3 border border-zinc-900">
            {shareText}
          </div>

          {/* Buttons */}
          <button
            type="button"
            onClick={handleShareTelegram}
            className="w-full h-12 rounded-full bg-[rgba(245,68,166,1)] hover:opacity-90 text-white font-semibold text-sm flex items-center justify-center gap-2 transition mb-3"
          >
            <Send size={16} />
            {lang === "RU" ? "Отправить в Telegram" : "Share to Telegram"}
          </button>

          <button
            type="button"
            onClick={() => {
              const xText = encodeURIComponent(shareText.replace(tgDeeplink, "").trim());
              const xUrl = encodeURIComponent(webUrl);
              window.open(`https://x.com/intent/tweet?text=${xText}&url=${xUrl}`, "_blank");
            }}
            className="w-full h-10 rounded-full border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-sm flex items-center justify-center gap-2 transition mb-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            {lang === "RU" ? "Поделиться в X" : "Share to X"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full h-10 rounded-full border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-sm flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied
              ? lang === "RU" ? "Скопировано!" : "Copied!"
              : lang === "RU" ? "Копировать ссылку" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}

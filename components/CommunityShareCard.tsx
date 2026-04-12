"use client";

import { useState, useCallback } from "react";
import { X, Copy, Send, Check, Users, BarChart3 } from "lucide-react";
import { useHaptics } from "../lib/useHaptics";

type CommunityShareCardProps = {
  isOpen: boolean;
  onClose: () => void;
  lang: "RU" | "EN";
  communityName: string;
  communitySlug: string;
  communityDescription: string | null;
  memberCount: number;
  marketCount: number;
  bannerUrl: string | null;
  botUsername?: string;
};

const getTelegram = () =>
  typeof window !== "undefined" ? window.Telegram : undefined;

export default function CommunityShareCard({
  isOpen,
  onClose,
  lang,
  communityName,
  communitySlug,
  communityDescription,
  memberCount,
  marketCount,
  bannerUrl,
  botUsername,
}: CommunityShareCardProps) {
  const [copied, setCopied] = useState(false);
  const { impact } = useHaptics();

  const bot = botUsername || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "yalla_bot";
  const tgDeeplink = `https://t.me/${bot}?startapp=c_${communitySlug}`;
  const webUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/community/${communitySlug}`;

  const shareText = lang === "RU"
    ? `Загляни в «${communityName}» на Yalla Market!\n${tgDeeplink}`
    : `Check out "${communityName}" on Yalla Market!\n${tgDeeplink}`;

  const handleCopy = useCallback(async () => {
    impact("light");
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
  }, [shareText, impact]);

  const handleShareTelegram = useCallback(() => {
    impact("medium");
    const tg = getTelegram()?.WebApp;

    if (tg?.switchInlineQuery) {
      tg.switchInlineQuery(shareText, ["users", "groups", "channels"]);
      return;
    }

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(webUrl)}&text=${encodeURIComponent(
      shareText.replace(tgDeeplink, "").trim()
    )}`;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(shareUrl);
      return;
    }

    window.open(shareUrl, "_blank");
  }, [shareText, tgDeeplink, webUrl, impact]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#111111] border-t border-zinc-800/60 rounded-t-2xl overflow-hidden animate-slide-up mb-20"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "70vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="text-sm font-bold text-white">
            {lang === "RU" ? "Поделиться сообществом" : "Share community"}
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
          {/* Community preview card */}
          <div className="border border-zinc-800/60 bg-zinc-950/40 rounded-xl overflow-hidden mb-4">
            {/* Banner */}
            <div
              className="h-16 w-full"
              style={{
                background: bannerUrl
                  ? `url(${bannerUrl}) center/cover no-repeat`
                  : "linear-gradient(135deg, rgba(245,68,166,0.25) 0%, rgba(190,255,29,0.12) 100%)",
              }}
            />
            <div className="p-3">
              <div className="text-sm font-bold text-white">{communityName}</div>
              {communityDescription && (
                <div className="text-xs text-zinc-500 mt-1 line-clamp-2">{communityDescription}</div>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-[rgba(245,68,166,1)]" />
                  <span className="text-xs font-semibold text-zinc-300">{memberCount}</span>
                  <span className="text-[10px] text-zinc-600">{lang === "RU" ? "участников" : "members"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-[rgba(190,255,29,1)]" />
                  <span className="text-xs font-semibold text-zinc-300">{marketCount}</span>
                  <span className="text-[10px] text-zinc-600">{lang === "RU" ? "рынков" : "markets"}</span>
                </div>
              </div>
            </div>
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
              impact("light");
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

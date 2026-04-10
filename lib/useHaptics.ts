"use client";

import { useRef } from "react";

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type NotificationType = "error" | "success" | "warning";

// Map our types to web-haptics trigger names
const impactToWebHaptics: Record<ImpactStyle, string> = {
  light: "light",
  medium: "medium",
  heavy: "heavy",
  rigid: "heavy",
  soft: "light",
};

const notificationToWebHaptics: Record<NotificationType, string> = {
  success: "success",
  warning: "warning",
  error: "error",
};

export function useHaptics() {
  const webHapticsRef = useRef<{ trigger: (input: string) => void } | null>(null);
  const initAttemptedRef = useRef(false);

  const getTelegramHaptics = () => {
    if (typeof window === "undefined") return null;
    return window.Telegram?.WebApp?.HapticFeedback ?? null;
  };

  const getWebHaptics = () => {
    if (typeof window === "undefined") return null;
    if (webHapticsRef.current) return webHapticsRef.current;
    if (initAttemptedRef.current) return null;
    initAttemptedRef.current = true;
    // Lazy-load web-haptics only when needed (and not in TG)
    try {
      // Dynamic import is async, so we init on first call and it'll be ready for subsequent ones
      import("web-haptics").then(({ WebHaptics }) => {
        webHapticsRef.current = new WebHaptics();
      }).catch(() => { /* silent */ });
    } catch { /* silent */ }
    return null;
  };

  const impact = (style: ImpactStyle = "medium") => {
    const tg = getTelegramHaptics();
    if (tg?.impactOccurred) {
      tg.impactOccurred(style);
      return;
    }
    const wh = getWebHaptics();
    wh?.trigger(impactToWebHaptics[style] ?? "medium");
  };

  const notification = (type: NotificationType) => {
    const tg = getTelegramHaptics();
    if (tg?.notificationOccurred) {
      tg.notificationOccurred(type);
      return;
    }
    const wh = getWebHaptics();
    wh?.trigger(notificationToWebHaptics[type] ?? "success");
  };

  const selection = () => {
    const tg = getTelegramHaptics();
    if (tg?.selectionChanged) {
      tg.selectionChanged();
      return;
    }
    const wh = getWebHaptics();
    wh?.trigger("selection");
  };

  return { impact, notification, selection };
}

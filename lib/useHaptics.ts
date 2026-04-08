"use client";

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type NotificationType = "error" | "success" | "warning";

export function useHaptics() {
  const getHapticFeedback = () => {
    if (typeof window === "undefined") return null;
    return window.Telegram?.WebApp?.HapticFeedback ?? null;
  };

  const impact = (style: ImpactStyle = "medium") => {
    getHapticFeedback()?.impactOccurred?.(style);
  };

  const notification = (type: NotificationType) => {
    getHapticFeedback()?.notificationOccurred?.(type);
  };

  const selection = () => {
    getHapticFeedback()?.selectionChanged?.();
  };

  return { impact, notification, selection };
}

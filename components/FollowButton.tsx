'use client';

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

type FollowButtonProps = {
  isFollowing: boolean;
  isFollowedBy?: boolean;
  onFollow: () => Promise<void>;
  onUnfollow: () => Promise<void>;
  lang: "RU" | "EN";
  size?: "sm" | "md";
};

export default function FollowButton({
  isFollowing,
  isFollowedBy,
  onFollow,
  onUnfollow,
  lang,
  size = "md",
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow();
      } else {
        await onFollow();
      }
    } finally {
      setLoading(false);
    }
  };

  const showUnfollow = isFollowing && hovering && !loading;

  const label = (() => {
    if (loading) return null;
    if (showUnfollow) return lang === "RU" ? "Отписаться" : "Unfollow";
    if (isFollowing) return lang === "RU" ? "Подписка" : "Following";
    if (isFollowedBy) return lang === "RU" ? "Подписаться в ответ" : "Follow back";
    return lang === "RU" ? "Подписаться" : "Follow";
  })();

  const sizeClasses = size === "sm"
    ? "h-8 px-3 text-[11px] gap-1.5"
    : "h-9 px-4 text-xs gap-2";

  const colorClasses = isFollowing
    ? showUnfollow
      ? "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
      : "border-zinc-700 bg-zinc-950/60 text-zinc-200"
    : "border-[rgba(245,68,166,0.6)] bg-[rgba(245,68,166,0.12)] text-[rgba(245,68,166,1)] hover:bg-[rgba(245,68,166,0.20)]";

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-full border font-semibold uppercase tracking-wider transition-all ${sizeClasses} ${colorClasses} disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isFollowing ? (
        showUnfollow ? null : <UserCheck size={14} />
      ) : (
        <UserPlus size={14} />
      )}
      {label}
    </button>
  );
}

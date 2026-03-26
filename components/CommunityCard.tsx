'use client';

import { Users, BarChart3 } from "lucide-react";

type CommunityCardProps = {
  community: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    bannerUrl: string | null;
    category: string | null;
    memberCount: number;
    marketCount: number;
    creatorName: string;
    creatorAvatarUrl: string | null;
  };
  onClick: () => void;
  lang: "RU" | "EN";
};

const hashStringToInt = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export default function CommunityCard({ community, onClick, lang }: CommunityCardProps) {
  const hue = hashStringToInt(community.slug) % 360;
  const gradientA = `hsla(${hue}, 85%, 58%, 0.18)`;
  const gradientB = `hsla(${(hue + 30) % 360}, 85%, 58%, 0.12)`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-zinc-900 bg-black hover:bg-zinc-950/60 transition-all overflow-hidden group"
    >
      {/* Gradient header / banner */}
      <div
        className="h-20 relative overflow-hidden"
        style={{
          backgroundImage: community.bannerUrl
            ? `url(${community.bannerUrl})`
            : `linear-gradient(135deg, ${gradientA}, ${gradientB})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {community.category && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-[10px] font-semibold uppercase tracking-wider text-zinc-200">
            {community.category}
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="text-[15px] font-semibold text-white truncate group-hover:text-zinc-100">
          {community.name}
        </div>
        {community.description && (
          <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
            {community.description}
          </div>
        )}

        <div className="flex items-center gap-3 mt-2.5">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Users size={12} />
            <span>{community.memberCount}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <BarChart3 size={12} />
            <span>{community.marketCount} {lang === "RU" ? "рынков" : "markets"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {community.creatorAvatarUrl ? (
            <img
              src={community.creatorAvatarUrl}
              alt=""
              className="h-4 w-4 rounded-full object-cover"
            />
          ) : (
            <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] text-zinc-400 font-bold">
              {community.creatorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <span className="text-[10px] text-zinc-500 truncate">
            {lang === "RU" ? "от" : "by"} {community.creatorName}
          </span>
        </div>
      </div>
    </button>
  );
}

'use client';

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { trpcClient } from "@/src/utils/trpcClient";
import CommunityCard from "@/components/CommunityCard";
import type { CommunityPublic } from "@/src/server/services/communities";

type DiscoverPageProps = {
  lang: "RU" | "EN";
  onCommunityClick: (slug: string) => void;
  onCreateCommunity: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
};

const CATEGORY_ICONS: Record<string, string> = {
  politics: "🏛️",
  crypto: "₿",
  sports: "⚽",
  entertainment: "🎬",
  science: "🔬",
  business: "💼",
  technology: "💻",
  world: "🌍",
};

export default function DiscoverPage({
  lang,
  onCommunityClick,
  onCreateCommunity,
  isLoggedIn,
  onLogin,
}: DiscoverPageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ category: string; count: number }>>([]);
  const [communities, setCommunities] = useState<CommunityPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await trpcClient.community.categories.query();
      setCategories(cats);
    } catch {
      // Silently fail
    }
  }, []);

  const loadCommunities = useCallback(async (opts?: { category?: string; search?: string }) => {
    const isSearching = !!(opts?.search || opts?.category);
    if (isSearching) setSearchLoading(true);
    else setLoading(true);
    try {
      const result = await trpcClient.community.list.query({
        category: opts?.category ?? undefined,
        search: opts?.search ?? undefined,
        limit: 20,
      });
      setCommunities(result.communities);
    } catch {
      setCommunities([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
    void loadCommunities();
  }, [loadCategories, loadCommunities]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCommunities({
        category: activeCategory ?? undefined,
        search: search.trim() || undefined,
      });
    }, search ? 300 : 0); // Debounce search
    return () => clearTimeout(timer);
  }, [activeCategory, search, loadCommunities]);

  return (
    <div className="px-4 pt-3">
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "RU" ? "Найти сообщество..." : "Find a community..."}
          className="w-full h-10 rounded-full bg-zinc-950 border border-zinc-900 px-4 pl-10 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
        />
        <Search size={16} className="absolute left-3.5 top-3 text-zinc-600" />
        {searchLoading && (
          <Loader2 size={16} className="absolute right-3.5 top-3 text-zinc-600 animate-spin" />
        )}
      </div>

      {/* Create community button */}
      <button
        type="button"
        onClick={isLoggedIn ? onCreateCommunity : onLogin}
        className="w-full mb-4 h-11 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 hover:bg-zinc-950/60 transition flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white"
      >
        <Plus size={16} />
        {lang === "RU" ? "Создать сообщество" : "Create Community"}
      </button>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            {lang === "RU" ? "Категории" : "Categories"}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition ${
                !activeCategory
                  ? "border-[rgba(245,68,166,1)] bg-[rgba(245,68,166,0.12)] text-white"
                  : "border-zinc-900 bg-black text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {lang === "RU" ? "Все" : "All"}
            </button>
            {categories.map((c) => (
              <button
                key={c.category}
                type="button"
                onClick={() => setActiveCategory(activeCategory === c.category ? null : c.category)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition ${
                  activeCategory === c.category
                    ? "border-[rgba(245,68,166,1)] bg-[rgba(245,68,166,0.12)] text-white"
                    : "border-zinc-900 bg-black text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {CATEGORY_ICONS[c.category] ?? ""} {c.category} ({c.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Community grid */}
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
        {activeCategory
          ? activeCategory
          : lang === "RU" ? "Сообщества" : "Communities"}
      </div>
      {loading ? (
        <div className="text-center py-12 text-zinc-500">
          <Loader2 size={20} className="animate-spin mx-auto mb-2" />
          {lang === "RU" ? "Загрузка..." : "Loading..."}
        </div>
      ) : communities.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 pb-8">
          {communities.map((c) => (
            <CommunityCard
              key={c.id}
              community={c}
              onClick={() => onCommunityClick(c.slug)}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500 text-sm">
          {search
            ? lang === "RU" ? "Ничего не найдено" : "No results"
            : lang === "RU" ? "Пока нет сообществ" : "No communities yet"}
        </div>
      )}
    </div>
  );
}

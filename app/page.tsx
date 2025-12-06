'use client';

import { useEffect, useMemo, useState } from "react";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import MarketCard from "@/components/MarketCard";
import MarketPage from "@/components/MarketPage";
import OnboardingModal from "@/components/OnboardingModal";
import { CATEGORIES, MOCK_MARKETS } from "@/constants";
import type { Category, User } from "@/types";
import useTelegramWebApp from "@/hooks/useTelegramWebApp";
import { Search } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const { themeParams, isTelegram } = useTelegramWebApp();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      const timeout = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const handleLogin = () => {
    setUser({
      id: "u1",
      email: "user@pravda.market",
      balance: 1500.0,
    });
    setShowAuth(false);
  };

  // Sync Telegram theme colors when inside a Telegram Mini App.
  useEffect(() => {
    if (!isTelegram || !themeParams) return;
    const root = document.documentElement;
    const defaults = {
      background: "#0a0a0a",
      foreground: "#ffffff",
      accent: "#BEFF1D",
      accentText: "#000000",
    };

    root.style.setProperty(
      "--background",
      themeParams.bg_color ?? defaults.background
    );
    root.style.setProperty(
      "--foreground",
      themeParams.text_color ?? defaults.foreground
    );
    root.style.setProperty(
      "--accent-color",
      themeParams.button_color ?? defaults.accent
    );
    root.style.setProperty(
      "--accent-text-color",
      themeParams.button_text_color ?? defaults.accentText
    );

    return () => {
      root.style.setProperty("--background", defaults.background);
      root.style.setProperty("--foreground", defaults.foreground);
      root.style.setProperty("--accent-color", defaults.accent);
      root.style.setProperty("--accent-text-color", defaults.accentText);
    };
  }, [isTelegram, themeParams]);

  const filteredMarkets = useMemo(
    () =>
      MOCK_MARKETS.filter((market) => {
        const matchesCategory =
          activeCategory === "ALL" || market.category === activeCategory;
        const matchesSearch = market.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [activeCategory, searchQuery]
  );

  const selectedMarket = useMemo(
    () => MOCK_MARKETS.find((market) => market.id === selectedMarketId),
    [selectedMarketId]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Header
        onLoginClick={() => setShowAuth(true)}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>
        {selectedMarket ? (
          <MarketPage
            market={selectedMarket}
            user={user}
            onBack={() => setSelectedMarketId(null)}
            onLogin={() => setShowAuth(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap border
                        ${
                          activeCategory === cat.id
                            ? "bg-[#BEFF1D] text-black border-[#BEFF1D]"
                            : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900 hover:text-white"
                        }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-[#BEFF1D] focus:outline-none"
                />
                <Search
                  size={16}
                  className="absolute left-3.5 top-2.5 text-neutral-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMarkets.length > 0 ? (
                filteredMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    onClick={() => setSelectedMarketId(market.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-neutral-500">
                  <p className="text-lg mb-2">Ничего не найдено</p>
                  <p className="text-sm">Попробуйте другой запрос</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}


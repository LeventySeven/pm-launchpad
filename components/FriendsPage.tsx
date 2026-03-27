'use client';

import React, { useMemo, useState } from 'react';
import { Filter } from "lucide-react";
import Leaderboard from './Leaderboard';
import Referrals from './Referrals';
import type { LeaderboardUser, User } from '../types';

type FriendsTab = 'TOP' | 'REFERRALS';

type FriendsPageProps = {
  lang: 'RU' | 'EN';
  user: User | null;
  leaderboardUsers: LeaderboardUser[];
  leaderboardLoading: boolean;
  leaderboardError: string | null;
  onLogin: () => void;
  onUserClick: (user: LeaderboardUser) => void;
  onCreateReferralLink: () => Promise<{
    referralCode: string;
    referralCommissionRate: number;
    referralEnabled: boolean;
  }>;
  leaderboardSort: 'PNL' | 'BETS';
  onLeaderboardSortChange: (sort: 'PNL' | 'BETS') => void;
  onOpenLeaderboardSort: () => void;
};

const FriendsPage: React.FC<FriendsPageProps> = ({
  lang,
  user,
  leaderboardUsers,
  leaderboardLoading,
  leaderboardError,
  onLogin,
  onUserClick,
  onCreateReferralLink,
  leaderboardSort,
  onLeaderboardSortChange,
  onOpenLeaderboardSort,
}) => {
  const [tab, setTab] = useState<FriendsTab>('TOP');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-32 pb-safe animate-in fade-in duration-300">
      {/* Tab bar */}
      <div className="mb-4 flex items-center gap-1 border border-zinc-900 bg-black rounded-full p-1">
        <button
          type="button"
          onClick={() => setTab('TOP')}
          className={`flex-1 rounded-full py-2 text-[11px] font-bold uppercase tracking-wider transition ${
            tab === 'TOP'
              ? 'bg-zinc-950 text-white border border-zinc-800'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {lang === 'RU' ? 'Топ' : 'Top'}
        </button>
        <button
          type="button"
          onClick={() => setTab('REFERRALS')}
          className={`flex-1 rounded-full py-2 text-[11px] font-bold uppercase tracking-wider transition ${
            tab === 'REFERRALS'
              ? 'bg-zinc-950 text-white border border-zinc-800'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {lang === 'RU' ? 'Рефералы' : 'Referrals'}
        </button>
      </div>

      {/* TOP (Leaderboard) */}
      {tab === 'TOP' && (
        leaderboardLoading ? (
          <div className="py-10 text-center text-zinc-500 text-sm">
            {lang === 'RU' ? 'Загрузка...' : 'Loading...'}
          </div>
        ) : leaderboardError ? (
          <div className="py-10 text-center text-zinc-500 text-sm">
            {leaderboardError}
          </div>
        ) : leaderboardUsers.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 text-sm">
            {lang === 'RU' ? 'Пока нет данных' : 'No data yet'}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {lang === "RU" ? "Фильтр" : "Filter"}
              </div>
              <button
                type="button"
                onClick={onOpenLeaderboardSort}
                className="h-10 w-10 rounded-full border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/70 flex items-center justify-center text-zinc-200 hover:text-white transition-colors"
                aria-label={lang === "RU" ? "Сортировка" : "Sort"}
              >
                <Filter size={16} className="text-zinc-300" />
              </button>
            </div>
            <Leaderboard users={leaderboardUsers} lang={lang} onUserClick={onUserClick} sortBy={leaderboardSort} />
          </>
        )
      )}

      {/* REFERRALS */}
      {tab === 'REFERRALS' && (
        <Referrals user={user} onLogin={onLogin} lang={lang} onCreateReferralLink={onCreateReferralLink} />
      )}
    </div>
  );
};

export default FriendsPage;

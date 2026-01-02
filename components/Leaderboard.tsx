import React, { useState, useEffect } from 'react';
import type { LeaderboardUser } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  users: LeaderboardUser[];
  onUserClick: (user: LeaderboardUser) => void;
  lang: 'RU' | 'EN';
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, onUserClick, lang }) => {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setGlow(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatPnl = (value: number) =>
    `$${value.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 animate-fade-in">
      <div className="text-center mb-8">
        <Trophy 
            size={48} 
            className={`mx-auto mb-4 transition-all duration-1000 ${glow ? 'text-[rgba(36,182,255,1)] drop-shadow-[0_0_8px_rgba(36,182,255,0.35)]' : 'text-neutral-600'}`} 
        />
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-2">
            {lang === 'RU' ? 'Лидерборд' : 'Leaderboard'}
        </h2>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
            {lang === 'RU' ? 'Топ трейдеров по прибыли' : 'Top Traders by Profit'}
        </p>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
            <div 
                key={user.id}
                onClick={() => onUserClick(user)}
                className="bg-neutral-900/40 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-neutral-800/60 transition-colors group"
            >
                {/* Rank (no outline / no badge) */}
                <div
                  className={`w-6 text-center font-mono text-xs tabular-nums ${
                    user.rank === 1 ? 'text-white' : 'text-neutral-500'
                  }`}
                >
                  {user.rank}
                </div>
                
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-black object-cover grayscale" />
                
                <div className="flex-1">
                    <h3 className="font-bold text-white text-sm group-hover:text-[rgba(36,182,255,1)] transition-colors">{user.name}</h3>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        {user.betCount ?? 0} {lang === 'RU' ? 'ставок' : 'bets'}
                    </p>
                </div>

                {/* PnL (numbers only, aligned) */}
                <div
                  className={`w-[140px] text-right font-mono font-bold tabular-nums ${
                    (user.pnl || 0) >= 0 ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]'
                  }`}
                >
                  {(user.pnl || 0) >= 0 ? '+' : ''}
                  {formatPnl(user.pnl || 0)}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

import React from 'react';
import { BarChart3, Compass, User as UserIcon, Newspaper, Plus, LayoutGrid } from 'lucide-react';
import { User } from '../types';

export type ViewType = 'LEADERBOARD' | 'FEED' | 'SOCIAL' | 'PROFILE';

interface BottomMenuProps {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
  lang: 'RU' | 'EN';
  user: User | null;
  onLoginRequest: () => void;
  onCreateMarket?: () => void;
  onAggregatorClick?: () => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ currentView, onChange, lang, user, onLoginRequest, onCreateMarket, onAggregatorClick }) => {

  const handleProtectedClick = (view: ViewType) => {
    if (!user && view === 'PROFILE') {
        onLoginRequest();
    } else {
        onChange(view);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Raised center FAB (+) */}
      {onCreateMarket && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-10">
          <button
            type="button"
            onClick={() => { if (!user) { onLoginRequest(); return; } onCreateMarket(); }}
            className="h-14 w-14 rounded-full bg-[rgba(245,68,166,1)] shadow-lg shadow-pink-500/30 flex items-center justify-center transition hover:opacity-90 active:scale-95 border-4 border-black"
          >
            <Plus size={24} className="text-white" />
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div className="h-16 bg-black/90 backdrop-blur border-t border-zinc-900 flex items-center justify-around">
        <button
          onClick={() => onChange('FEED')}
          className={`flex flex-col items-center justify-center gap-1 w-16 ${
            currentView === 'FEED' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Newspaper size={20} />
          <span className="text-[10px] font-medium">{lang === 'RU' ? 'Лента' : 'Feed'}</span>
        </button>

        <button
          onClick={() => onChange('SOCIAL')}
          className={`flex flex-col items-center justify-center gap-1 w-16 ${
            currentView === 'SOCIAL' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Compass size={20} />
          <span className="text-[10px] font-medium">{lang === 'RU' ? 'Хабы' : 'Hubs'}</span>
        </button>

        {/* Spacer for FAB */}
        <div className="w-16" />

        {onAggregatorClick ? (
          <button
            onClick={onAggregatorClick}
            className="flex flex-col items-center justify-center gap-1 w-16 text-zinc-500 hover:text-zinc-300"
          >
            <LayoutGrid size={20} />
            <span className="text-[10px] font-medium">{lang === 'RU' ? 'Маркет' : 'Market'}</span>
          </button>
        ) : (
          <button
            onClick={() => onChange('LEADERBOARD')}
            className={`flex flex-col items-center justify-center gap-1 w-16 ${
              currentView === 'LEADERBOARD' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BarChart3 size={20} />
            <span className="text-[10px] font-medium">{lang === 'RU' ? 'Топ' : 'Top'}</span>
          </button>
        )}

        <button
          onClick={() => handleProtectedClick('PROFILE')}
          className={`flex flex-col items-center justify-center gap-1 w-16 ${
            currentView === 'PROFILE' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <UserIcon size={20} />
          <span className="text-[10px] font-medium">{lang === 'RU' ? 'Профиль' : 'Profile'}</span>
        </button>
      </div>
    </div>
  );
};

export default BottomMenu;

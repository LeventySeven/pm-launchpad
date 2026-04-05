
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

  const tabClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 ${active ? 'text-white' : 'text-zinc-500'}`;

  return (
    <>
      {/* Raised center FAB (+) — positioned OUTSIDE the nav bar so it floats above */}
      {onCreateMarket && (
        <button
          type="button"
          onClick={() => { if (!user) { onLoginRequest(); return; } onCreateMarket(); }}
          className="fixed z-[81] left-1/2 -translate-x-1/2 bottom-[52px] h-14 w-14 rounded-full bg-[rgba(245,68,166,1)] shadow-lg shadow-pink-500/30 flex items-center justify-center hover:opacity-90 active:scale-95 border-[3px] border-black"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <Plus size={24} className="text-white" />
        </button>
      )}

      {/* Tab bar — fully opaque background */}
      <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-zinc-900 bg-black pb-safe">
        <div className="h-14 flex items-stretch">
          <button onClick={() => onChange('FEED')} className={tabClass(currentView === 'FEED')}>
            <Newspaper size={18} />
            <span className="text-[10px] font-medium leading-none">{lang === 'RU' ? 'Лента' : 'Feed'}</span>
          </button>

          <button onClick={() => onChange('SOCIAL')} className={tabClass(currentView === 'SOCIAL')}>
            <Compass size={18} />
            <span className="text-[10px] font-medium leading-none">{lang === 'RU' ? 'Хабы' : 'Hubs'}</span>
          </button>

          {/* Center spacer for FAB */}
          <div className="flex-1" />

          {onAggregatorClick ? (
            <button onClick={onAggregatorClick} className={tabClass(false)}>
              <LayoutGrid size={18} />
              <span className="text-[10px] font-medium leading-none">{lang === 'RU' ? 'Маркет' : 'Market'}</span>
            </button>
          ) : (
            <button onClick={() => onChange('LEADERBOARD')} className={tabClass(currentView === 'LEADERBOARD')}>
              <BarChart3 size={18} />
              <span className="text-[10px] font-medium leading-none">{lang === 'RU' ? 'Топ' : 'Top'}</span>
            </button>
          )}

          <button onClick={() => handleProtectedClick('PROFILE')} className={tabClass(currentView === 'PROFILE')}>
            <UserIcon size={18} />
            <span className="text-[10px] font-medium leading-none">{lang === 'RU' ? 'Профиль' : 'Profile'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomMenu;

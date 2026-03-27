
import React from 'react';
import { BarChart3, Compass, User as UserIcon, Users, Newspaper } from 'lucide-react';
import { User } from '../types';

export type ViewType = 'LEADERBOARD' | 'FEED' | 'SOCIAL' | 'PROFILE';

interface BottomMenuProps {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
  lang: 'RU' | 'EN';
  user: User | null;
  onLoginRequest: () => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ currentView, onChange, lang, user, onLoginRequest }) => {

  const handleProtectedClick = (view: ViewType) => {
    if (!user && view === 'PROFILE') {
        onLoginRequest();
    } else {
        onChange(view);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur border-t border-zinc-900 flex items-center justify-around z-50 pb-safe">
      <button
        onClick={() => onChange('LEADERBOARD')}
        className={`flex flex-col items-center justify-center gap-1.5 w-20 ${
          currentView === 'LEADERBOARD' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <BarChart3 size={20} />
        <span className="text-[11px] font-medium">{lang === 'RU' ? 'Топ' : 'Top'}</span>
      </button>

      <button
        onClick={() => onChange('FEED')}
        className={`flex flex-col items-center justify-center gap-1.5 w-20 ${
          currentView === 'FEED' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Newspaper size={20} />
        <span className="text-[11px] font-medium">{lang === 'RU' ? 'Лента' : 'Feed'}</span>
      </button>

      <button
        onClick={() => onChange('SOCIAL')}
        className={`flex flex-col items-center justify-center gap-1.5 w-20 ${
          currentView === 'SOCIAL' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Compass size={20} />
        <span className="text-[11px] font-medium">{lang === 'RU' ? 'Хабы' : 'Social'}</span>
      </button>

      <button
        onClick={() => handleProtectedClick('PROFILE')}
        className={`flex flex-col items-center justify-center gap-1.5 w-20 ${
          currentView === 'PROFILE' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <UserIcon size={20} />
        <span className="text-[11px] font-medium">{lang === 'RU' ? 'Профиль' : 'Profile'}</span>
      </button>
    </div>
  );
};

export default BottomMenu;

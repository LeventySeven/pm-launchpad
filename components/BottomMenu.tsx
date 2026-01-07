
import React from 'react';
import { Home, LayoutGrid, Plus, User as UserIcon, Users } from 'lucide-react';
import { User } from '../types';

export type ViewType = 'FRIENDS' | 'FEED' | 'CATALOG' | 'PROFILE';

interface BottomMenuProps {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
  onCreateMarket: () => void;
  lang: 'RU' | 'EN';
  user: User | null;
  onLoginRequest: () => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ currentView, onChange, onCreateMarket, lang, user, onLoginRequest }) => {
  
  const handleProtectedClick = (view: ViewType) => {
    if (!user && view === 'PROFILE') {
        onLoginRequest();
    } else {
        onChange(view);
    }
  };

  const itemBox = (active: boolean) =>
    `h-12 w-16 rounded-2xl bg-[rgba(245,68,166,1)] text-white flex flex-col items-center justify-center gap-1 transition-all ${
      active ? 'opacity-100 shadow-[0_10px_30px_rgba(245,68,166,0.20)]' : 'opacity-65 hover:opacity-90'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur border-t border-zinc-900 flex items-center justify-around z-50 pb-safe">
      <button
        onClick={() => onChange('FRIENDS')}
        className="flex items-center justify-center w-20"
      >
        <div className={itemBox(currentView === 'FRIENDS')}>
          <Users size={20} />
          <span className="text-[11px] font-semibold">{lang === 'RU' ? 'Друзья' : 'Friends'}</span>
        </div>
      </button>

      <button
        onClick={() => onChange('FEED')}
        className="flex items-center justify-center w-20"
      >
        <div className={itemBox(currentView === 'FEED')}>
          <Home size={20} />
          <span className="text-[11px] font-semibold">{lang === 'RU' ? 'Лента' : 'Feed'}</span>
        </div>
      </button>

      <button
        type="button"
        onClick={onCreateMarket}
        className="flex items-center justify-center w-20"
        aria-label={lang === 'RU' ? 'Создать рынок' : 'Create market'}
        title={lang === 'RU' ? 'Создать рынок' : 'Create market'}
      >
        <div className="h-12 w-12 rounded-full bg-[rgba(245,68,166,1)] text-white hover:opacity-90 transition-all shadow-[0_12px_32px_rgba(245,68,166,0.28)] flex items-center justify-center">
          <Plus size={22} />
        </div>
        <span className="sr-only">{lang === 'RU' ? 'Создать рынок' : 'Create market'}</span>
      </button>

      <button
        onClick={() => onChange('CATALOG')}
        className="flex items-center justify-center w-20"
      >
        <div className={itemBox(currentView === 'CATALOG')}>
          <LayoutGrid size={20} />
          <span className="text-[11px] font-semibold">{lang === 'RU' ? 'Каталог' : 'Catalog'}</span>
        </div>
      </button>

      <button
        onClick={() => handleProtectedClick('PROFILE')}
        className="flex items-center justify-center w-20"
      >
        <div className={itemBox(currentView === 'PROFILE')}>
          <UserIcon size={20} />
          <span className="text-[11px] font-semibold">{lang === 'RU' ? 'Профиль' : 'Profile'}</span>
        </div>
      </button>
    </div>
  );
};

export default BottomMenu;

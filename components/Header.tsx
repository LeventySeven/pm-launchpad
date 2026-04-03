import React from 'react';
import { Globe, HelpCircle, Wallet, LayoutGrid } from 'lucide-react';
import Button from './Button';
import { User } from '../types';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  user?: User | null;
  onAuthClick?: () => void;
  lang?: 'RU' | 'EN';
  onToggleLang?: () => void;
  onHelpClick?: () => void;
  onLogoClick?: () => void;
  onAggregatorClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onAuthClick,
  lang = 'RU',
  onToggleLang,
  onHelpClick,
  onLogoClick,
  onAggregatorClick,
}) => {
  const t = {
    home: lang === 'RU' ? 'На главную' : 'Go to home',
    help: lang === 'RU' ? 'Помощь' : 'Help',
    registration: lang === 'RU' ? 'Регистрация' : 'Registration',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-2">
        {/* Logo */}
        <div
          className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${onLogoClick ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={onLogoClick}
          role={onLogoClick ? 'button' : undefined}
          aria-label={onLogoClick ? t.home : undefined}
        >
          <img
            src={"/pink.svg"}
            alt="Yalla"
            className="h-3.5 sm:h-4 w-auto block"
            draggable={false}
          />
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-none uppercase">
            YALLA
          </h1>
        </div>

        {/* Spacer — search moved to catalog filter area */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onAggregatorClick && (
            <button
              type="button"
              onClick={onAggregatorClick}
              className="inline-flex items-center justify-center rounded-full text-xs font-bold transition-colors border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 text-zinc-300 hover:text-white h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5"
              title={lang === 'RU' ? 'Агрегатор' : 'Aggregator'}
            >
              <LayoutGrid size={14} className="text-white" />
              <span className="hidden sm:inline">{lang === 'RU' ? 'Агрегатор' : 'Aggregator'}</span>
            </button>
          )}

          {onHelpClick && (
            <button
              type="button"
              onClick={onHelpClick}
              className="inline-flex items-center justify-center rounded-full transition-colors border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 text-zinc-300 hover:text-white h-8 w-8 sm:h-9 sm:w-9"
              title={t.help}
            >
              <HelpCircle size={14} className="text-white" />
            </button>
          )}

          {onToggleLang && (
            <button
              type="button"
              onClick={onToggleLang}
              className="inline-flex items-center justify-center rounded-full text-xs font-bold transition-colors border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 text-zinc-300 hover:text-white h-8 sm:h-9 px-2.5 sm:px-3 gap-1"
            >
              <Globe size={12} className="text-white" />
              {lang}
            </button>
          )}

          {!user && onAuthClick && (
            <Button type="button" onClick={onAuthClick} className="flex items-center gap-1.5 text-xs sm:text-sm h-8 sm:h-9 px-3">
              <Wallet size={14} />
              <span className="hidden sm:inline">{t.registration}</span>
              <span className="sm:hidden">{lang === 'RU' ? 'Войти' : 'Login'}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

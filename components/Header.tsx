import React from 'react';
import { Search, Globe, HelpCircle } from 'lucide-react';

interface HeaderProps {
  lang: 'RU' | 'EN';
  onToggleLang: () => void;
  onHelpClick: () => void;
}

// Custom Minimalist Normis Icon (Abstract Geometric)
const NormisIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="#BEFF1D" strokeWidth="1.5" strokeOpacity="0.8" />
    <circle cx="12" cy="12" r="3" fill="#BEFF1D" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ lang, onToggleLang, onHelpClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="transition-transform group-hover:rotate-90 duration-500">
            <NormisIcon size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none uppercase group-hover:text-[#BEFF1D] transition-colors">
              NORMIS MARKET
            </h1>
          </div>
        </div>

        {/* Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8 relative">
          <input 
            type="text" 
            placeholder={lang === 'RU' ? "Поиск..." : "Search..."}
            className="flex h-9 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BEFF1D] disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          
          {/* Help Button */}
          <button
            onClick={onHelpClick}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF1D] hover:bg-zinc-800 hover:text-zinc-50 h-9 w-9"
            title={lang === 'RU' ? 'Помощь' : 'Help'}
          >
            <HelpCircle size={16} />
          </button>

          {/* Lang Toggle */}
          <button 
            onClick={onToggleLang}
            className="inline-flex items-center justify-center rounded-md text-xs font-bold ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF1D] border border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white h-9 px-3 gap-2"
          >
            <Globe size={12} />
            {lang}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
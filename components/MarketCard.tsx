import React, { useState, useEffect } from 'react';
import { Market } from '../types';
import { Clock } from 'lucide-react';
import { formatTimeRemaining } from '../lib/time';

interface MarketCardProps {
  market: Market;
  onClick?: () => void;
  lang?: 'RU' | 'EN';
}

const MarketCard: React.FC<MarketCardProps> = ({ market, onClick, lang = 'RU' }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const localizedTitle =
    lang === 'RU'
      ? market.titleRu ?? market.titleEn ?? market.title
      : market.titleEn ?? market.titleRu ?? market.title;
  const isResolved = Boolean(market.outcome);
  const winningYes = market.outcome === 'YES';
  const displayChance = isResolved ? (winningYes ? 100 : 0) : market.chance;
  const yesLabel = lang === 'RU' ? 'Да' : 'Yes';
  const noLabel = lang === 'RU' ? 'Нет' : 'No';
  const chanceLabel = lang === 'RU' ? 'Вероятность' : 'Chance';
  const volLabel = lang === 'RU' ? 'Объем' : 'Vol';

  // Use closesAt for trading deadline, fall back to expiresAt
  const deadline = market.closesAt || market.expiresAt;

  useEffect(() => {
    const update = () => {
      if (isResolved) {
        setTimeLeft(lang === 'RU' ? 'Завершено' : 'Resolved');
        return;
      }
      setTimeLeft(formatTimeRemaining(deadline, 'hours', lang));
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [deadline, lang, isResolved]);

  return (
    <div 
        onClick={onClick}
        className="group relative rounded-2xl border border-zinc-900 bg-black hover:bg-zinc-950/60 transition-colors flex flex-col h-full cursor-pointer overflow-hidden p-4"
    >
      
      {/* NEW Badge - Subtle Outline */}
      {market.isNew && (
          <div className="absolute top-3 left-3 border border-zinc-800 text-zinc-200 text-[9px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wider z-10">
              NEW
          </div>
      )}
      {isResolved && (
          <div className="absolute top-3 right-3 border border-zinc-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider text-zinc-200 bg-black/60">
              {lang === 'RU' ? `Исход: ${winningYes ? 'ДА' : 'НЕТ'}` : `Outcome: ${winningYes ? 'YES' : 'NO'}`}
          </div>
      )}

      {/* Header: Icon + Title */}
      <div className="flex items-start gap-3 mb-3 mt-0.5">
        <img 
          src={market.imageUrl} 
          alt={localizedTitle} 
          className="w-10 h-10 rounded-full bg-zinc-950 object-cover flex-shrink-0 border border-zinc-900"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-zinc-100 leading-snug line-clamp-3">
            {localizedTitle}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="uppercase tracking-wider">{volLabel}</span>
            <span className="text-zinc-400">{market.volume}</span>
            <span className="ml-auto flex items-center gap-1">
              <Clock size={12} />
              <span className="text-zinc-400">{timeLeft}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats: Chance Bar */}
      <div className="mt-auto">
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-bold text-[rgba(36,182,255,1)] leading-none tracking-tight tabular-nums">
            {displayChance}%
          </span>
          <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wide">
            {chanceLabel}
          </span>
        </div>

        <div className="w-full h-1.5 bg-zinc-900 rounded-full mb-3 overflow-hidden flex">
          <div className="h-full bg-[rgba(36,182,255,1)]" style={{ width: `${displayChance}%` }} />
          <div className="h-full bg-[rgba(201,37,28,1)]" style={{ width: `${100 - displayChance}%` }} />
        </div>

        {/* Inline info instead of buttons */}
        <div className="flex items-center justify-between gap-3 text-xs text-zinc-400 tabular-nums">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-[rgba(36,182,255,1)]">{yesLabel}</span>
            <span>${market.yesPrice}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-[rgba(201,37,28,1)]">{noLabel}</span>
            <span>${market.noPrice}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;
import React from 'react';
import type { Bet, Trade, User } from '../types';
import { Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Button from './Button';

interface WalletPageProps {
  user: User | null;
  onLogin: () => void;
  lang: 'RU' | 'EN';
  bets: Bet[];
  soldTrades: Trade[];
  pnlMajor: number;
  onMarketClick?: (marketId: string) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({
  user,
  onLogin,
  lang,
  bets,
  soldTrades,
  pnlMajor,
  onMarketClick,
}) => {
  if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                <Wallet size={32} className="text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-white mb-2">
                {lang === 'RU' ? 'Кошелек недоступен' : 'Wallet Locked'}
            </h2>
            <p className="text-zinc-500 text-sm mb-8">
                {lang === 'RU' ? 'Войдите, чтобы управлять средствами' : 'Please log in to manage your funds'}
            </p>
            <Button onClick={onLogin} variant="primary">{lang === 'RU' ? 'Войти' : 'Log In'}</Button>
        </div>
      );
  }

  const pnlIsPositive = (pnlMajor ?? 0) >= 0;
  const pnlColor = pnlIsPositive ? 'text-[rgba(190,255,29,1)]' : 'text-[rgba(245,68,166,1)]';

  const yesLabel = lang === 'RU' ? 'Да' : 'Yes';
  const noLabel = lang === 'RU' ? 'Нет' : 'No';

  const activeBets = bets.filter((b) => b.status === 'open');
  const settledBets = bets.filter((b) => b.status !== 'open');

  const formatMoney = (value: number) => `${Math.round(value)} VOUTS`;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 animate-in fade-in duration-500">
      
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-8 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-[rgba(245,68,166,1)] opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="text-center relative z-10">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                {lang === 'RU' ? 'Текущий баланс' : 'Current Balance'}
            </span>
            <h1 className="text-4xl sm:text-5xl font-mono font-bold text-white mb-2 tracking-tighter">
                {Math.round(user.balance).toLocaleString()}
            </h1>
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">VOUTS</div>

            {/* TODO: Re-enable Deposit/Withdraw when $ trading launches */}
        </div>
      </div>

      {/* TODO: Re-enable PnL when $ trading launches */}

      {/* Bets (active + completed) */}
      <div className="mb-10 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1">
            {lang === 'RU' ? 'Голоса' : 'Votes'}
          </h3>

          {/* Active */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-1">
              {lang === 'RU' ? 'Активные' : 'Active'}
            </div>
            {activeBets.length === 0 ? (
              <div className="text-sm text-zinc-500 px-1">
                {lang === 'RU' ? 'Нет активных голосов' : 'No active votes'}
              </div>
            ) : (
              <div className="space-y-3">
                {activeBets.map((b) => {
                  const title = (lang === 'RU' ? b.marketTitleRu : b.marketTitleEn) || b.marketTitle;
                  const sideLabel = b.side === 'YES' ? yesLabel : noLabel;
                  const sideColor = b.side === 'YES' ? 'text-[rgba(245,68,166,1)]' : 'text-[rgba(245,68,166,1)]';
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className="w-full text-left border border-zinc-900 bg-black rounded-2xl p-4 hover:bg-zinc-950/40 transition-colors"
                      onClick={() => onMarketClick?.(b.marketId)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-100 truncate">{title}</div>
                          <div className="mt-1 text-xs text-zinc-500 flex items-center gap-2">
                            <span className={`font-semibold ${sideColor}`}>{sideLabel}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="font-mono text-zinc-300">
                              {lang === 'RU' ? 'Куплено на' : 'Bought for'} {formatMoney(b.amount)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-500 flex-shrink-0">
                          {lang === 'RU' ? 'Открыта' : 'Open'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-1">
              {lang === 'RU' ? 'Завершенные' : 'Completed'}
            </div>

            {(settledBets.length === 0 && soldTrades.length === 0) ? (
              <div className="text-sm text-zinc-500 px-1">
                {lang === 'RU' ? 'Нет завершенных голосов' : 'No completed votes'}
              </div>
            ) : (
              <div className="space-y-3">
                {settledBets.map((b) => {
                  const title = (lang === 'RU' ? b.marketTitleRu : b.marketTitleEn) || b.marketTitle;
                  const won = b.status === 'won';
                  const resultLabel =
                    lang === 'RU' ? (won ? 'ВЫИГРЫШ' : 'ПОТЕРЯ') : (won ? 'WON' : 'LOST');
                  const resultColor = won ? 'text-[rgba(245,68,166,1)]' : 'text-[rgba(245,68,166,1)]';
                  const redeem = b.payout ?? 0;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className="w-full text-left border border-zinc-900 bg-black rounded-2xl p-4 hover:bg-zinc-950/40 transition-colors"
                      onClick={() => onMarketClick?.(b.marketId)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-100 truncate">{title}</div>
                          <div className="mt-1 text-xs text-zinc-500 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-zinc-300">
                                {lang === 'RU' ? 'Куплено на' : 'Bought for'} {formatMoney(b.amount)}
                              </span>
                              <span className="text-zinc-600">→</span>
                              <span className="font-mono text-zinc-300">
                                {lang === 'RU' ? 'Погашено на' : 'Redeemed for'} {formatMoney(redeem)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-xs font-semibold uppercase tracking-wider ${resultColor}`}>
                          {resultLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {soldTrades.map((t) => {
                  const title = t.marketTitleRu || t.marketTitleEn || t.marketId;
                  const sharesSold = Math.abs(t.sharesDelta);
                  const avgEntry = t.avgEntryPrice ?? null;
                  const boughtFor = avgEntry !== null ? avgEntry * sharesSold : null;
                  const soldFor = Math.abs(t.collateralNet);
                  const sideLabel = t.outcome === 'YES' ? yesLabel : noLabel;
                  const sideColor = t.outcome === 'YES' ? 'text-[rgba(245,68,166,1)]' : 'text-[rgba(245,68,166,1)]';
                  const resolvedOutcome = t.marketOutcome ? String(t.marketOutcome) : null;
                  const outcomeText =
                    resolvedOutcome === 'YES' ? yesLabel : resolvedOutcome === 'NO' ? noLabel : null;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className="w-full text-left border border-zinc-900 bg-black rounded-2xl p-4 hover:bg-zinc-950/40 transition-colors"
                      onClick={() => onMarketClick?.(t.marketId)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-100 truncate">{title}</div>
                          <div className="mt-1 text-xs text-zinc-500 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${sideColor}`}>{sideLabel}</span>
                              <span className="text-zinc-600">•</span>
                              <span className="font-mono text-zinc-300">
                                {lang === 'RU' ? 'Куплено на' : 'Bought for'}{' '}
                                {boughtFor !== null ? formatMoney(boughtFor) : '—'}
                              </span>
                              <span className="text-zinc-600">→</span>
                              <span className="font-mono text-zinc-300">
                                {lang === 'RU' ? 'Продано за' : 'Sold for'} {formatMoney(soldFor)}
                              </span>
                            </div>
                            {outcomeText && (
                              <div className="text-[11px] text-zinc-500">
                                {lang === 'RU' ? 'Исход события' : 'Event outcome'}: {outcomeText}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-zinc-500 flex-shrink-0">
                          {lang === 'RU' ? 'Продано' : 'Sold'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default WalletPage;
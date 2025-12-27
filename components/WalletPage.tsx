import React from 'react';
import type { Bet, Trade, User, WalletTransaction } from '../types';
import { Wallet, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';
import Button from './Button';

interface WalletPageProps {
  user: User | null;
  onLogin: () => void;
  lang: 'RU' | 'EN';
  bets: Bet[];
  soldTrades: Trade[];
  transactions: WalletTransaction[];
  loadingTransactions: boolean;
  pnlMajor: number;
  onMarketClick?: (marketId: string) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({
  user,
  onLogin,
  lang,
  bets,
  soldTrades,
  transactions,
  loadingTransactions,
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

  const kindLabel = (kind: string) => {
    const k = String(kind).toLowerCase();
    if (k === 'trade') return lang === 'RU' ? 'Сделка' : 'Trade';
    if (k === 'fee') return lang === 'RU' ? 'Комиссия' : 'Fee';
    if (k === 'payout') return lang === 'RU' ? 'Выплата' : 'Payout';
    if (k === 'deposit') return lang === 'RU' ? 'Пополнение' : 'Deposit';
    if (k === 'withdraw') return lang === 'RU' ? 'Вывод' : 'Withdraw';
    if (k === 'referral') return lang === 'RU' ? 'Реферал' : 'Referral';
    return kind;
  };

  const formatTs = (iso: string) =>
    new Date(iso).toLocaleString(lang === 'RU' ? 'ru-RU' : 'en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const yesLabel = lang === 'RU' ? 'Да' : 'Yes';
  const noLabel = lang === 'RU' ? 'Нет' : 'No';

  const activeBets = bets.filter((b) => b.status === 'open');
  const settledBets = bets.filter((b) => b.status !== 'open');

  const txs = transactions.filter((tx) => String(tx.kind).toLowerCase() !== 'fee');

  const formatMoney = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 animate-in fade-in duration-500">
      
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-8 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-[rgba(36,182,255,1)] opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="text-center relative z-10">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                {lang === 'RU' ? 'Текущий баланс' : 'Current Balance'}
            </span>
            <h1 className="text-4xl sm:text-5xl font-mono font-bold text-white mb-8 tracking-tighter">
                ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h1>

            <div className="flex gap-4 justify-center">
                <button className="flex-1 bg-[rgba(36,182,255,1)] hover:opacity-90 text-black font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors text-sm shadow-sm">
                    <ArrowDownLeft size={16} />
                    {lang === 'RU' ? 'Пополнить' : 'Deposit'}
                </button>
                <button className="flex-1 bg-[rgba(201,37,28,1)] hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors border border-[rgba(201,37,28,0.6)] text-sm shadow-sm">
                    <ArrowUpRight size={16} />
                    {lang === 'RU' ? 'Вывести' : 'Withdraw'}
                </button>
            </div>
        </div>
      </div>

      {/* PnL */}
      <div className="mb-8">
        <div className="border border-zinc-900 bg-black rounded-2xl p-5">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
            {lang === 'RU' ? 'Прибыль/Убыток (PnL)' : 'Profit/Loss (PnL)'}
          </div>
          <div className={`text-2xl font-mono font-bold ${pnlIsPositive ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]'}`}>
            {pnlIsPositive ? '+' : '-'}${Math.abs(pnlMajor).toFixed(2)}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {lang === 'RU' ? 'Реализованный PnL по закрытым сделкам' : 'Realized PnL from closed trades'}
          </div>
        </div>
      </div>

      {/* Bets (active + completed) */}
      <div className="mb-10 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1">
            {lang === 'RU' ? 'Ставки' : 'Bets'}
          </h3>

          {/* Active */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-1">
              {lang === 'RU' ? 'Активные' : 'Active'}
            </div>
            {activeBets.length === 0 ? (
              <div className="text-sm text-zinc-500 px-1">
                {lang === 'RU' ? 'Нет активных ставок' : 'No active bets'}
              </div>
            ) : (
              <div className="space-y-3">
                {activeBets.map((b) => {
                  const title = (lang === 'RU' ? b.marketTitleRu : b.marketTitleEn) || b.marketTitle;
                  const sideLabel = b.side === 'YES' ? yesLabel : noLabel;
                  const sideColor = b.side === 'YES' ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]';
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
                {lang === 'RU' ? 'Нет завершенных ставок' : 'No completed bets'}
              </div>
            ) : (
              <div className="space-y-3">
                {settledBets.map((b) => {
                  const title = (lang === 'RU' ? b.marketTitleRu : b.marketTitleEn) || b.marketTitle;
                  const won = b.status === 'won';
                  const resultLabel =
                    lang === 'RU' ? (won ? 'ВЫИГРЫШ' : 'ПОТЕРЯ') : (won ? 'WON' : 'LOST');
                  const resultColor = won ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]';
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
                  const sideColor = t.outcome === 'YES' ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]';
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

      {/* Transactions */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 px-1">
            <History size={14} />
            {lang === 'RU' ? 'История транзакций' : 'Transaction History'}
        </h3>
        
        <div className="space-y-3">
          {loadingTransactions ? (
            <div className="text-sm text-zinc-500 px-1">
              {lang === 'RU' ? 'Загрузка...' : 'Loading...'}
            </div>
          ) : txs.length === 0 ? (
            <div className="text-sm text-zinc-500 px-1">
              {lang === 'RU' ? 'Транзакций пока нет' : 'No transactions yet'}
            </div>
          ) : (
            txs.map((tx) => {
              const isPositive = tx.amountMajor > 0;
              const amountColor = isPositive ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]';
              const iconBg = isPositive
                ? 'bg-[rgba(36,182,255,0.12)] text-[rgba(36,182,255,1)] border-[rgba(36,182,255,0.3)]'
                : 'bg-[rgba(201,37,28,0.10)] text-[rgba(201,37,28,1)] border-[rgba(201,37,28,0.25)]';
              const icon =
                String(tx.kind).toLowerCase() === 'withdraw' ? (
                  <ArrowUpRight size={16} />
                ) : String(tx.kind).toLowerCase() === 'deposit' ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <Wallet size={16} />
                );

              const canOpenMarket = Boolean(tx.marketId) && Boolean(onMarketClick);
              const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
                canOpenMarket ? (
                  <button
                    type="button"
                    onClick={() => tx.marketId && onMarketClick?.(tx.marketId)}
                    className="w-full"
                  >
                    {children}
                  </button>
                ) : (
                  <>{children}</>
                );

              return (
                <Wrapper key={tx.id}>
                  <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl transition-colors hover:bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${iconBg}`}>
                        {icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-zinc-200">
                          {kindLabel(tx.kind)}
                          <span className="text-zinc-500 font-normal"> · {tx.assetCode}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          {formatTs(tx.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${amountColor}`}>
                      {isPositive ? '+' : '-'}{Math.abs(tx.amountMajor).toFixed(2)}
                    </div>
                  </div>
                </Wrapper>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default WalletPage;
import React from 'react';
import { User } from '../types';
import { Wallet, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';
import Button from './Button';

interface WalletPageProps {
  user: User | null;
  onLogin: () => void;
  lang: 'RU' | 'EN';
}

interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW' | 'WIN' | 'BET';
    amount: number;
    date: string;
    status: 'COMPLETED' | 'PENDING';
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'WIN', amount: 138.50, date: '2024-10-15', status: 'COMPLETED' },
    { id: 't2', type: 'BET', amount: -50.00, date: '2024-10-14', status: 'COMPLETED' },
    { id: 't3', type: 'DEPOSIT', amount: 1000.00, date: '2024-10-01', status: 'COMPLETED' },
];

const WalletPage: React.FC<WalletPageProps> = ({ user, onLogin, lang }) => {
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

      {/* Transactions */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 px-1">
            <History size={14} />
            {lang === 'RU' ? 'История транзакций' : 'Transaction History'}
        </h3>
        
        <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg transition-colors hover:bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                          tx.amount > 0
                            ? 'bg-[rgba(36,182,255,0.12)] text-[rgba(36,182,255,1)] border-[rgba(36,182,255,0.3)]'
                            : 'bg-[rgba(201,37,28,0.10)] text-[rgba(201,37,28,1)] border-[rgba(201,37,28,0.25)]'
                        }`}>
                            {tx.type === 'DEPOSIT' && <ArrowDownLeft size={16} />}
                            {tx.type === 'WITHDRAW' && <ArrowUpRight size={16} />}
                            {tx.type === 'WIN' && <Wallet size={16} />}
                            {tx.type === 'BET' && <ArrowUpRight size={16} className="rotate-45"/>}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-zinc-200">
                                {tx.type === 'DEPOSIT' && (lang === 'RU' ? 'Пополнение' : 'Deposit')}
                                {tx.type === 'WITHDRAW' && (lang === 'RU' ? 'Вывод' : 'Withdrawal')}
                                {tx.type === 'WIN' && (lang === 'RU' ? 'Выигрыш' : 'Market Win')}
                                {tx.type === 'BET' && (lang === 'RU' ? 'Ставка' : 'Bet Placed')}
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{tx.date}</div>
                        </div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${tx.amount > 0 ? 'text-[rgba(36,182,255,1)]' : 'text-[rgba(201,37,28,1)]'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default WalletPage;
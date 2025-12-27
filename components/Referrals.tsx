import React, { useState } from 'react';
import { Users, Copy, Check, UserPlus, X } from 'lucide-react';
import Button from './Button';
import { User } from '../types';

interface ReferralsProps {
  user: User | null;
  onLogin: () => void;
  lang: 'RU' | 'EN';
}

const Referrals: React.FC<ReferralsProps> = ({ user, onLogin, lang }) => {
  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friends, setFriends] = useState<string[]>(['SatoshiN', 'ElonFan']); // Mock friends

  const inviteLink = user ? `kachan.market/invite/${user.id}` : '...';

  const handleCopy = () => {
    if (user) {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } else {
        onLogin();
    }
  };

  const handleAddFriend = () => {
      if (!friendName.trim()) return;
      setFriends([...friends, friendName.trim()]);
      setFriendName('');
  };

  const removeFriend = (name: string) => {
      setFriends(friends.filter(f => f !== name));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24 text-center animate-in fade-in duration-500">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 mb-8">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700">
                <Users size={32} className="text-[rgba(36,182,255,1)]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                {lang === 'RU' ? 'Пригласи Друзей' : 'Invite Friends'}
            </h2>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                {lang === 'RU' 
                    ? 'Получайте 30% от комиссий ваших друзей пожизненно. Просто поделитесь ссылкой.' 
                    : 'Earn 30% of your friends\' trading fees forever. Just share your invite link.'}
            </p>

            <div className="bg-black border border-zinc-900 rounded-md p-1.5 flex items-center gap-2 mb-6 relative group focus-within:ring-1 focus-within:ring-[rgba(36,182,255,1)]">
                 <input 
                    readOnly 
                    value={user ? inviteLink : (lang === 'RU' ? 'Войдите чтобы получить ссылку' : 'Log in to get link')} 
                    className="bg-transparent text-sm text-zinc-400 w-full focus:outline-none font-mono px-2"
                 />
                 <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-zinc-800 rounded-sm transition-colors text-zinc-500 hover:text-white"
                 >
                    {copied ? <Check size={16} className="text-[rgba(36,182,255,1)]" /> : <Copy size={16} />}
                 </button>
            </div>

            {!user && (
                <Button onClick={onLogin} fullWidth variant="primary">
                    {lang === 'RU' ? 'Войти' : 'Log In'}
                </Button>
            )}
        </div>

        {user && (
            <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
                        <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block mb-2">
                            {lang === 'RU' ? 'Приглашено' : 'Invited'}
                        </span>
                        <span className="text-2xl font-mono text-white">{user.referrals || 0}</span>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
                        <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block mb-2">
                            {lang === 'RU' ? 'Заработано' : 'Earned'}
                        </span>
                        <span className="text-2xl font-mono text-[rgba(36,182,255,1)]">$0.00</span>
                    </div>
                </div>

                {/* Friends List Section */}
                <div className="text-left">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                        {lang === 'RU' ? 'Мои Друзья' : 'Following'}
                    </h3>
                    
                    {/* Add Friend Input */}
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                            placeholder={lang === 'RU' ? "Никнейм друга..." : "Friend's nickname..."}
                            className="flex h-10 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(36,182,255,1)]"
                        />
                        <button 
                            onClick={handleAddFriend}
                            disabled={!friendName}
                            className="bg-[rgba(36,182,255,1)] text-black rounded-md px-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[rgba(36,182,255,1)]"
                        >
                            <UserPlus size={18} />
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {friends.map((friend, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-zinc-900/30 border border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <img src={`https://ui-avatars.com/api/?name=${friend}&background=random`} className="w-8 h-8 rounded-full border border-zinc-700" alt={friend}/>
                                    <span className="text-sm font-medium text-white">{friend}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-[rgba(36,182,255,1)] font-mono">+12% PnL</span>
                                    <button onClick={() => removeFriend(friend)} className="text-zinc-600 hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {friends.length === 0 && (
                            <div className="text-center text-xs text-zinc-600 py-4">
                                {lang === 'RU' ? 'Список пуст' : 'No friends followed'}
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default Referrals;
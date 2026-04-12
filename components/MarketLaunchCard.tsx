'use client';

import React, { useRef, useState } from 'react';
import { Clock, ImagePlus, Loader2, Send, X } from 'lucide-react';
import type { User } from '../types';

type MarketLaunchCardProps = {
  user: User;
  lang: 'RU' | 'EN';
  onLaunch: (data: { title: string; resolvesAt: string; imageUrl?: string }) => Promise<void>;
  onClose: () => void;
};

const MarketLaunchCard: React.FC<MarketLaunchCardProps> = ({ user, lang, onLaunch, onClose }) => {
  const [title, setTitle] = useState('');
  const [showDeadline, setShowDeadline] = useState(false);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayName = user.name ?? user.username ?? 'You';
  const handle = user.username ? `@${user.username}` : null;
  const avatar = user.avatar ?? user.avatarUrl ?? user.telegramPhotoUrl ?? null;

  const initialsFrom = (value: string) => {
    const parts = value.trim().split(/[\s._-]+/).filter(Boolean);
    const a = parts[0]?.[0] ?? value[0] ?? '?';
    const b = parts[1]?.[0] ?? '';
    return `${a}${b}`.toUpperCase();
  };

  const canLaunch = title.trim().length >= 5 && !uploading;

  const handleLaunch = async () => {
    if (!canLaunch) return;
    setUploading(true);
    setError(null);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        const resp = await fetch('/api/market-image/upload', { method: 'POST', body: fd });
        const data = (await resp.json()) as { imageUrl?: string; error?: string };
        if (!resp.ok || !data.imageUrl) throw new Error(data.error || 'UPLOAD_FAILED');
        imageUrl = data.imageUrl;
      }
      await onLaunch({
        title: title.trim(),
        resolvesAt: new Date(deadline).toISOString(),
        imageUrl,
      });
    } catch {
      setError(lang === 'RU' ? 'Не удалось создать' : 'Failed to create');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden shadow-2xl">
          {/* Creator header */}
          <div className="px-5 pt-5 pb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-200 font-bold text-sm shrink-0">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                initialsFrom(displayName)
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{displayName}</div>
              {handle && <div className="text-xs text-zinc-500 truncate">{handle}</div>}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-zinc-800/60" />

          {/* Question input */}
          <div className="px-5 py-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'RU' ? 'Что произойдёт?' : 'What will happen?'}
              autoFocus
              maxLength={200}
              rows={3}
              className="w-full text-lg font-medium text-white placeholder:text-zinc-600 bg-transparent border-none outline-none resize-none leading-relaxed"
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Deadline display */}
            {showDeadline && (
              <div className="mt-3 flex items-center gap-2">
                <Clock size={14} className="text-zinc-500 shrink-0" />
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="flex-1 h-9 rounded-lg bg-zinc-950 border border-zinc-800 px-3 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowDeadline(false)}
                  className="text-zinc-600 hover:text-zinc-400"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Outcome preview */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{lang === 'RU' ? 'Да' : 'Yes'}</span>
                <span className="text-sm text-zinc-500">50%</span>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{lang === 'RU' ? 'Нет' : 'No'}</span>
                <span className="text-sm text-zinc-500">50%</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-zinc-800/60" />

          {/* Error */}
          {error && (
            <div className="px-5 pt-3 text-xs text-red-400">{error}</div>
          )}

          {/* Bottom toolbar */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setImageFile(f);
                  if (f) {
                    setImagePreview(URL.createObjectURL(f));
                  } else {
                    setImagePreview(null);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9 rounded-full hover:bg-zinc-800/60 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                title={lang === 'RU' ? 'Добавить изображение' : 'Add image'}
              >
                <ImagePlus size={18} />
              </button>
              <button
                type="button"
                onClick={() => setShowDeadline(!showDeadline)}
                className={`h-9 w-9 rounded-full hover:bg-zinc-800/60 flex items-center justify-center transition-colors ${
                  showDeadline ? 'text-[rgba(245,68,166,1)]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={lang === 'RU' ? 'Дедлайн' : 'Deadline'}
              >
                <Clock size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => void handleLaunch()}
              disabled={!canLaunch}
              className="h-10 px-6 rounded-full bg-white hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center gap-2 transition-colors active:scale-95"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {lang === 'RU' ? 'Запуск' : 'Launch'}
                  <Send size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketLaunchCard;

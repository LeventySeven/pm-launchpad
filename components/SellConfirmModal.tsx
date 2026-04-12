'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { useHaptics } from '../lib/useHaptics';

export type SellConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  marketTitle: string;
  outcomeSide: string;
  shares: number;
  estimatedValue: number;
  isLoading?: boolean;
  result?: { payout: number; newBalance: number } | null;
  errorMessage?: string | null;
  lang?: 'RU' | 'EN';
};

export const SellConfirmModal: React.FC<SellConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  marketTitle,
  outcomeSide,
  shares,
  estimatedValue,
  isLoading = false,
  result,
  errorMessage,
  lang = 'EN',
}) => {
  const { notification } = useHaptics();

  useEffect(() => {
    if (!isOpen || isLoading) return;
    if (errorMessage) notification("error");
    else if (result) notification("success");
  }, [isOpen, isLoading, errorMessage, result]);

  if (!isOpen) return null;

  const isError = Boolean(errorMessage);
  const isSuccess = Boolean(result);
  const isConfirm = !isLoading && !isError && !isSuccess;

  const sideUpper = outcomeSide.toUpperCase();
  const sideColor =
    sideUpper === 'YES' || sideUpper === 'ДА'
      ? 'bg-[rgba(190,255,29,1)] border-[rgba(190,255,29,1)] text-black'
      : sideUpper === 'NO' || sideUpper === 'НЕТ'
        ? 'bg-[rgba(245,68,166,1)] border-[rgba(245,68,166,1)] text-white'
        : 'bg-zinc-800 border-zinc-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black border border-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-white mb-3">
          {isLoading
            ? lang === 'RU' ? 'Продаём…' : 'Selling…'
            : isError
              ? lang === 'RU' ? 'Продажа не удалась' : 'Sale failed'
              : isSuccess
                ? lang === 'RU' ? 'Продано' : 'Sold'
                : lang === 'RU' ? 'Подтвердить продажу' : 'Confirm sale'}
        </h2>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-[rgba(245,68,166,1)] animate-spin" />
            <div className="mt-3 text-sm text-zinc-400">
              {lang === 'RU' ? 'Ожидание подтверждения' : 'Waiting for confirmation'}
            </div>
          </div>
        ) : isError ? (
          <p className="text-sm text-red-300 mb-4">{errorMessage}</p>
        ) : isSuccess && result ? (
          <div className="space-y-2 text-sm text-neutral-300">
            <p className="text-sm text-neutral-300 mb-3">
              <span className="font-semibold text-white">{marketTitle}</span>
            </p>
            <div className="flex justify-between">
              <span className="text-neutral-500">{lang === 'RU' ? 'Выплата' : 'Payout'}</span>
              <span className="font-semibold font-mono text-white">{Math.round(result.payout)} VOTES</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{lang === 'RU' ? 'Новый баланс' : 'New balance'}</span>
              <span className="font-semibold font-mono text-zinc-100">{Math.round(result.newBalance)} VOTES</span>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-300 mb-4">
              <span className="font-semibold text-white">{marketTitle}</span>
            </p>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">{lang === 'RU' ? 'Позиция' : 'Position'}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${sideColor}`}>
                  {outcomeSide}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{lang === 'RU' ? 'Голосов' : 'Votes'}</span>
                <span className="font-semibold font-mono">{Math.round(shares)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{lang === 'RU' ? 'Возврат' : 'Return'}</span>
                <span className="font-semibold font-mono text-white">{Math.round(estimatedValue)} VOTES</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-3">
              {lang === 'RU'
                ? 'Фактическая выплата может незначительно отличаться.'
                : 'Actual payout may differ slightly.'}
            </p>
          </>
        )}

        {!isLoading && (
          <div className="mt-6 flex gap-3">
            {isConfirm ? (
              <>
                <Button
                  fullWidth
                  onClick={onClose}
                  className="!bg-zinc-900 !text-zinc-300 hover:!bg-zinc-800"
                >
                  {lang === 'RU' ? 'Отмена' : 'Cancel'}
                </Button>
                <Button fullWidth onClick={onConfirm}>
                  {lang === 'RU' ? 'Продать' : 'Confirm'}
                </Button>
              </>
            ) : (
              <div className="flex justify-end w-full">
                <Button onClick={onClose}>OK</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellConfirmModal;

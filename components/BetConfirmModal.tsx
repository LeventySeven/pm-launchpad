'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { useHaptics } from '../lib/useHaptics';

export type BetConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  side: 'YES' | 'NO';
  amount: number;
  newBalance?: number;
  errorMessage?: string | null;
  isLoading?: boolean;
};

export const BetConfirmModal: React.FC<BetConfirmModalProps> = ({
  isOpen,
  onClose,
  marketTitle,
  side,
  amount,
  newBalance,
  errorMessage,
  isLoading = false,
}) => {
  const { notification } = useHaptics();

  useEffect(() => {
    if (!isOpen || isLoading) return;
    if (errorMessage) notification("error");
    else notification("success");
  }, [isOpen, isLoading, errorMessage]);

  if (!isOpen) return null;

  const isError = Boolean(errorMessage);
  const sideColor = side === 'YES' ? 'text-[rgba(190,255,29,1)]' : 'text-[rgba(245,68,166,1)]';

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
          {isLoading ? 'Voting…' : isError ? 'Vote not accepted' : 'Vote placed'}
        </h2>
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-[rgba(245,68,166,1)] animate-spin" />
            <div className="mt-3 text-sm text-zinc-400">Waiting for confirmation</div>
          </div>
        ) : isError ? (
          <p className="text-sm text-red-300 mb-4">{errorMessage}</p>
        ) : (
          <>
            <p className="text-sm text-neutral-300 mb-4">
              You voted on:
              <br />
              <span className="font-semibold text-white">{marketTitle}</span>
            </p>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Vote</span>
                <span
                  className={`font-semibold ${sideColor}`}
                >
                  {side}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Cost</span>
                <span className="font-semibold">{Math.round(amount)} VOTE</span>
              </div>
              {newBalance !== undefined && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Balance</span>
                  <span className="font-semibold text-zinc-100">{Math.round(newBalance)} VOTES</span>
                </div>
              )}
            </div>
          </>
        )}
        {!isLoading && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>OK</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetConfirmModal;

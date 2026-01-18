'use client';

import React, { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';
import { X, AlertTriangle } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

const PRIORITY: string[] = ['Phantom', 'Solflare', 'WalletConnect'];

export default function SolanaWalletConnectModal({
  open,
  onClose,
  title = 'Connect wallet',
}: Props) {
  const { wallets, select, connect, connecting } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [localConnecting, setLocalConnecting] = useState(false);

  const sorted = useMemo(() => {
    const score = (name: string) => {
      const idx = PRIORITY.indexOf(name);
      return idx === -1 ? 999 : idx;
    };
    return [...wallets].sort((a, b) => {
      const an = String(a.adapter.name);
      const bn = String(b.adapter.name);
      const sa = score(an);
      const sb = score(bn);
      if (sa !== sb) return sa - sb;
      return an.localeCompare(bn);
    });
  }, [wallets]);

  if (!open) return null;

  type ConnectError = Error | string | { message?: string } | null | undefined;
  const toErrorMessage = (e: ConnectError): string => {
    if (!e) return 'Wallet connection failed';
    if (typeof e === 'string') return e;
    if (e instanceof Error) return e.message || 'Wallet connection failed';
    if (typeof e === 'object' && typeof e.message === 'string') return e.message;
    return 'Wallet connection failed';
  };

  const handleSelect = (name: WalletName) => {
    setError(null);
    setSelectedName(String(name));
    setLocalConnecting(true);
    select(name);
    // Let `select()` apply, then connect.
    setTimeout(() => {
      const timeout = setTimeout(() => {
        // WalletConnect sometimes opens a second modal; keep our UI informative rather than "frozen".
        setError((prev) => prev ?? 'Still waiting for wallet… If you have Phantom/Solflare installed, it should open now.');
      }, 6000);

      connect()
        .then(() => {
          clearTimeout(timeout);
          setLocalConnecting(false);
          onClose();
        })
        .catch((e: ConnectError) => {
          clearTimeout(timeout);
          setLocalConnecting(false);
          setError(toErrorMessage(e));
        });
    }, 0);
  };

  return (
    <>
      {!localConnecting && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60"
          onClick={onClose}
          aria-label="Close wallet modal"
        />
      )}

      <div
        // Mobile: bottom-sheet (prevents crooked alignment). Desktop: anchored popover.
        className="fixed inset-x-0 bottom-0 z-50 w-full rounded-t-2xl border border-zinc-900 bg-black shadow-2xl sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:inset-x-auto sm:bottom-auto sm:w-[420px] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 p-4 border-b border-zinc-900">
          <div className="min-w-0">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{title}</div>
            <div className="text-sm text-zinc-300 mt-1">
              {localConnecting
                ? `Connecting${selectedName ? `: ${selectedName}` : ''}…`
                : 'Choose a wallet (Phantom / Solflare / WalletConnect)'}
            </div>
          </div>
          <button
            type="button"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 text-zinc-200"
            onClick={onClose}
            aria-label="Close"
            disabled={localConnecting || connecting}
          >
            <X size={16} />
          </button>
        </div>

        {error ? (
          <div className="p-4 border-b border-zinc-900 text-sm text-zinc-300 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 text-[rgba(245,68,166,1)]" />
            <div className="min-w-0">
              <div className="font-semibold">Wallet connection failed</div>
              <div className="text-zinc-500 break-words">{error}</div>
            </div>
          </div>
        ) : null}

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {sorted.map((w) => {
              const name = w.adapter.name;
              const icon = w.adapter.icon;
              const isSelected = selectedName === String(name);
              return (
                <button
                  key={String(name)}
                  type="button"
                  disabled={connecting || localConnecting}
                  onClick={() => handleSelect(name)}
                  className={`w-full flex items-center gap-3 rounded-xl border border-zinc-900 transition-colors px-4 py-3 text-left disabled:opacity-60 disabled:cursor-not-allowed ${
                    isSelected ? 'bg-zinc-950/80' : 'bg-zinc-950/40 hover:bg-zinc-950/60'
                  }`}
                >
                  {icon ? (
                    // icon is often a data: URL
                    <img src={icon} alt="" className="h-7 w-7 rounded-full bg-black" />
                  ) : (
                    <div className="h-7 w-7 rounded-full border border-zinc-800 bg-black" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{String(name)}</div>
                    <div className="text-xs text-zinc-500">
                      {localConnecting && isSelected ? 'Connecting…' : 'Tap to connect'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}


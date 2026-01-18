'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { WalletReadyState, WalletNotReadyError } from '@solana/wallet-adapter-base';

type Props = {
  className?: string;
  connectedLabel?: string;
  connectLabel?: string;
};

type ConnectError = Error | { message?: string } | string | null | undefined;

const toErrorMessage = (e: ConnectError): string => {
  if (!e) return 'Wallet connection failed';
  if (typeof e === 'string') return e;
  if (e instanceof Error) return e.message || 'Wallet connection failed';
  if (typeof e === 'object' && typeof e.message === 'string') return e.message;
  return 'Wallet connection failed';
};

function openPhantomBrowse(urlToOpen: string) {
  const url = encodeURIComponent(urlToOpen);
  const ref = encodeURIComponent(window.location.origin);
  const deepLink = `https://phantom.app/ul/browse/${url}?ref=${ref}`;

  // Telegram in-app browser: use their API if available.
  const tg = (window as any).Telegram?.WebApp;
  if (tg && typeof tg.openLink === 'function') {
    tg.openLink(deepLink);
    return;
  }

  window.location.href = deepLink;
}

export default function ConnectSolanaWalletButton({
  className,
  connectedLabel = 'Change',
  connectLabel = 'Connect',
}: Props) {
  const { setVisible } = useWalletModal();
  const { wallet, connected, connecting, connect } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const label = useMemo(() => {
    if (connecting) return 'Connecting…';
    if (connected) return connectedLabel;
    if (wallet) return connectLabel;
    return connectLabel;
  }, [connected, connectedLabel, connectLabel, connecting, wallet]);

  const onClick = useCallback(() => {
    setError(null);

    if (connected) {
      setVisible(true);
      return;
    }

    if (!wallet) {
      setVisible(true);
      return;
    }

    // In Telegram webviews, Phantom typically isn't "Installed" (no injection).
    // If Phantom is selected but not detected, follow Phantom's own universal-link flow:
    // open this dapp inside Phantom in-wallet browser.
    if (
      wallet.adapter.name === 'Phantom' &&
      wallet.readyState === WalletReadyState.NotDetected &&
      typeof window !== 'undefined'
    ) {
      openPhantomBrowse(window.location.href);
      return;
    }

    connect().catch((e: unknown) => {
      if (e instanceof WalletNotReadyError) {
        // If the wallet isn't ready, fall back to the modal so user can pick another option.
        setVisible(true);
        return;
      }
      setError(toErrorMessage(e as ConnectError));
    });
  }, [connected, connect, setVisible, wallet]);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={connecting}
        className={className}
      >
        {label}
      </button>
      {error ? <div className="text-[11px] text-red-300 max-w-[220px] text-right">{error}</div> : null}
    </div>
  );
}


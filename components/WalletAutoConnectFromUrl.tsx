'use client';

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';

const PARAM = 'walletAutoConnect';
const WALLET_PHANTOM = 'Phantom' as WalletName<'Phantom'>;

function removeParamFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(PARAM)) return;
    url.searchParams.delete(PARAM);
    window.history.replaceState({}, '', url.toString());
  } catch {
    // ignore
  }
}

export default function WalletAutoConnectFromUrl() {
  const { connected, wallet, select, connect } = useWallet();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (connected) {
      removeParamFromUrl();
      return;
    }

    let flag: string | null = null;
    try {
      flag = new URL(window.location.href).searchParams.get(PARAM);
    } catch {
      flag = null;
    }
    if (!flag) return;

    // Currently only used for Phantom browse deep link.
    if (flag === 'phantom') {
      if (!wallet || wallet.adapter.name !== 'Phantom') {
        select(WALLET_PHANTOM);
      }
      // Connect on next tick so `select()` can apply.
      setTimeout(() => {
        connect()
          .then(() => removeParamFromUrl())
          .catch(() => {
            // Keep the param; user may retry manually.
          });
      }, 0);
    }
  }, [connected, wallet, select, connect]);

  return null;
}


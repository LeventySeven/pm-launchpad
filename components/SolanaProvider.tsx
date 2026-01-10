'use client';

import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    // Use a more reliable RPC endpoint
    return clusterApiUrl(network);
    // Alternative: use a custom RPC endpoint
    // return 'https://api.devnet.solana.com';
  }, [network]);

  // Configure wallets - memoize to prevent unnecessary re-renders
  const wallets = useMemo(
    () => {
      const adapters = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new TorusWalletAdapter(),
        // LedgerWalletAdapter requires additional setup, so it's commented out by default
        // new LedgerWalletAdapter(),
      ];

      return adapters;
    },
    // Re-initialize wallets if network changes
    [network]
  );

  // Check if we're in a Telegram environment
  // In Telegram Mini Apps, autoConnect may not work well with browser extensions
  const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={!isTelegram}
        localStorageKey="solana-wallet-adapter"
        onError={(error) => {
          // Only log errors in development
          if (process.env.NODE_ENV === 'development') {
            console.error('Solana Wallet Adapter Error:', error);
          }
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

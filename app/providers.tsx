'use client';

import { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, initializeAppKit } from '@/lib/appKit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize only on the client
    if (typeof window !== 'undefined') {
      initializeAppKit();
    }
  }, []);

  return (
    // reconnectOnMount ensures we rehydrate the WalletConnect session (persisted by AppKit/Wagmi)
    // so users don't need to reconnect on refresh/app reopen.
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

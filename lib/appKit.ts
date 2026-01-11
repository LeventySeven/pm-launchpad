import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, base, polygon } from '@reown/appkit/networks';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined');
}

const metadata = {
  name: 'Yalla Market',
  description: 'Prediction market demo',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://yalla-market.com',
  icons: [],
};

const networks = [mainnet, arbitrum, base, polygon];

const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId,
  networks,
});

// CRITICAL: Initialize here, but only on the client
type AppKitInstance = ReturnType<typeof createAppKit>;
let appKitModal: AppKitInstance | null = null;

export function initializeAppKit(): AppKitInstance {
  if (appKitModal) return appKitModal;

  // Type assertion needed due to networks array type incompatibility between @reown/appkit/networks and createAppKit
  // This is a known type compatibility issue with the package
  appKitModal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    metadata,
    features: {
      analytics: false,
      email: false,
      socials: [],
    },
    themeMode: 'dark',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  return appKitModal;
}

export { wagmiAdapter };

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

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

// Local-only for now:
// - Default to local Hardhat chain (31337) for development/testing.
// NOTE: Many wallets require you to add the local RPC manually (MetaMask: "Add network" -> localhost:8545).
const hardhatLocal = {
  id: 31337,
  name: 'Hardhat (Local)',
  network: 'hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: '' },
  },
  testnet: true,
};

const networks = [hardhatLocal];

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

// Export for Wagmi hooks usage across the app.
export const wagmiConfig = wagmiAdapter.wagmiConfig;
export { wagmiAdapter };

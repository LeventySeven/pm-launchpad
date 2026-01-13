
export type Category = 'ALL' | 'POLITICS' | 'CRYPTO' | 'CELEBS' | 'SCIENCE' | 'SOCIAL' | 'MUSIC' | 'ELECTIONS' | 'WORLD';

export interface HistoryPoint {
  date: string;
  value: number; // 0 to 100
}

export interface Comment {
  id: string;
  userId: string;
  username: string | null;
  user: string;
  avatar: string;
  text: string;
  createdAt: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  parentId?: string | null;
}

export interface UserCommentSummary {
  id: string;
  marketId: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  marketTitleRu: string;
  marketTitleEn: string;
  likesCount: number;
}

export type MarketState = "open" | "closed" | "resolved" | "cancelled";

export interface Market {
  id: string;
  title: string;
  titleRu: string | null;
  titleEn: string;
  state: MarketState;
  outcome: "YES" | "NO" | null;
  createdBy?: string | null;
  categoryId: string | null;
  categoryLabelRu: string | null;
  categoryLabelEn: string | null;
  imageUrl: string;
  volume: string;
  closesAt: string; // Trading stops
  expiresAt: string; // Event end
  yesPrice: number;
  noPrice: number;
  chance: number; // Percentage for YES
  description: string;
  history: HistoryPoint[];
  comments: Comment[];
  isNew?: boolean;
  // LMSR specific
  liquidityB?: number;
  feeBps?: number;
  settlementAsset?: string;
}

/**
 * User position in a market (shares held)
 */
export interface Position {
  marketId: string;
  outcome: "YES" | "NO";
  shares: number;
  avgEntryPrice: number | null;
  marketTitleRu: string;
  marketTitleEn: string;
  marketState: MarketState;
  marketOutcome: "YES" | "NO" | null;
  closesAt: string | null;
  expiresAt: string | null;
}

/**
 * Trade record (buy or sell)
 */
export interface Trade {
  id: string;
  marketId: string;
  action: "buy" | "sell";
  outcome: "YES" | "NO";
  collateralGross: number;
  fee: number;
  collateralNet: number;
  sharesDelta: number;
  priceBefore: number;
  priceAfter: number;
  createdAt: string;
  marketTitleRu: string;
  marketTitleEn: string;
  marketState: MarketState;
  marketOutcome: "YES" | "NO" | null;
  avgEntryPrice?: number | null;
  avgExitPrice?: number | null;
  realizedPnl?: number | null;
}

/**
 * Legacy Bet type - mapped from Position for backwards compatibility
 */
export interface Bet {
  id: string;
  marketId: string;
  marketTitle: string;
  marketTitleRu: string;
  marketTitleEn: string;
  side: "YES" | "NO";
  amount: number;
  status: "open" | "won" | "lost";
  payout: number | null;
  createdAt: string;
  marketOutcome: "YES" | "NO" | null;
  expiresAt: string | null;
  priceYes: number | null;
  priceNo: number | null;
  priceAtBet: number | null;
  shares: number | null;
}

export interface User {
  id: string;
  email?: string;
  username?: string;
  walletAddress?: string | null; // Connected EVM wallet address
  chainId?: number | null; // Current chain ID (1=Ethereum, 11155111=Sepolia)
  walletConnectedAt?: string | null; // When wallet was connected
  balance: number; // In major units (e.g., 1.5 VCOIN)
  isAdmin?: boolean;
  pnl?: number; // Total Profit/Loss
  name?: string; // Display name
  avatarUrl?: string | null; // user-controlled avatar URL
  telegramPhotoUrl?: string | null; // Telegram-provided photo URL (fallback)
  referralCode?: string | null;
  referralCommissionRate?: number | null;
  referralEnabled?: boolean | null;
  createdAt?: string;
  referrals?: number;
  avatar?: string;
}

export interface WalletTransaction {
  id: string;
  assetCode: string;
  amountMinor: number;
  amountMajor: number;
  kind: string;
  marketId: string | null;
  tradeId: string | null;
  createdAt: string;
}

export type { LeaderboardUser } from "./src/schemas/leaderboard";

export interface PublicTrade {
  id: string;
  marketId: string;
  action: "buy" | "sell";
  outcome: "YES" | "NO";
  collateralGross: number;
  sharesDelta: number;
  priceBefore: number;
  priceAfter: number;
  createdAt: string;
}

/**
 * Wallet balance (multi-asset support)
 */
export interface WalletBalance {
  assetCode: string;
  balanceMinor: number;
  balanceMajor: number;
  decimals: number;
}

/**
 * Price candle for charts
 */
export interface PriceCandle {
  bucket: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradesCount: number;
}

// ============================================================================
// WalletConnect / On-Chain Types
// ============================================================================

export type OnChainTxStatus = "pending" | "confirmed" | "failed";
export type OnChainTxType = "deposit" | "bet" | "sell" | "claim" | "withdraw" | "approve";
export type DepositStatus = "pending" | "confirmed" | "failed" | "credited";

/**
 * On-chain transaction record
 */
export interface OnChainTransaction {
  id: string;
  userId: string;
  txHash: string;
  chainId: number;
  status: OnChainTxStatus;
  txType: OnChainTxType;
  amountMinor: number | null;
  amountMajor: number | null;
  assetCode: string | null;
  marketId: string | null;
  tradeId: string | null;
  blockNumber: number | null;
  blockTimestamp: string | null;
  errorMessage: string | null;
  createdAt: string;
  confirmedAt: string | null;
}

/**
 * Deposit record
 */
export interface Deposit {
  id: string;
  userId: string;
  txHash: string;
  chainId: number;
  amountMinor: number;
  amountMajor: number;
  assetCode: string;
  status: DepositStatus;
  fromAddress: string;
  blockNumber: number | null;
  creditedAt: string | null;
  createdAt: string;
}

/**
 * Chain configuration
 */
export interface ChainConfig {
  chainId: number;
  name: string;
  isTestnet: boolean;
  vaultAddress: string;
  usdcAddress: string;
  usdtAddress: string;
  explorerUrl: string;
  rpcUrl: string;
}

/**
 * Supported chains
 */
export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  // Sepolia Testnet
  11155111: {
    chainId: 11155111,
    name: "Sepolia",
    isTestnet: true,
    vaultAddress: "", // To be set after deployment
    usdcAddress: "", // To be set after deployment
    usdtAddress: "", // To be set after deployment
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/",
  },
  // Ethereum Mainnet (future)
  1: {
    chainId: 1,
    name: "Ethereum",
    isTestnet: false,
    vaultAddress: "", // To be set after deployment
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Official USDC
    usdtAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Official USDT
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
  },
};

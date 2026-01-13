/**
 * Contract addresses for different networks
 * Update these after deployment
 */

export type SupportedChainId = 11155111 | 1 | 31337;

export interface ContractAddresses {
  vault: `0x${string}`;
  usdc: `0x${string}`;
  usdt?: `0x${string}`;
}

// Placeholder addresses - UPDATE AFTER DEPLOYMENT
export const CONTRACT_ADDRESSES: Record<SupportedChainId, ContractAddresses> = {
  // Sepolia Testnet
  11155111: {
    vault: (process.env.NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA as `0x${string}`) || "0x0000000000000000000000000000000000000000",
    usdc: (process.env.NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA as `0x${string}`) || "0x0000000000000000000000000000000000000000",
  },
  
  // Ethereum Mainnet
  1: {
    vault: (process.env.NEXT_PUBLIC_VAULT_ADDRESS_MAINNET as `0x${string}`) || "0x0000000000000000000000000000000000000000",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Official USDC on Ethereum
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Official USDT on Ethereum
  },
  
  // Local Hardhat (for development)
  31337: {
    vault: "0x0000000000000000000000000000000000000000",
    usdc: "0x0000000000000000000000000000000000000000",
  },
};

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: number): ContractAddresses | null {
  if (chainId in CONTRACT_ADDRESSES) {
    return CONTRACT_ADDRESSES[chainId as SupportedChainId];
  }
  return null;
}

/**
 * Check if a chain is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in CONTRACT_ADDRESSES;
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerTxUrl(chainId: number, txHash: string): string {
  switch (chainId) {
    case 11155111:
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 1:
      return `https://etherscan.io/tx/${txHash}`;
    default:
      return "";
  }
}

/**
 * Get explorer URL for an address
 */
export function getExplorerAddressUrl(chainId: number, address: string): string {
  switch (chainId) {
    case 11155111:
      return `https://sepolia.etherscan.io/address/${address}`;
    case 1:
      return `https://etherscan.io/address/${address}`;
    default:
      return "";
  }
}

/**
 * Get chain name
 */
export function getChainName(chainId: number): string {
  switch (chainId) {
    case 11155111:
      return "Sepolia";
    case 1:
      return "Ethereum";
    case 31337:
      return "Localhost";
    default:
      return "Unknown";
  }
}

/**
 * Check if chain is testnet
 */
export function isTestnet(chainId: number): boolean {
  return chainId === 11155111 || chainId === 31337;
}

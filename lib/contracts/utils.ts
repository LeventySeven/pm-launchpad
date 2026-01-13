import { keccak256, toBytes, formatUnits, parseUnits } from "viem";

/**
 * Convert a UUID string to bytes32 for contract calls
 * This should match the contract's uuidToBytes32 function
 */
export function uuidToBytes32(uuid: string): `0x${string}` {
  // Use keccak256 hash of the UUID string
  return keccak256(toBytes(uuid));
}

/**
 * Convert outcome string to contract uint8
 */
export function outcomeToUint8(outcome: "YES" | "NO"): number {
  return outcome === "YES" ? 1 : 2;
}

/**
 * Convert contract uint8 to outcome string
 */
export function uint8ToOutcome(value: number): "YES" | "NO" | "CANCELLED" | "UNRESOLVED" {
  switch (value) {
    case 1:
      return "YES";
    case 2:
      return "NO";
    case 3:
      return "CANCELLED";
    default:
      return "UNRESOLVED";
  }
}

/**
 * Format token amount from minor units (e.g., 6 decimals for USDC)
 */
export function formatTokenAmount(amount: bigint, decimals: number = 6): string {
  return formatUnits(amount, decimals);
}

/**
 * Parse token amount to minor units
 */
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
  return parseUnits(amount, decimals);
}

/**
 * Calculate deadline timestamp (current time + seconds)
 */
export function calculateDeadline(secondsFromNow: number = 3600): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + secondsFromNow);
}

/**
 * Check if deadline has passed
 */
export function isDeadlinePassed(deadline: bigint): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) > deadline;
}

/**
 * Truncate address for display (0x1234...5678)
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): address is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format gas price from wei to Gwei
 */
export function formatGasPrice(gasPriceWei: bigint): string {
  return formatUnits(gasPriceWei, 9);
}

/**
 * Estimate transaction time based on gas price tier
 */
export function estimateTxTime(gasPriceGwei: number): string {
  if (gasPriceGwei > 100) return "~15 seconds";
  if (gasPriceGwei > 50) return "~30 seconds";
  if (gasPriceGwei > 20) return "~1 minute";
  return "~2-5 minutes";
}

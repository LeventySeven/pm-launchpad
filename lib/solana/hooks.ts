"use client";

import { useCallback, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// Account data layout constants
const POSITION_SEED = Buffer.from("position");
const MARKET_SEED = Buffer.from("market");

// Account data offsets (after 8-byte discriminator)
// Position: market (32) + user (32) + shares_yes (8) + shares_no (8) + bump (1)
const POSITION_SHARES_YES_OFFSET = 8 + 32 + 32;
const POSITION_SHARES_NO_OFFSET = 8 + 32 + 32 + 8;

// Market: uuid (16) + outcome (1) + q_yes (8) + q_no (8) + b (8) + bump (1)
const MARKET_OUTCOME_OFFSET = 8 + 16;
const MARKET_Q_YES_OFFSET = 8 + 16 + 1;
const MARKET_Q_NO_OFFSET = 8 + 16 + 1 + 8;
const MARKET_B_OFFSET = 8 + 16 + 1 + 8 + 8;

/**
 * Convert UUID string to 16-byte buffer for PDA derivation
 */
function uuidToBytes16(uuid: string): Buffer {
  const hex = uuid.replace(/-/g, "").toLowerCase();
  if (hex.length !== 32) throw new Error("Invalid UUID");
  return Buffer.from(hex, "hex");
}

/**
 * Read u64 from buffer at offset (little-endian)
 */
function readU64(buffer: Buffer, offset: number): bigint {
  return buffer.readBigUInt64LE(offset);
}

/**
 * Read u8 from buffer at offset
 */
function readU8(buffer: Buffer, offset: number): number {
  return buffer.readUInt8(offset);
}

export interface OnChainMarketData {
  outcome: number; // 0=open, 1=YES, 2=NO, 3=cancelled
  qYes: number;
  qNo: number;
  b: number;
}

export interface OnChainPositionData {
  sharesYes: number;
  sharesNo: number;
}

export interface OnChainWalletData {
  usdcBalance: number; // In major units (e.g., 1.5 USDC)
}

/**
 * Hook to fetch on-chain market data
 */
export function useOnChainMarket(marketId: string | null) {
  const { connection } = useConnection();
  const [data, setData] = useState<OnChainMarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    if (!marketId) {
      setData(null);
      return;
    }

    const programIdStr = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID;
    if (!programIdStr) {
      setError("Program ID not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const programId = new PublicKey(programIdStr);
      const uuidBytes = uuidToBytes16(marketId);
      const [marketPda] = PublicKey.findProgramAddressSync(
        [MARKET_SEED, uuidBytes],
        programId
      );

      const accountInfo = await connection.getAccountInfo(marketPda);
      
      if (!accountInfo || accountInfo.data.length < MARKET_B_OFFSET + 8) {
        // Market doesn't exist on-chain yet
        setData(null);
        setError(null);
        return;
      }

      const buffer = Buffer.from(accountInfo.data);
      const outcome = readU8(buffer, MARKET_OUTCOME_OFFSET);
      const qYes = Number(readU64(buffer, MARKET_Q_YES_OFFSET)) / 1_000_000;
      const qNo = Number(readU64(buffer, MARKET_Q_NO_OFFSET)) / 1_000_000;
      const b = Number(readU64(buffer, MARKET_B_OFFSET)) / 1_000_000;

      setData({ outcome, qYes, qNo, b });
    } catch (err) {
      console.error("[useOnChainMarket] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch market data");
    } finally {
      setLoading(false);
    }
  }, [connection, marketId]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return { data, loading, error, refetch: fetchMarketData };
}

/**
 * Hook to fetch on-chain position for current wallet
 */
export function useOnChainPosition(marketId: string | null) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [data, setData] = useState<OnChainPositionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosition = useCallback(async () => {
    if (!marketId || !publicKey) {
      setData(null);
      return;
    }

    const programIdStr = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID;
    if (!programIdStr) {
      setError("Program ID not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const programId = new PublicKey(programIdStr);
      const uuidBytes = uuidToBytes16(marketId);
      
      // Derive market PDA first
      const [marketPda] = PublicKey.findProgramAddressSync(
        [MARKET_SEED, uuidBytes],
        programId
      );

      // Derive position PDA
      const [positionPda] = PublicKey.findProgramAddressSync(
        [POSITION_SEED, marketPda.toBuffer(), publicKey.toBuffer()],
        programId
      );

      const accountInfo = await connection.getAccountInfo(positionPda);
      
      if (!accountInfo || accountInfo.data.length < POSITION_SHARES_NO_OFFSET + 8) {
        // Position doesn't exist yet
        setData({ sharesYes: 0, sharesNo: 0 });
        return;
      }

      const buffer = Buffer.from(accountInfo.data);
      const sharesYes = Number(readU64(buffer, POSITION_SHARES_YES_OFFSET)) / 1_000_000;
      const sharesNo = Number(readU64(buffer, POSITION_SHARES_NO_OFFSET)) / 1_000_000;

      setData({ sharesYes, sharesNo });
    } catch (err) {
      console.error("[useOnChainPosition] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch position");
    } finally {
      setLoading(false);
    }
  }, [connection, marketId, publicKey]);

  useEffect(() => {
    fetchPosition();
  }, [fetchPosition]);

  return { data, loading, error, refetch: fetchPosition };
}

/**
 * Hook to fetch wallet's USDC balance
 */
export function useWalletUsdcBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalance(null);
      return;
    }

    const usdcMintStr = process.env.NEXT_PUBLIC_SOLANA_USDC_MINT;
    if (!usdcMintStr) {
      setError("USDC mint not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const usdcMint = new PublicKey(usdcMintStr);
      const userAta = getAssociatedTokenAddressSync(
        usdcMint,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const accountInfo = await connection.getAccountInfo(userAta);
      
      if (!accountInfo) {
        // No ATA means 0 balance
        setBalance(0);
        return;
      }

      // Token account data layout: mint (32) + owner (32) + amount (8) + ...
      const buffer = Buffer.from(accountInfo.data);
      const amountRaw = buffer.readBigUInt64LE(64); // amount is at offset 64
      const amountMajor = Number(amountRaw) / 1_000_000; // USDC has 6 decimals

      setBalance(amountMajor);
    } catch (err) {
      console.error("[useWalletUsdcBalance] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, connected]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Also subscribe to account changes for real-time updates
  useEffect(() => {
    if (!publicKey || !connected) return;

    const usdcMintStr = process.env.NEXT_PUBLIC_SOLANA_USDC_MINT;
    if (!usdcMintStr) return;

    try {
      const usdcMint = new PublicKey(usdcMintStr);
      const userAta = getAssociatedTokenAddressSync(
        usdcMint,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const subscriptionId = connection.onAccountChange(
        userAta,
        (accountInfo) => {
          if (accountInfo.data.length >= 72) {
            const buffer = Buffer.from(accountInfo.data);
            const amountRaw = buffer.readBigUInt64LE(64);
            setBalance(Number(amountRaw) / 1_000_000);
          }
        },
        "confirmed"
      );

      return () => {
        connection.removeAccountChangeListener(subscriptionId);
      };
    } catch {
      // Ignore subscription errors
    }
  }, [connection, publicKey, connected]);

  return { balance, loading, error, refetch: fetchBalance };
}

/**
 * Hook to fetch market vault balance
 */
export function useMarketVaultBalance(marketId: string | null) {
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!marketId) {
      setBalance(null);
      return;
    }

    const programIdStr = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID;
    const usdcMintStr = process.env.NEXT_PUBLIC_SOLANA_USDC_MINT;
    
    if (!programIdStr || !usdcMintStr) {
      setError("Config not set");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const programId = new PublicKey(programIdStr);
      const usdcMint = new PublicKey(usdcMintStr);
      const uuidBytes = uuidToBytes16(marketId);
      
      const [marketPda] = PublicKey.findProgramAddressSync(
        [MARKET_SEED, uuidBytes],
        programId
      );

      const vaultAta = getAssociatedTokenAddressSync(
        usdcMint,
        marketPda,
        true, // allowOwnerOffCurve for PDA
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const accountInfo = await connection.getAccountInfo(vaultAta);
      
      if (!accountInfo) {
        setBalance(0);
        return;
      }

      const buffer = Buffer.from(accountInfo.data);
      const amountRaw = buffer.readBigUInt64LE(64);
      setBalance(Number(amountRaw) / 1_000_000);
    } catch (err) {
      console.error("[useMarketVaultBalance] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch vault balance");
    } finally {
      setLoading(false);
    }
  }, [connection, marketId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

/**
 * Combined hook for all on-chain data needed for a market page
 */
export function useOnChainMarketData(marketId: string | null, isOnChainMarket: boolean) {
  const wallet = useWalletUsdcBalance();
  const position = useOnChainPosition(isOnChainMarket ? marketId : null);
  const market = useOnChainMarket(isOnChainMarket ? marketId : null);
  const vault = useMarketVaultBalance(isOnChainMarket ? marketId : null);

  const loading = wallet.loading || position.loading || market.loading || vault.loading;
  const error = wallet.error || position.error || market.error || vault.error;

  const refetchAll = useCallback(() => {
    wallet.refetch();
    position.refetch();
    market.refetch();
    vault.refetch();
  }, [wallet, position, market, vault]);

  return {
    walletBalance: wallet.balance,
    vaultBalance: vault.balance,
    sharesYes: position.data?.sharesYes ?? null,
    sharesNo: position.data?.sharesNo ?? null,
    marketData: market.data,
    loading,
    error,
    refetch: refetchAll,
  };
}

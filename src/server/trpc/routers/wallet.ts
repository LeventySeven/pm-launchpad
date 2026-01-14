import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import type { Database } from "../../../types/database";
import { encodeFunctionData, createPublicClient, http } from "viem";
import { hardhat, mainnet, polygonAmoy, sepolia } from "viem/chains";
import { ERC20_ABI, PREDICTION_MARKET_VAULT_ABI } from "@/lib/contracts/abis";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type AssetRow = Database["public"]["Tables"]["assets"]["Row"];

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

const preparedTxOutput = z.object({
  chainId: z.number().int().positive(),
  to: z.string().regex(ADDRESS_RE),
  data: z.string().regex(/^0x[0-9a-fA-F]*$/),
  value: z.string(), // bigint-as-string (always "0" for ERC20 interactions)
});

const resolveChain = (chainId: number) => {
  if (chainId === 31337) return hardhat;
  if (chainId === 11155111) return sepolia;
  if (chainId === 80002) return polygonAmoy;
  if (chainId === 1) return mainnet;
  return null;
};

const getRpcUrl = (chainId: number) => {
  if (chainId === 31337) {
    return process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545";
  }
  if (chainId === 11155111) {
    return (
      process.env.ALCHEMY_SEPOLIA_URL ||
      (process.env.ALCHEMY_API_KEY ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` : "")
    );
  }
  if (chainId === 80002) {
    return (
      process.env.ALCHEMY_POLYGON_AMOY_URL ||
      process.env.POLYGON_AMOY_RPC_URL ||
      (process.env.ALCHEMY_API_KEY ? `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` : "")
    );
  }
  if (chainId === 1) {
    return (
      process.env.ALCHEMY_MAINNET_URL ||
      (process.env.ALCHEMY_API_KEY ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` : "")
    );
  }
  return "";
};

const getVaultAddressForChain = (chainId: number) => {
  if (chainId === 31337) return process.env.NEXT_PUBLIC_VAULT_ADDRESS_LOCAL || "";
  if (chainId === 11155111) return process.env.NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA || "";
  if (chainId === 80002) return process.env.NEXT_PUBLIC_VAULT_ADDRESS_AMOY || "";
  if (chainId === 1) return process.env.NEXT_PUBLIC_VAULT_ADDRESS_MAINNET || "";
  return "";
};

const getTokenAddressForChain = (chainId: number, assetCode: string) => {
  const code = assetCode.toUpperCase();
  if (chainId === 31337) {
    if (code === "USDC") return process.env.NEXT_PUBLIC_USDC_ADDRESS_LOCAL || "";
    if (code === "USDT") return process.env.NEXT_PUBLIC_USDT_ADDRESS_LOCAL || "";
  }
  if (chainId === 11155111) {
    if (code === "USDC") return process.env.NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA || "";
    if (code === "USDT") return process.env.NEXT_PUBLIC_USDT_ADDRESS_SEPOLIA || "";
  }
  if (chainId === 80002) {
    if (code === "USDC") return process.env.NEXT_PUBLIC_USDC_ADDRESS_AMOY || "";
    if (code === "USDT") return process.env.NEXT_PUBLIC_USDT_ADDRESS_AMOY || "";
  }
  if (chainId === 1) {
    // Mainnet token addresses are stable defaults; allow override via env if desired.
    if (code === "USDC") return process.env.NEXT_PUBLIC_USDC_ADDRESS_MAINNET || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    if (code === "USDT") return process.env.NEXT_PUBLIC_USDT_ADDRESS_MAINNET || "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  }
  return "";
};

const parseAmountToMinor = (amountMajor: number, decimals: number) => {
  if (!Number.isFinite(amountMajor) || amountMajor <= 0) return null;
  const scale = Math.pow(10, decimals);
  // Defensive rounding: floor, like DB functions do.
  const minor = Math.floor(amountMajor * scale);
  return minor > 0 ? minor : null;
};

export const walletRouter = router({
  /**
   * Prepare ERC20 approve + vault deposit transactions.
   * Frontend should send `approve` first (if allowance < amount), then `deposit`.
   */
  prepareDeposit: publicProcedure
    .input(
      z.object({
        assetCode: z.enum(["USDC", "USDT"]),
        amount: z.number().positive(),
      })
    )
    .output(
      z.object({
        walletAddress: z.string().regex(ADDRESS_RE),
        chainId: z.number().int().positive(),
        assetCode: z.string(),
        amountMinor: z.number().int().positive(),
        decimals: z.number().int().nonnegative(),
        vaultAddress: z.string().regex(ADDRESS_RE),
        tokenAddress: z.string().regex(ADDRESS_RE),
        approveTx: preparedTxOutput,
        depositTx: preparedTxOutput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabaseService, authUser } = ctx;
      if (!authUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });

      const { data: user, error: userErr } = await supabaseService
        .from("users")
        .select("wallet_address, chain_id")
        .eq("id", authUser.id)
        .single();

      if (userErr || !user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: userErr?.message ?? "User not found" });

      const walletAddress = (user as Pick<UserRow, "wallet_address">).wallet_address;
      const chainId = (user as Pick<UserRow, "chain_id">).chain_id;
      if (!walletAddress) throw new TRPCError({ code: "BAD_REQUEST", message: "NO_WALLET_LINKED" });
      if (!chainId) throw new TRPCError({ code: "BAD_REQUEST", message: "NO_CHAIN_SELECTED" });

      const chain = resolveChain(chainId);
      if (!chain) throw new TRPCError({ code: "BAD_REQUEST", message: "UNSUPPORTED_CHAIN" });

      const { data: asset, error: assetErr } = await supabaseService
        .from("assets")
        .select("code, decimals, is_enabled")
        .eq("code", input.assetCode)
        .maybeSingle();

      if (assetErr || !asset) throw new TRPCError({ code: "BAD_REQUEST", message: "ASSET_NOT_FOUND" });
      const typedAsset = asset as Pick<AssetRow, "code" | "decimals" | "is_enabled">;
      if (!typedAsset.is_enabled) throw new TRPCError({ code: "BAD_REQUEST", message: "ASSET_DISABLED" });

      const decimals = Number(typedAsset.decimals ?? 6);
      const amountMinor = parseAmountToMinor(input.amount, decimals);
      if (!amountMinor) throw new TRPCError({ code: "BAD_REQUEST", message: "AMOUNT_TOO_SMALL" });

      const vaultAddress = getVaultAddressForChain(chainId);
      const tokenAddress = getTokenAddressForChain(chainId, input.assetCode);

      if (!ADDRESS_RE.test(vaultAddress)) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "VAULT_ADDRESS_NOT_CONFIGURED" });
      }
      if (!ADDRESS_RE.test(tokenAddress)) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "TOKEN_ADDRESS_NOT_CONFIGURED" });
      }

      const amount = BigInt(amountMinor);

      const approveData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "approve",
        args: [vaultAddress as `0x${string}`, amount],
      });

      const depositData = encodeFunctionData({
        abi: PREDICTION_MARKET_VAULT_ABI,
        functionName: "deposit",
        args: [tokenAddress as `0x${string}`, amount],
      });

      return {
        walletAddress,
        chainId,
        assetCode: input.assetCode,
        amountMinor,
        decimals,
        vaultAddress,
        tokenAddress,
        approveTx: { chainId, to: tokenAddress, data: approveData, value: "0" },
        depositTx: { chainId, to: vaultAddress, data: depositData, value: "0" },
      };
    }),

  /**
   * Prepare a vault withdraw transaction.
   */
  prepareWithdraw: publicProcedure
    .input(
      z.object({
        assetCode: z.enum(["USDC", "USDT"]),
        amount: z.number().positive(),
      })
    )
    .output(
      z.object({
        chainId: z.number().int().positive(),
        assetCode: z.string(),
        amountMinor: z.number().int().positive(),
        decimals: z.number().int().nonnegative(),
        vaultAddress: z.string().regex(ADDRESS_RE),
        tokenAddress: z.string().regex(ADDRESS_RE),
        withdrawTx: preparedTxOutput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabaseService, authUser } = ctx;
      if (!authUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });

      const { data: user, error: userErr } = await supabaseService
        .from("users")
        .select("wallet_address, chain_id")
        .eq("id", authUser.id)
        .single();

      if (userErr || !user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: userErr?.message ?? "User not found" });

      const walletAddress = (user as Pick<UserRow, "wallet_address">).wallet_address;
      const chainId = (user as Pick<UserRow, "chain_id">).chain_id;
      if (!walletAddress) throw new TRPCError({ code: "BAD_REQUEST", message: "NO_WALLET_LINKED" });
      if (!chainId) throw new TRPCError({ code: "BAD_REQUEST", message: "NO_CHAIN_SELECTED" });

      const chain = resolveChain(chainId);
      if (!chain) throw new TRPCError({ code: "BAD_REQUEST", message: "UNSUPPORTED_CHAIN" });

      const { data: asset, error: assetErr } = await supabaseService
        .from("assets")
        .select("code, decimals, is_enabled")
        .eq("code", input.assetCode)
        .maybeSingle();

      if (assetErr || !asset) throw new TRPCError({ code: "BAD_REQUEST", message: "ASSET_NOT_FOUND" });
      const typedAsset = asset as Pick<AssetRow, "code" | "decimals" | "is_enabled">;
      if (!typedAsset.is_enabled) throw new TRPCError({ code: "BAD_REQUEST", message: "ASSET_DISABLED" });

      const decimals = Number(typedAsset.decimals ?? 6);
      const amountMinor = parseAmountToMinor(input.amount, decimals);
      if (!amountMinor) throw new TRPCError({ code: "BAD_REQUEST", message: "AMOUNT_TOO_SMALL" });

      const vaultAddress = getVaultAddressForChain(chainId);
      const tokenAddress = getTokenAddressForChain(chainId, input.assetCode);

      if (!ADDRESS_RE.test(vaultAddress)) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "VAULT_ADDRESS_NOT_CONFIGURED" });
      }
      if (!ADDRESS_RE.test(tokenAddress)) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "TOKEN_ADDRESS_NOT_CONFIGURED" });
      }

      const amount = BigInt(amountMinor);
      const withdrawData = encodeFunctionData({
        abi: PREDICTION_MARKET_VAULT_ABI,
        functionName: "withdraw",
        args: [tokenAddress as `0x${string}`, amount],
      });

      return {
        chainId,
        assetCode: input.assetCode,
        amountMinor,
        decimals,
        vaultAddress,
        tokenAddress,
        withdrawTx: { chainId, to: vaultAddress, data: withdrawData, value: "0" },
      };
    }),

  /**
   * Get on-chain ERC20 wallet balance (not vault balance).
   * Uses RPC (Alchemy) from the server.
   */
  getOnChainBalance: publicProcedure
    .input(
      z.object({
        assetCode: z.enum(["USDC", "USDT"]),
      })
    )
    .output(
      z.object({
        chainId: z.number().int().positive(),
        walletAddress: z.string().regex(ADDRESS_RE),
        assetCode: z.string(),
        tokenAddress: z.string().regex(ADDRESS_RE),
        balanceMinor: z.string(), // bigint-as-string
      })
    )
    .query(async ({ ctx, input }) => {
      const { supabaseService, authUser } = ctx;
      if (!authUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });

      const { data: user, error: userErr } = await supabaseService
        .from("users")
        .select("wallet_address, chain_id")
        .eq("id", authUser.id)
        .single();

      if (userErr || !user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: userErr?.message ?? "User not found" });

      const walletAddress = (user as Pick<UserRow, "wallet_address">).wallet_address;
      const chainId = (user as Pick<UserRow, "chain_id">).chain_id;
      if (!walletAddress) throw new TRPCError({ code: "BAD_REQUEST", message: "NO_WALLET_LINKED" });
      if (!chainId) throw new TRPCError({ code: "BAD_REQUEST", message: "NO_CHAIN_SELECTED" });

      const chain = resolveChain(chainId);
      if (!chain) throw new TRPCError({ code: "BAD_REQUEST", message: "UNSUPPORTED_CHAIN" });

      const tokenAddress = getTokenAddressForChain(chainId, input.assetCode);
      if (!ADDRESS_RE.test(tokenAddress)) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "TOKEN_ADDRESS_NOT_CONFIGURED" });
      }

      const rpcUrl = getRpcUrl(chainId);
      if (!rpcUrl) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "RPC_URL_NOT_CONFIGURED" });

      const client = createPublicClient({ chain, transport: http(rpcUrl) });
      // NOTE: Viem's ReadContractParameters types can vary across versions (e.g. EIP-7702 fields).
      // We keep this call runtime-correct and avoid over-constraining compile-time types.
      const balance = (await (client as any).readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress as `0x${string}`],
      })) as bigint;

      return {
        chainId,
        walletAddress,
        assetCode: input.assetCode,
        tokenAddress,
        balanceMinor: balance.toString(),
      };
    }),
});


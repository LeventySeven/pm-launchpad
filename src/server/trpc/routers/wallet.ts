import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const solanaClusterSchema = z.enum(["devnet", "testnet", "mainnet-beta"]);
const assetCodeSchema = z.enum(["USDC"]);

const preparedSolanaTxOutput = z.object({
  solanaCluster: solanaClusterSchema,
  txBase64: z.string().min(1),
});

/**
 * Solana wallet utilities (SPL transfers + program instructions) will be implemented
 * once the Anchor program is added and deployed.
 *
 * For now we keep the endpoints to preserve API shape and return a clear error.
 */
export const walletRouter = router({
  prepareDeposit: publicProcedure
    .input(z.object({ assetCode: assetCodeSchema, amount: z.number().positive() }))
    .output(preparedSolanaTxOutput)
    .mutation(async () => {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "SOLANA_PROGRAM_NOT_DEPLOYED" });
    }),

  prepareWithdraw: publicProcedure
    .input(z.object({ assetCode: assetCodeSchema, amount: z.number().positive() }))
    .output(preparedSolanaTxOutput)
    .mutation(async () => {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "SOLANA_PROGRAM_NOT_DEPLOYED" });
    }),

  getOnChainBalance: publicProcedure
    .input(z.object({ assetCode: assetCodeSchema }))
    .output(
      z.object({
        solanaCluster: solanaClusterSchema,
        walletPubkey: z.string(),
        mint: z.string(),
        balanceMinor: z.string(),
      })
    )
    .query(async () => {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "SOLANA_PROGRAM_NOT_DEPLOYED" });
    }),
});


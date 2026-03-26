import { z } from "zod";

export const FollowInputSchema = z.object({
  targetUserId: z.string().uuid(),
});
export type FollowInput = z.infer<typeof FollowInputSchema>;

export const FollowListInputSchema = z.object({
  userId: z.string().uuid(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});
export type FollowListInput = z.infer<typeof FollowListInputSchema>;

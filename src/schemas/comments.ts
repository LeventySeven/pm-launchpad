import { z } from "zod";

export const marketCommentSchema = z.object({
  id: z.string(),
  marketId: z.string(),
  userId: z.string(),
  body: z.string(),
  createdAt: z.string(),
  authorName: z.string(),
  authorUsername: z.string().nullable(),
  authorAvatarUrl: z.string().nullable(),
});

export const marketCommentsSchema = z.array(marketCommentSchema);



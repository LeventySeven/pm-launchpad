import { z } from "zod";

export const myCommentSchema = z.object({
  id: z.string(),
  marketId: z.string(),
  parentId: z.string().nullable(),
  body: z.string(),
  createdAt: z.string(),
  marketTitleRu: z.string(),
  marketTitleEn: z.string(),
  likesCount: z.number(),
});

export const myCommentsSchema = z.array(myCommentSchema);



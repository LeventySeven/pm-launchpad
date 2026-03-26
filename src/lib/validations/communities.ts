import { z } from "zod";

export const CommunitySlugSchema = z
  .string()
  .min(2)
  .max(50)
  .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Slug must be lowercase alphanumeric with optional hyphens");

export const CreateCommunityInputSchema = z.object({
  name: z.string().min(1).max(100),
  slug: CommunitySlugSchema,
  description: z.string().max(2000).optional(),
  bannerUrl: z.string().url().optional(),
  privacy: z.enum(["public", "private"]).default("public"),
  category: z.string().max(50).optional(),
});
export type CreateCommunityInput = z.infer<typeof CreateCommunityInputSchema>;

export const UpdateCommunityInputSchema = z.object({
  communityId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).nullable().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  privacy: z.enum(["public", "private"]).optional(),
  category: z.string().max(50).nullable().optional(),
});
export type UpdateCommunityInput = z.infer<typeof UpdateCommunityInputSchema>;

export const AddMarketToCommunityInputSchema = z.object({
  communityId: z.string().uuid(),
  marketId: z.string().uuid(),
});
export type AddMarketToCommunityInput = z.infer<typeof AddMarketToCommunityInputSchema>;

export const CommunityListInputSchema = z.object({
  category: z.string().optional(),
  search: z.string().max(200).optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});
export type CommunityListInput = z.infer<typeof CommunityListInputSchema>;

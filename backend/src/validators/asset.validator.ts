import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string().min(2),
  categoryId: z.number().int().positive(),
  serialNumber: z.string().optional(),
  acquisitionDate: z.string().datetime().optional(),
  acquisitionCost: z.number().optional(),
  condition: z.enum(["New", "Good", "Fair", "Poor"]),
  location: z.string().optional(),
  isShared: z.boolean().default(false),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
import { z } from "zod";

export const createTransferSchema = z.object({
  assetId: z.number().int().positive(),
  fromEmployeeId: z.number().int().positive(),
  toEmployeeId: z.number().int().positive(),
  reason: z.string().min(5).max(500),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
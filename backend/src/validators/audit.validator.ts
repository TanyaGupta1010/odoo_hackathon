import { z } from "zod";

export const updateAuditItemSchema = z.object({
  status: z.enum(["Pending", "Verified", "Missing", "Damaged"]),
  notes: z.string().optional(),
});

export type UpdateAuditItemInput = z.infer<typeof updateAuditItemSchema>;

import { z } from "zod";

export const createMaintenanceSchema = z.object({
  assetId: z.number().int().positive(),
  issueDescription: z.string().min(5),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  reporterId: z.number().int().positive().optional(),
  photoUrl: z.string().url().optional().or(z.string().length(0)),
});

export const updateMaintenanceSchema = z.object({
  status: z.enum(["Pending", "Approved", "Assigned", "In_Progress", "Resolved"]).optional(),
  technicianId: z.number().int().positive().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  photoUrl: z.string().url().optional().or(z.string().length(0)),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;

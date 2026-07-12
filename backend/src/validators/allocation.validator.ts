import { z } from "zod";

export const allocateAssetSchema = z
  .object({
    assetId: z.number().int().positive(),

    employeeId: z.number().int().positive().optional(),

    departmentId: z.number().int().positive().optional(),

    expectedReturnDate: z.string().optional(),
  })
  .refine(
    (data) => data.employeeId || data.departmentId,
    {
      message: "Either employeeId or departmentId is required.",
      path: ["employeeId"],
    }
  );

export type AllocateAssetInput = z.infer<
  typeof allocateAssetSchema
>;
import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentDepartmentId: z.number().nullable().optional(),
  headId: z.number().nullable().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().nullable().optional(),
  customFields: z.any().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const updateEmployeeAssignmentSchema = z.object({
  role: z.enum(["Admin", "Asset Manager", "Department Head", "Employee"]).optional(),
  departmentId: z.number().nullable().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateEmployeeAssignmentInput = z.infer<typeof updateEmployeeAssignmentSchema>;

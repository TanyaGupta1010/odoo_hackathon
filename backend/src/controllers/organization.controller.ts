import { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  createCategorySchema,
  updateCategorySchema,
  updateEmployeeAssignmentSchema,
} from "../validators/organization.validator";

export class OrganizationController {
  // --- Departments ---
  static async getDepartments(req: Request, res: Response) {
    const data = await OrganizationService.getDepartments();
    res.json({ success: true, data });
  }

  static async createDepartment(req: Request, res: Response) {
    const body = createDepartmentSchema.parse(req.body);
    const data = await OrganizationService.createDepartment(body);
    res.json({ success: true, data });
  }

  static async updateDepartment(req: Request, res: Response) {
    const id = Number(req.params.id);
    const body = updateDepartmentSchema.parse(req.body);
    const data = await OrganizationService.updateDepartment(id, body);
    res.json({ success: true, data });
  }

  // --- Categories ---
  static async getCategories(req: Request, res: Response) {
    const data = await OrganizationService.getCategories();
    res.json({ success: true, data });
  }

  static async createCategory(req: Request, res: Response) {
    const body = createCategorySchema.parse(req.body);
    const data = await OrganizationService.createCategory(body);
    res.json({ success: true, data });
  }

  static async updateCategory(req: Request, res: Response) {
    const id = Number(req.params.id);
    const body = updateCategorySchema.parse(req.body);
    const data = await OrganizationService.updateCategory(id, body);
    res.json({ success: true, data });
  }

  // --- Employees ---
  static async getEmployees(req: Request, res: Response) {
    const data = await OrganizationService.getEmployees();
    res.json({ success: true, data });
  }

  static async updateEmployee(req: Request, res: Response) {
    const id = Number(req.params.id);
    const body = updateEmployeeAssignmentSchema.parse(req.body);
    const data = await OrganizationService.updateEmployee(id, body);
    res.json({ success: true, data });
  }
}

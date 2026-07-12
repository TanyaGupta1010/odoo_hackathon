import { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service";

export class EmployeeController {
  static async getAll(req: Request, res: Response) {
    const employees = await EmployeeService.getAll();

    res.json({
      success: true,
      data: employees,
    });
  }

  static async updateRole(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: "Invalid employee id" });
    }

    const role = req.body?.role;
    if (typeof role !== "string") {
      return res.status(400).json({ success: false, message: "Missing role" });
    }

    const employee = await EmployeeService.updateRole(id, role);
    res.json({ success: true, data: employee });
  }
}
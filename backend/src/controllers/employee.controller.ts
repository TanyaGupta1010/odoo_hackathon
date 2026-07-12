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
}
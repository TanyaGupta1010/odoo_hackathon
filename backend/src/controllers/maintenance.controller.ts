import { Request, Response } from "express";
import { MaintenanceService } from "../services/maintenance.service";
import { createMaintenanceSchema, updateMaintenanceSchema } from "../validators/maintenance.validator";

export class MaintenanceController {
  static async getAll(req: Request, res: Response) {
    const requests = await MaintenanceService.getAll();
    res.json({
      success: true,
      data: requests,
    });
  }

  static async create(req: Request, res: Response) {
    const body = createMaintenanceSchema.parse(req.body);
    const request = await MaintenanceService.create(body);
    res.status(201).json({
      success: true,
      data: request,
    });
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const body = updateMaintenanceSchema.parse(req.body);
    const request = await MaintenanceService.update(id, body);
    res.json({
      success: true,
      data: request,
    });
  }
}

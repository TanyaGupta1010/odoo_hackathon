import { Request, Response } from "express";
import { AuditService } from "../services/audit.service";
import { updateAuditItemSchema } from "../validators/audit.validator";
import { AuthRequest } from "../middleware/auth.middleware";

export class AuditController {
  static async getActiveCycle(req: Request, res: Response) {
    const cycle = await AuditService.getActiveCycle();
    res.json({
      success: true,
      data: cycle,
    });
  }
  static async getAll(req: Request, res: Response) {
    const cycles = await AuditService.getAll();
    res.json({
      success: true,
      data: cycles,
    });
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const cycle = await AuditService.getById(id);
    res.json({
      success: true,
      data: cycle,
    });
  }
  static async updateItem(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const body = updateAuditItemSchema.parse(req.body);
    // Derive the auditor from the authenticated JWT — never trust a client-supplied id.
    const auditorId = req.user?.id;

    const item = await AuditService.updateItem(id, body, auditorId);
    res.json({
      success: true,
      data: item,
    });
  }

  static async closeCycle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const cycle = await AuditService.closeCycle(id);
    res.json({
      success: true,
      data: cycle,
    });
  }
}

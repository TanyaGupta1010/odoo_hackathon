import { Request, Response } from "express";
import { NotificationsService } from "../services/notifications.service";

export class NotificationsController {
  static async getAll(req: Request, res: Response) {
    const type = req.query.type as string | undefined;
    const logs = await NotificationsService.getAll(type);
    res.json({
      success: true,
      data: logs,
    });
  }
}

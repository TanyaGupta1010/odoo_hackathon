import { Request, Response } from "express";
import { ReportsService } from "../services/reports.service";

export class ReportsController {
  static async getSummary(req: Request, res: Response) {
    const summary = await ReportsService.getSummary();
    res.json({
      success: true,
      data: summary,
    });
  }
}

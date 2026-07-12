import { Request, Response } from "express";
import { ResourceService } from "../services/resource.service";

export class ResourceController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    const resources =
      await ResourceService.getAll();

    return res.json({
      success: true,
      data: resources,
    });
  }
}
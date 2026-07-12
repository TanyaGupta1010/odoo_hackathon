import { Request, Response } from "express";
import { allocateAssetSchema } from "../validators/allocation.validator";
import { AllocationService } from "../services/allocation.service";

export class AllocationController {
  static async allocate(req: Request, res: Response) {
    const body = allocateAssetSchema.parse(req.body);

    const allocation = await AllocationService.allocate(body);

    return res.status(201).json({
      success: true,
      data: allocation,
    });
  }

  static async getAll(req: Request, res: Response) {
    const allocations = await AllocationService.getAll();

    return res.json({
      success: true,
      data: allocations,
    });
  }
}
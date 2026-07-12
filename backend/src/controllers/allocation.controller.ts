import { Request, Response } from "express";
import { AllocationService } from "../services/allocation.service";
import { allocateAssetSchema } from "../validators/allocation.validator";

export class AllocationController {
  static async allocate(req: Request, res: Response) {
    const body = allocateAssetSchema.parse(req.body);

    const allocation = await AllocationService.allocate(body);

    res.status(201).json({
      success: true,
      data: allocation,
    });
  }

  static async getAll(req: Request, res: Response) {
    const allocations = await AllocationService.getAll();

    res.json({
      success: true,
      data: allocations,
    });
  }

  static async getHistory(req: Request, res: Response) {
    const assetId = Number(req.params.assetId);

    const history = await AllocationService.getHistory(assetId);

    res.json({
      success: true,
      data: history,
    });
  }

  static async returnAsset(req: Request, res: Response) {
    const allocationId = Number(req.params.id);

    const { condition, notes } = req.body;

    const allocation = await AllocationService.returnAsset(
      allocationId,
      condition,
      notes
    );

    res.json({
      success: true,
      data: allocation,
    });
  }
}
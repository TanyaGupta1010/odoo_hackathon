import { Request, Response } from "express";
import { createAssetSchema } from "../validators/asset.validator";
import { AssetService } from "../services/asset.service";

export class AssetController {
  static async create(req: Request, res: Response) {
    const body = createAssetSchema.parse(req.body);

    const asset = await AssetService.create(body);

    return res.status(201).json({
      success: true,
      data: asset,
    });
  }

  static async getAll(req: Request, res: Response) {
    const assets = await AssetService.getAll();

    return res.json({
      success: true,
      data: assets,
    });
  }
}
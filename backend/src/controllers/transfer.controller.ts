import { Request, Response } from "express";
import { createTransferSchema } from "../validators/transfer.validator";
import { TransferService } from "../services/transfer.service";

export class TransferController {
  static async create(req: Request, res: Response) {
    const body = createTransferSchema.parse(req.body);

    const transfer = await TransferService.create(body);

    return res.status(201).json({
      success: true,
      data: transfer,
    });
  }

  static async getAll(req: Request, res: Response) {
    const transfers = await TransferService.getAll();

    return res.json({
      success: true,
      data: transfers,
    });
  }

  static async approve(req: Request, res: Response) {
    const id = Number(req.params.id);

    // Temporary until authentication is added
    const approverId = Number(req.body.approverId);

    const transfer = await TransferService.approve(id, approverId);

    return res.json({
      success: true,
      data: transfer,
    });
  }

  static async reject(req: Request, res: Response) {
    const id = Number(req.params.id);

    const approverId = Number(req.body.approverId);

    const transfer = await TransferService.reject(id, approverId);

    return res.json({
      success: true,
      data: transfer,
    });
  }
}
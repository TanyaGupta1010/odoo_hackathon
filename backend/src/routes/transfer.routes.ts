import { Router } from "express";
import { TransferController } from "../controllers/transfer.controller";

const router = Router();

router.get("/", TransferController.getAll);

router.post("/", TransferController.create);

router.patch("/:id/approve", TransferController.approve);

router.patch("/:id/reject", TransferController.reject);

export default router;
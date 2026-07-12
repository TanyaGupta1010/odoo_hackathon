import { Router } from "express";
import { AllocationController } from "../controllers/allocation.controller";

const router = Router();

router.get("/", AllocationController.getAll);

router.get("/history/:assetId", AllocationController.getHistory);

router.post("/", AllocationController.allocate);

router.patch("/:id/return", AllocationController.returnAsset);

export default router;
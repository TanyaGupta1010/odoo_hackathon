import { Router } from "express";
import { AllocationController } from "../controllers/allocation.controller";

const router = Router();

router.get("/", AllocationController.getAll);

router.get("/history/:assetId", AllocationController.getHistory);

// TODO: restrict writes to admins later (requireRole("Admin"))
router.post("/", AllocationController.allocate);

router.patch("/:id/return", AllocationController.returnAsset);

export default router;
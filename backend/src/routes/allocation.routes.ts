import { Router } from "express";
import { AllocationController } from "../controllers/allocation.controller";

const router = Router();

router.get("/", AllocationController.getAll);

router.post("/", AllocationController.allocate);

export default router;
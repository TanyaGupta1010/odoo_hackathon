import { Router } from "express";
import { MaintenanceController } from "../controllers/maintenance.controller";

const router = Router();

router.get("/", MaintenanceController.getAll);
router.post("/", MaintenanceController.create);
router.patch("/:id", MaintenanceController.update);

export default router;

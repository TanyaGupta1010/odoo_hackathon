import { Router } from "express";
import { MaintenanceController } from "../controllers/maintenance.controller";

const router = Router();

router.get("/", MaintenanceController.getAll);
// TODO: restrict writes to admins later (requireRole("Admin"))
router.post("/", MaintenanceController.create);
router.patch("/:id", MaintenanceController.update);

export default router;

import { Router } from "express";
import { AuditController } from "../controllers/audit.controller";

const router = Router();

router.get("/", AuditController.getAll);
router.get("/active", AuditController.getActiveCycle);
router.get("/:id", AuditController.getById);
router.patch("/items/:id", AuditController.updateItem);
router.post("/cycles/:id/close", AuditController.closeCycle);

export default router;

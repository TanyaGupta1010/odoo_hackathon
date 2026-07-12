import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/", EmployeeController.getAll);

// Only Admins can change roles (e.g. promote another employee to Admin).
// `authenticate` already ran at the mount point, so req.user is set.
router.patch("/:id/role", requireRole("Admin"), EmployeeController.updateRole);

export default router;
import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller";
import { requireRole } from "../middleware/auth.middleware";

const router = Router();

// Departments
router.get("/departments", OrganizationController.getDepartments);
router.post("/departments", requireRole("Admin"), OrganizationController.createDepartment);
router.patch("/departments/:id", requireRole("Admin"), OrganizationController.updateDepartment);

// Categories
router.get("/categories", OrganizationController.getCategories);
router.post("/categories", requireRole("Admin"), OrganizationController.createCategory);
router.patch("/categories/:id", requireRole("Admin"), OrganizationController.updateCategory);

// Employees
router.get("/employees", OrganizationController.getEmployees);
router.patch("/employees/:id", requireRole("Admin"), OrganizationController.updateEmployee);

export default router;

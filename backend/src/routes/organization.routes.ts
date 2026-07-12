import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller";

const router = Router();

// Departments
router.get("/departments", OrganizationController.getDepartments);
router.post("/departments", OrganizationController.createDepartment);
router.patch("/departments/:id", OrganizationController.updateDepartment);

// Categories
router.get("/categories", OrganizationController.getCategories);
router.post("/categories", OrganizationController.createCategory);
router.patch("/categories/:id", OrganizationController.updateCategory);

// Employees
router.get("/employees", OrganizationController.getEmployees);
router.patch("/employees/:id", OrganizationController.updateEmployee);

export default router;

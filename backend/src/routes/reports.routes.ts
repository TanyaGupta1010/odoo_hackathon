import { Router } from "express";
import { ReportsController } from "../controllers/reports.controller";

const router = Router();

router.get("/summary", ReportsController.getSummary);

export default router;

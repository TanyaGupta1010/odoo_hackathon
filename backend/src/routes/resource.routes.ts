import { Router } from "express";
import { ResourceController } from "../controllers/resource.controller";

const router = Router();

router.get("/", ResourceController.getAll);

export default router;
import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";

const router = Router();

router.get("/", AssetController.getAll);

router.get("/available", AssetController.getAvailable);

// TODO: restrict to admins later -> router.post("/", requireRole("Admin"), ...)
router.post("/", AssetController.create);

export default router;
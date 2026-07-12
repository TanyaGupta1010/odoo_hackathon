import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";

const router = Router();

router.get("/", AssetController.getAll);

router.post("/", AssetController.create);

export default router;
import { Router } from "express";
import { NotificationsController } from "../controllers/notifications.controller";

const router = Router();

router.get("/", NotificationsController.getAll);

export default router;

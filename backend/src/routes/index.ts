import { Router } from "express";

import { env } from "../config/env";
import { authenticate } from "../middleware/auth.middleware";
import authRoutes from "./auth.routes";
import allocationRoutes from "./allocation.routes";
import assetRoutes from "./asset.routes";
import employeeRoutes from "./employee.routes";
import transferRoutes from "./transfer.routes";
import maintenanceRoutes from "./maintenance.routes";
import bookingRoutes from "./booking.routes";
import resourceRoutes from "./resource.routes";
import auditRoutes from "./audit.routes";
import reportsRoutes from "./reports.routes";
import notificationsRoutes from "./notifications.routes";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    message: "AssetFlow API v1",
  });
});

// Public client config — the Google client ID is not a secret (it lives in the
// browser anyway). Served here so it's configured in one place: backend/.env.
router.get("/config", (_, res) => {
  res.json({ success: true, data: { googleClientId: env.GOOGLE_CLIENT_ID } });
});

router.use("/auth", authRoutes);

// All business-data endpoints require a valid login.
router.use("/assets", authenticate, assetRoutes);
router.use("/employees", authenticate, employeeRoutes);
router.use("/allocations", authenticate, allocationRoutes);
router.use("/transfers", authenticate, transferRoutes);
router.use("/maintenance", authenticate, maintenanceRoutes);
router.use("/bookings", authenticate, bookingRoutes);
router.use("/resources", authenticate, resourceRoutes);
router.use("/audit", authenticate, auditRoutes);
router.use("/reports", authenticate, reportsRoutes);
router.use("/notifications", authenticate, notificationsRoutes);

export default router;
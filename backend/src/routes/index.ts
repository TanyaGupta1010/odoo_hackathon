import { Router } from "express";

import allocationRoutes from "./allocation.routes";
import assetRoutes from "./asset.routes";
import employeeRoutes from "./employee.routes";
import transferRoutes from "./transfer.routes";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    message: "AssetFlow API v1",
  });
});

router.use("/assets", assetRoutes);
router.use("/employees", employeeRoutes);
router.use("/allocations", allocationRoutes);
router.use("/transfers", transferRoutes);

export default router;
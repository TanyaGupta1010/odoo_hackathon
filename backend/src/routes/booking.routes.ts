import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const router = Router();

router.get("/", BookingController.getAll);

router.get(
  "/resource/:resourceId",
  BookingController.getByResource
);

router.post("/", BookingController.create);

router.patch(
  "/:id/cancel",
  BookingController.cancel
);

export default router;
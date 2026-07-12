import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingSchema } from "../validators/booking.validator";
import { AuthRequest } from "../middleware/auth.middleware";

export class BookingController {
  static async create(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const body =
        createBookingSchema.parse(req.body);

      // Book on behalf of the authenticated user — never trust a client-supplied employeeId.
      const booking =
        await BookingService.create({ ...body, employeeId: req.user!.id });

      return res.status(201).json({
        success: true,
        message:
          "Booking created successfully.",
        data: booking,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(400).json({
        success: false,
        message:
          error.message ??
          "Unable to create booking.",
      });
    }
  }

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const bookings =
        await BookingService.getAll();

      return res.json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ??
          "Unable to fetch bookings.",
      });
    }
  }

  static async getByResource(
    req: Request,
    res: Response
  ) {
    try {
      const resourceId = Number(
        req.params.resourceId
      );

      const bookings =
        await BookingService.getByResource(
          resourceId
        );

      return res.json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ??
          "Unable to fetch resource bookings.",
      });
    }
  }

  static async cancel(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id);

      const booking =
        await BookingService.cancel(id);

      return res.json({
        success: true,
        message:
          "Booking cancelled successfully.",
        data: booking,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(400).json({
        success: false,
        message:
          error.message ??
          "Unable to cancel booking.",
      });
    }
  }
}
import { z } from "zod";

export const createBookingSchema = z.object({
  resourceId: z.number().int().positive(),

  employeeId: z.number().int().positive(),

  startTime: z.string(),

  endTime: z.string(),
});

export type CreateBookingInput =
  z.infer<typeof createBookingSchema>;
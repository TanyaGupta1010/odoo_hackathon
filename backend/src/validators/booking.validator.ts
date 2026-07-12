import { z } from "zod";

export const createBookingSchema = z.object({
  resourceId: z.number().int().positive(),

  // employeeId is derived from the authenticated user, never trusted from the client.

  startTime: z.string(),

  endTime: z.string(),
});

export type CreateBookingInput =
  z.infer<typeof createBookingSchema>;
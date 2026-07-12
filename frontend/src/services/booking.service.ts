import { apiFetch } from "./http";
import type { CreateBookingDto } from "../types/booking";

export const bookingService = {
  getResources() {
    return apiFetch("/resources");
  },

  getBookings(resourceId: number) {
    return apiFetch(`/bookings/resource/${resourceId}`);
  },

  create(data: CreateBookingDto) {
    return apiFetch("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  cancel(id: number) {
    return apiFetch(`/bookings/${id}/cancel`, { method: "PATCH" });
  },
};

const API = "http://localhost:5000/api";

import type { CreateBookingDto } from "../types/booking";

export const bookingService = {
  async getResources() {
    const res = await fetch(`${API}/resources`);
    return res.json();
  },

  async getBookings(resourceId: number) {
    const res = await fetch(
      `${API}/bookings/resource/${resourceId}`
    );

    return res.json();
  },

  async create(data: CreateBookingDto) {
    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async cancel(id: number) {
    const res = await fetch(
      `${API}/bookings/${id}/cancel`,
      {
        method: "PATCH",
      }
    );

    return res.json();
  },
};
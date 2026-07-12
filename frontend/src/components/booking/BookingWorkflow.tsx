import { useEffect, useMemo, useState } from "react";

import ResourceSelector from "./ResourceSelector";
import BookingTimeline from "./BookingTimeline";
import ConflictBanner from "./ConflictBanner";

import { bookingService } from "../../services/booking.service";

import type {
  Booking,
  Resource,
} from "../../types/booking";

export default function BookingWorkflow() {
  const [resource, setResource] =
    useState<Resource | null>(null);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [employeeId, setEmployeeId] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [notification, setNotification] =
    useState<{
      type: "success" | "error";
      message: string;
    } | null>(null);

  useEffect(() => {
    if (!resource) return;

    loadBookings();
  }, [resource]);

  function showNotification(
    type: "success" | "error",
    message: string
  ) {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  async function loadBookings() {
    try {
      setLoading(true);

      const res =
        await bookingService.getBookings(
          resource!.id
        );

      setBookings(res.data ?? []);
    } catch (err) {
      console.error(err);

      showNotification(
        "error",
        "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  const conflict = useMemo(() => {
    if (!startTime || !endTime) return false;

    return bookings.some((booking) => {
      return (
        startTime <
          booking.endTime.substring(11, 16) &&
        endTime >
          booking.startTime.substring(11, 16) &&
        booking.status !== "Cancelled"
      );
    });
  }, [bookings, startTime, endTime]);

  async function handleBook() {
    if (!resource) {
      showNotification(
        "error",
        "Please select a resource."
      );
      return;
    }

    if (!employeeId) {
      showNotification(
        "error",
        "Please enter Employee ID."
      );
      return;
    }

    if (!startTime || !endTime) {
      showNotification(
        "error",
        "Please select booking time."
      );
      return;
    }

    if (conflict) {
      showNotification(
        "error",
        "Selected slot is already booked."
      );
      return;
    }

    try {
      const today = new Date()
        .toISOString()
        .split("T")[0];

      const res =
        await bookingService.create({
          resourceId: resource.id,
          employeeId: Number(employeeId),
          startTime: `${today}T${startTime}:00`,
          endTime: `${today}T${endTime}:00`,
        });

      if (!res.success) {
        showNotification(
          "error",
          res.message ??
            "Booking failed."
        );
        return;
      }

      showNotification(
        "success",
        "Booking created successfully."
      );

      setEmployeeId("");
      setStartTime("");
      setEndTime("");

      await loadBookings();
    } catch (err: any) {
      console.error(err);

      showNotification(
        "error",
        err?.message ??
          "Booking failed."
      );
    }
  }

  return (
    <div className="space-y-6">
      <ResourceSelector
        value={resource?.id ?? null}
        onChange={setResource}
      />

      {notification && (
        <div
          className={`rounded-lg border p-4 font-medium ${
            notification.type ===
            "success"
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-red-300 bg-red-50 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      {resource && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium">
            Employee ID
          </label>

          <input
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(e.target.value)
            }
            placeholder="Employee ID"
            className="w-full rounded-lg border p-3"
          />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          Loading bookings...
        </div>
      ) : (
        <>
          <BookingTimeline
            bookings={bookings}
            selectedStart={startTime}
            selectedEnd={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
          />

          <ConflictBanner
            conflict={conflict}
          />

          <button
            onClick={handleBook}
            disabled={!resource || conflict}
            className="rounded-lg bg-[#1F6E5A] px-8 py-3 text-white transition hover:bg-[#185847] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Book Resource
          </button>
        </>
      )}
    </div>
  );
}
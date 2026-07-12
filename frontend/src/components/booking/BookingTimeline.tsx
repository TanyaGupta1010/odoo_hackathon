interface Booking {
  id: number;
  title?: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Props {
  bookings: Booking[];
  selectedStart: string;
  selectedEnd: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

const hours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function BookingTimeline({
  bookings,
  selectedStart,
  selectedEnd,
  onStartChange,
  onEndChange,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Booking Timeline
      </h2>

      <div className="space-y-4">
        {hours.map((hour) => {
          const booking = bookings.find((b) => {
            const start = new Date(b.startTime)
              .toTimeString()
              .slice(0, 5);

            return start.startsWith(hour.slice(0, 2));
          });

          return (
            <div
              key={hour}
              className="flex items-center gap-4"
            >
              <div className="w-20 text-sm font-medium text-slate-600">
                {hour}
              </div>

              <div className="flex-1">
                {booking ? (
                  <div className="rounded-lg border border-blue-500 bg-blue-50 px-4 py-3">
                    <p className="font-medium text-blue-700">
                      {booking.title ??
                        "Booked Resource"}
                    </p>

                    <p className="text-sm text-blue-600">
                      {new Date(
                        booking.startTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(
                        booking.endTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.status}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-slate-400">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Start Time
          </label>

          <input
            type="time"
            value={selectedStart}
            onChange={(e) =>
              onStartChange(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            End Time
          </label>

          <input
            type="time"
            value={selectedEnd}
            onChange={(e) =>
              onEndChange(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>
    </div>
  );
}
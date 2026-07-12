interface Props {
  conflict: boolean;
  message?: string;
}

export default function ConflictBanner({
  conflict,
  message,
}: Props) {
  if (!conflict) return null;

  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-5">
      <h3 className="font-semibold text-red-700">
        Booking Conflict
      </h3>

      <p className="mt-2 text-sm text-red-600">
        {message ??
          "The selected time slot overlaps with an existing booking."}
      </p>

      <p className="mt-1 text-sm text-red-500">
        Please choose another time slot.
      </p>
    </div>
  );
}
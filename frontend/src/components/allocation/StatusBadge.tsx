interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const getClasses = () => {
    switch (status.toLowerCase()) {
      case "allocated":
      case "active":
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "returned":
      case "completed":
        return "bg-blue-100 text-blue-700";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${getClasses()}`}
    >
      {status}
    </span>
  );
}
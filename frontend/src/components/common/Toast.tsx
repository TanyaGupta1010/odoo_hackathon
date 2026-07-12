import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose: () => void;
}

export default function Toast({
  open,
  type = "info",
  title,
  message,
  onClose,
}: ToastProps) {
  if (!open) return null;

  const styles = {
    success: {
      icon: <CheckCircle size={22} />,
      color: "bg-green-600",
    },
    error: {
      icon: <AlertCircle size={22} />,
      color: "bg-red-600",
    },
    info: {
      icon: <Info size={22} />,
      color: "bg-blue-600",
    },
  };

  const current = styles[type];

  return (
    <div className="fixed right-6 top-6 z-[9999]">
      <div className="flex min-w-[360px] items-start gap-4 rounded-xl bg-white p-5 shadow-2xl border">
        <div
          className={`rounded-full p-2 text-white ${current.color}`}
        >
          {current.icon}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          {message && (
            <p className="mt-1 text-sm text-slate-500">
              {message}
            </p>
          )}
        </div>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
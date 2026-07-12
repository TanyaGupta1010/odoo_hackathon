import { Info, X } from "lucide-react";
import { useState } from "react";

export default function InfoBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="mt-10 flex items-start justify-between rounded-2xl border border-[#CBEFDF] bg-[#F2FCF7] px-6 py-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F6E5A] text-white">
          <Info size={22} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1F6E5A]">
            Get Started
          </h3>

          <p className="mt-1 text-slate-600">
            Select an asset from the dropdown above to allocate,
            transfer ownership or view its allocation history.
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="text-slate-400 transition hover:text-slate-700"
      >
        <X size={20} />
      </button>
    </div>
  );
}
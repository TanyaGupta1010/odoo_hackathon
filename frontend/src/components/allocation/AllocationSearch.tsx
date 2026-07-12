import { Search, Filter, RotateCcw } from "lucide-react";

interface AllocationSearchProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function AllocationSearch({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: AllocationSearchProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by asset tag, asset name or employee..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm focus:border-[#1F6E5A] focus:ring-2 focus:ring-[#1F6E5A]/10"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-slate-300 py-3 pl-10 pr-8 text-sm focus:border-[#1F6E5A] focus:ring-2 focus:ring-[#1F6E5A]/10"
            >
              <option value="ALL">All Status</option>
              <option value="Allocated">Allocated</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium transition hover:bg-slate-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Archive,
  Wrench,
  History,
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter,
  ArrowUpDown,
  Laptop,
  Printer,
  Tablet,
  Camera,
  Network,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Check,
  X,
  Trash2,
  Eye,
} from "lucide-react";

const stats = [
  {
    label: "TOTAL ASSETS",
    value: "1,482",
    icon: Archive,
    iconClass: "bg-[#EEF2F6] text-[#475467]",
    foot: (
      <span className="flex items-center gap-1 text-[#1F9D6B]">
        <TrendingUp size={13} /> +12 this month
      </span>
    ),
  },
  {
    label: "MAINTENANCE REQ.",
    value: "24",
    icon: Wrench,
    iconClass: "bg-[#FDECEC] text-[#D64545]",
    foot: (
      <span className="flex items-center gap-1 text-[#D64545]">
        <AlertTriangle size={13} /> 4 Critical priority
      </span>
    ),
  },
  {
    label: "OVERDUE ALLOCATION",
    value: "07",
    icon: History,
    iconClass: "bg-[#EEF2F6] text-[#475467]",
    foot: (
      <span className="flex items-center gap-1 text-[#8A97A5]">
        <Clock size={13} /> Sync 5m ago
      </span>
    ),
  },
];

type Group = "all" | "Hardware" | "Mobile" | "Facility";

const filters: { label: string; value: Group }[] = [
  { label: "All (1,482)", value: "all" },
  { label: "Hardware", value: "Hardware" },
  { label: "Mobile", value: "Mobile" },
  { label: "Facility", value: "Facility" },
];

type Status = "available" | "maintenance" | "in-use";

type SortKey = "default" | "name" | "category" | "status";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Default", value: "default" },
  { label: "Asset Name (A–Z)", value: "name" },
  { label: "Category", value: "category" },
  { label: "Status", value: "status" },
];

const statusFilters: { label: string; value: Status | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Available", value: "available" },
  { label: "In use", value: "in-use" },
  { label: "Maintenance", value: "maintenance" },
];

const statusStyles: Record<Status, string> = {
  available: "bg-[#E6F4EC] text-[#1F9D6B]",
  maintenance: "bg-[#FDECEC] text-[#D64545]",
  "in-use": "bg-[#E6F4EC] text-[#1F9D6B]",
};

type AssetRow = {
  id: string;
  name: string;
  icon: React.ElementType;
  category: string;
  group: Exclude<Group, "all">;
  status: Status;
  holder: string;
  holderInitials?: string;
};

const initialAssets: AssetRow[] = [
  { id: "#AF-7721", name: 'MacBook Pro 16" (M3 Max)', icon: Laptop, category: "Hardware", group: "Hardware", status: "available", holder: "Stock Room B" },
  { id: "#AF-8902", name: "Enterprise Plotter HP-Z9", icon: Printer, category: "Peripherals", group: "Hardware", status: "maintenance", holder: "Design Lab 4" },
  { id: "#AF-1143", name: 'iPad Pro 12.9" Gen 6', icon: Tablet, category: "Mobile Hardware", group: "Mobile", status: "in-use", holder: "Jane Doe", holderInitials: "JD" },
  { id: "#AF-5520", name: "Phase One IQ4 Digital Back", icon: Camera, category: "Studio Equip", group: "Facility", status: "available", holder: "Studio A Archive" },
  { id: "#AF-2018", name: "Cisco Catalyst 9300-48P", icon: Network, category: "Networking", group: "Facility", status: "in-use", holder: "Main Server Room" },
];

const forecast = [
  { day: "MAY 18", text: "6 Scheduled", pct: 60, critical: false },
  { day: "MAY 19", text: "2 Scheduled", pct: 30, critical: false },
  { day: "MAY 20", text: "Critical Update Required", pct: 100, critical: true },
];

const warehouse = [
  { label: "Primary Storage", value: "4,200 m³", color: "#1F6E5A" },
  { label: "Cold Storage", value: "1,100 m³", color: "#8FD0B8" },
  { label: "Available", value: "1,800 m³", color: "#D7DEE3" },
];

const StatusPill = ({ status }: { status: Status }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[status]}`}
  >
    {status.replace("-", " ")}
  </span>
);

const CapacityDonut = ({ percent }: { percent: number }) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#EDF1F4" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#1F6E5A"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#1A2B4A]">{percent}%</span>
        <span className="text-[10px] font-semibold tracking-wide text-[#8A97A5]">FILLED</span>
      </div>
    </div>
  );
};

const cardClass = "rounded-2xl border border-[#EAEEF2] bg-white";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Hardware: Laptop,
  Peripherals: Printer,
  "Mobile Hardware": Tablet,
  "Studio Equip": Camera,
  Networking: Network,
};

const groupForCategory = (c: string): Exclude<Group, "all"> =>
  c === "Mobile Hardware"
    ? "Mobile"
    : c === "Hardware" || c === "Peripherals"
      ? "Hardware"
      : "Facility";

const inputClass =
  "w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] px-3 py-2 text-sm text-[#203030] focus:border-[#1F6E5A] focus:bg-white focus:outline-none";

const NewAssetModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (row: AssetRow) => void;
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [statusVal, setStatusVal] = useState<Status>("available");
  const [holder, setHolder] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      id: `#AF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      icon: CATEGORY_ICONS[category] ?? Laptop,
      category,
      group: groupForCategory(category),
      status: statusVal,
      holder: holder.trim() || "Unassigned",
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A2B4A]">New Asset</h2>
          <button onClick={onClose} aria-label="Close" className="text-[#8A97A5] hover:text-[#475467]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              ASSET NAME
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. MacBook Pro 16"'
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              CATEGORY
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {Object.keys(CATEGORY_ICONS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              STATUS
            </label>
            <select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value as Status)}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="in-use">In use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
              CURRENT HOLDER
            </label>
            <input
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="e.g. Stock Room B"
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E1E6EA] px-4 py-2 text-sm font-semibold text-[#475467]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1F6E5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#195C4B]"
            >
              Create Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Assets = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AssetRow[]>(initialAssets);
  const [group, setGroup] = useState<Group>("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [openMenu, setOpenMenu] = useState<"filter" | "sort" | null>(null);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);

  const visible = rows
    .filter((a) => group === "all" || a.group === group)
    .filter((a) => status === "all" || a.status === status)
    .sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "category") return a.category.localeCompare(b.category);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const toggleMenu = (menu: "filter" | "sort") =>
    setOpenMenu((prev) => (prev === menu ? null : menu));

  const deleteAsset = (id: string) => {
    setRows((r) => r.filter((a) => a.id !== id));
    setRowMenu(null);
  };

  return (
    <div className="pb-6">
      {/* Title row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A2B4A]">Asset Inventory</h1>
          <p className="mt-1 text-sm text-[#6B7683]">
            Real-time status of enterprise-wide physical resources.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 rounded-lg bg-[#1F6E5A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#195C4B]"
        >
          <Plus size={16} /> New Asset
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={`${cardClass} flex items-center gap-4 p-5`}>
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconClass}`}>
              <s.icon size={22} />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-[#8A97A5]">{s.label}</p>
              <p className="text-3xl font-bold leading-tight text-[#1A2B4A]">{s.value}</p>
              <p className="mt-0.5 text-[11px] font-medium">{s.foot}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`${cardClass} mt-6`}>
        <div className="relative flex items-center justify-between gap-3 border-b border-[#EAEEF2] p-4">
          {openMenu && (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setOpenMenu(null)}
            />
          )}

          <div className="flex gap-2">
            {/* Filter (by status) */}
            <div className="relative z-20">
              <button
                onClick={() => toggleMenu("filter")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  status !== "all"
                    ? "border-[#1F6E5A] bg-[#F2FBF7] text-[#1F6E5A]"
                    : "border-[#E1E6EA] text-[#475467]"
                }`}
              >
                <Filter size={14} /> Filter
              </button>
              {openMenu === "filter" && (
                <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-[#E1E6EA] bg-white py-1 shadow-lg">
                  {statusFilters.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        setStatus(o.value);
                        setOpenMenu(null);
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-[#475467] hover:bg-[#F5F7F9]"
                    >
                      {o.label}
                      {status === o.value && <Check size={14} className="text-[#1F6E5A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative z-20">
              <button
                onClick={() => toggleMenu("sort")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  sortKey !== "default"
                    ? "border-[#1F6E5A] bg-[#F2FBF7] text-[#1F6E5A]"
                    : "border-[#E1E6EA] text-[#475467]"
                }`}
              >
                <ArrowUpDown size={14} /> Sort
              </button>
              {openMenu === "sort" && (
                <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-[#E1E6EA] bg-white py-1 shadow-lg">
                  {sortOptions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        setSortKey(o.value);
                        setOpenMenu(null);
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-[#475467] hover:bg-[#F5F7F9]"
                    >
                      {o.label}
                      {sortKey === o.value && <Check size={14} className="text-[#1F6E5A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setGroup(f.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  group === f.value
                    ? "bg-[#E6F4EC] text-[#1F6E5A]"
                    : "border border-[#E1E6EA] text-[#6B7683]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-[11px] font-semibold tracking-wide text-[#8A97A5]">
                <th className="px-5 py-3">ASSET ID</th>
                <th className="px-5 py-3">ASSET NAME</th>
                <th className="px-5 py-3">CATEGORY</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">CURRENT HOLDER</th>
                <th className="px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#8A97A5]">
                    No assets match the current filters.
                  </td>
                </tr>
              )}
              {visible.map((a) => (
                <tr key={a.id} className="border-t border-[#EEF1F4] text-sm">
                  <td className="px-5 py-4 font-semibold text-[#475467]">{a.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2F5F8] text-[#475467]">
                        <a.icon size={16} />
                      </span>
                      <span className="font-semibold text-[#1A2B4A]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#475467]">{a.category}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={a.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[#475467]">
                      {a.holderInitials && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DDE5E8] text-[10px] font-bold text-[#5E6C74]">
                          {a.holderInitials}
                        </span>
                      )}
                      {a.holder}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setRowMenu((cur) => (cur === a.id ? null : a.id))
                        }
                        aria-label="Row actions"
                        className="text-[#B4BDC6] hover:text-[#475467]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {rowMenu === a.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setRowMenu(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-[#E1E6EA] bg-white py-1 shadow-lg">
                            <button
                              onClick={() => {
                                setRowMenu(null);
                                alert(`${a.name}\n${a.id} · ${a.category} · ${a.holder}`);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#475467] hover:bg-[#F5F7F9]"
                            >
                              <Eye size={14} /> View details
                            </button>
                            <button
                              onClick={() => deleteAsset(a.id)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#D64545] hover:bg-[#FDECEC]"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAEEF2] p-4 text-xs text-[#8A97A5]">
          <span>
            Showing {visible.length === 0 ? 0 : 1} to {visible.length} of {visible.length} assets
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E1E6EA] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-7 w-7 items-center justify-center rounded-md font-semibold ${
                  page === p ? "bg-[#1F6E5A] text-white" : "text-[#475467] hover:bg-[#F2F5F8]"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1 text-[#B4BDC6]">…</span>
            <button
              onClick={() => setPage(297)}
              className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 font-semibold ${
                page === 297 ? "bg-[#1F6E5A] text-white" : "text-[#475467] hover:bg-[#F2F5F8]"
              }`}
            >
              297
            </button>
            <button
              onClick={() => setPage((p) => Math.min(297, p + 1))}
              disabled={page === 297}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E1E6EA] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Maintenance Forecast */}
        <div className={`${cardClass} p-5`}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1A2B4A]">Maintenance Forecast</h3>
            <button
              onClick={() => navigate("/maintenance")}
              className="text-xs font-semibold text-[#1F6E5A] hover:underline"
            >
              View Timeline
            </button>
          </div>
          <div className="space-y-4">
            {forecast.map((f) => (
              <div key={f.day} className="flex items-center gap-4">
                <span className="w-14 shrink-0 text-[11px] font-semibold text-[#8A97A5]">{f.day}</span>
                <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[#EEF2F5]">
                  <div
                    className={`flex h-full items-center rounded-lg px-3 text-[11px] font-semibold text-white ${
                      f.critical ? "bg-[#C0392B]" : "bg-[#1F6E5A]"
                    }`}
                    style={{ width: `${f.pct}%` }}
                  >
                    {f.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Capacity */}
        <div className={`${cardClass} p-5`}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1A2B4A]">Warehouse Capacity</h3>
            <BarChart3 size={18} className="text-[#8A97A5]" />
          </div>
          <div className="flex items-center gap-8">
            <CapacityDonut percent={75} />
            <div className="space-y-3">
              {warehouse.map((w) => (
                <div key={w.label} className="flex items-center gap-3 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: w.color }} />
                  <span className="flex-1 text-[#475467]">{w.label}</span>
                  <span className="font-semibold text-[#1A2B4A]">{w.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showNew && (
        <NewAssetModal
          onClose={() => setShowNew(false)}
          onCreate={(row) => {
            setRows((r) => [row, ...r]);
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
};

export default Assets;

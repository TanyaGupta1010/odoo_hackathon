import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Plus,
  LineChart,
  Calendar,
  Clock,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

import deploy1 from "../../assets/deploy1.jpg";
import deploy2 from "../../assets/deploy2.jpg";
import Ring from "./Ring";
import { getCurrentUser, firstName } from "../../utils/user";

const allocation = [
  { label: "Industrial Robotics", pct: 82 },
  { label: "Cloud Infrastructure", pct: 64 },
  { label: "Logistics Fleet", pct: 95 },
];

const audits = [
  { name: "Q3 Warehouse Audit", status: "Active" as const, stage: "Verification", done: 28, total: 40 },
  { name: "Fleet Compliance Cycle", status: "Active" as const, stage: "In progress", done: 5, total: 60 },
  { name: "Datacenter Audit 2026", status: "Closed" as const, stage: "Completed", done: 120, total: 120 },
];

const rings = [
  { value: 85, color: "#34D399", label: "ASSET UTILIZATION" },
  { value: 92, color: "#34D399", label: "COMPLIANCE RATING" },
  { value: 78, color: "#F0946B", label: "TEAM EFFICIENCY" },
];

const deployments = [
  { img: deploy1, title: "Project Phoenix: Assembly", id: "#1055" },
  { img: deploy2, title: "Core Power Systems", id: "#1010" },
];

// Build a Monday-first calendar grid for the given month, flagging today.
function buildCalendar(year: number, month: number, todayDate: number) {
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { day: number; muted: boolean; today: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--)
    cells.push({ day: prevMonthDays - i, muted: true, today: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, muted: false, today: d === todayDate });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, muted: true, today: false });
  return cells;
}

const cardClass = "rounded-2xl border border-[#EAEEF2] bg-white p-4";

const SectionHeader = ({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) => (
  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-base font-bold text-[#1A2B4A]">{title}</h3>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-1 text-xs font-semibold text-[#1F6E5A] hover:underline"
      >
        {action}
        <ChevronRight size={13} />
      </button>
    )}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const greeting = firstName(user.name).toUpperCase();

  const today = new Date();
  const currentYear = today.getFullYear();
  const todayDate = today.getDate();

  // Calendar month navigation (0 = current month).
  const [monthOffset, setMonthOffset] = useState(0);
  const viewDate = new Date(currentYear, today.getMonth() + monthOffset, 1);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const calendar = buildCalendar(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    monthOffset === 0 ? todayDate : -1,
  );

  const eventChips = [
    { title: "Quarterly Asset Audit", offset: 4 },
    { title: "Procurement Webinar", offset: 7 },
  ].map((e) => {
    const d = new Date(currentYear, today.getMonth(), todayDate + e.offset);
    return {
      ...e,
      day: d.getDate(),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
  const eventDays = monthOffset === 0 ? new Set(eventChips.map((e) => e.day)) : new Set<number>();

  const milestones = [
    { title: "Robotics Maintenance Cycle", time: "10:30 AM", place: "Sector 4B", icon: Clock, accent: "#1F6E5A", offset: 0 },
    { title: "Electronics Inventory Scan", time: "02:00 PM", place: "Warehouse A", icon: ClipboardCheck, accent: "#8FD0B8", offset: 1 },
    { title: "Quarterly Compliance Audit", time: "09:00 AM", place: "HQ Conference Room", icon: ShieldCheck, accent: "#334155", offset: 4 },
  ].map((m) => {
    const d = new Date(currentYear, today.getMonth(), todayDate + m.offset);
    return {
      ...m,
      day: d.getDate(),
      weekday:
        m.offset === 0 ? "TODAY" : d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    };
  });

  return (
    <div className="pb-10">
      <h1 className="text-2xl font-bold tracking-tight text-[#1A2B4A]">
        HELLO, {greeting}!
      </h1>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Resource Allocation + Key Events */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Resource Allocation */}
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1A2B4A]">Resource Allocation</h3>
                <button onClick={() => navigate("/reports")} aria-label="Analytics">
                  <LineChart size={16} className="text-[#8A97A5] hover:text-[#1F6E5A]" />
                </button>
              </div>

              <div className="space-y-3">
                {allocation.map((a) => (
                  <div key={a.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#475467]">{a.label}</span>
                      <span className="font-bold text-[#1A2B4A]">{a.pct}% In Use</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EEF2F5]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${a.pct}%`,
                          background: a.pct >= 90 ? "#C0392B" : "#1F6E5A",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center border-t border-[#EAEEF2] pt-3">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-[#1A2B4A]">1,240</p>
                  <p className="text-[10px] font-semibold tracking-widest text-[#8A97A5]">
                    TOTAL ASSETS
                  </p>
                </div>
                <span className="h-9 w-px bg-[#EAEEF2]" />
                <div className="flex-1 pl-4">
                  <p className="text-2xl font-bold text-[#1F6E5A]">184</p>
                  <p className="text-[10px] font-semibold tracking-widest text-[#8A97A5]">
                    AVAILABLE
                  </p>
                </div>
              </div>
            </div>

            {/* Audit */}
            <div className={cardClass}>
              <SectionHeader
                title="Audit"
                action="See more"
                onAction={() => navigate("/audit")}
              />
              <div className="space-y-3.5">
                {audits.map((a) => {
                  const pct = Math.round((a.done / a.total) * 100);
                  const active = a.status === "Active";
                  return (
                    <div key={a.name}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1A2B4A]">{a.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            active ? "bg-[#E6F4EC] text-[#1F9D6B]" : "bg-[#EEF2F5] text-[#75808A]"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-[#8A97A5]">
                        <span>{a.stage}</span>
                        <span className="font-semibold text-[#475467]">
                          {a.done}/{a.total} verified
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEF2F5]">
                        <div
                          className="h-full rounded-full bg-[#1F6E5A]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Operations Calendar */}
          <div className={cardClass}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#1F6E5A]" />
                <h3 className="text-base font-bold text-[#1A2B4A]">Operations Calendar</h3>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#475467]">
                <span className="w-28 text-right">{monthLabel}</span>
                <button
                  onClick={() => setMonthOffset((o) => o - 1)}
                  aria-label="Previous month"
                  className="rounded p-0.5 text-[#8A97A5] hover:bg-[#F2F5F8] hover:text-[#1F6E5A]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setMonthOffset((o) => o + 1)}
                  aria-label="Next month"
                  className="rounded p-0.5 text-[#8A97A5] hover:bg-[#F2F5F8] hover:text-[#1F6E5A]"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/booking")}
                  className="ml-1 text-[#1F6E5A] hover:underline"
                >
                  Full Schedule
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Calendar + event chips */}
              <div>
                <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#B4BDC6]">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-[13px]">
                  {calendar.map((c, i) => {
                    const isEvent = !c.muted && eventDays.has(c.day);
                    return (
                      <div key={i} className="flex items-center justify-center">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${
                            c.today
                              ? "bg-[#1F6E5A] font-bold text-white"
                              : isEvent
                                ? "border border-[#1F6E5A] font-semibold text-[#1F6E5A]"
                                : c.muted
                                  ? "text-[#C7CED4]"
                                  : "text-[#475467]"
                          }`}
                        >
                          {c.day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  {eventChips.map((e, i) => (
                    <div
                      key={e.title}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        i === 0 ? "bg-[#F2F5F8]" : "bg-[#EEF6F1]"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1F6E5A]" />
                      <span className="text-xs font-bold text-[#1A2B4A]">{e.label}:</span>
                      <span className="text-xs text-[#475467]">{e.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming milestones */}
              <div>
                <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-[#8A97A5]">
                  UPCOMING MILESTONES
                </p>
                <div className="space-y-4">
                  {milestones.map((m) => (
                    <div key={m.title} className="flex items-center gap-3">
                      <span
                        className="h-11 w-1 shrink-0 rounded-full"
                        style={{ background: m.accent }}
                      />
                      <div className="w-9 shrink-0 text-center">
                        <p className="text-lg font-bold leading-none text-[#1A2B4A]">{m.day}</p>
                        <p className="mt-0.5 text-[9px] font-semibold text-[#8A97A5]">{m.weekday}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#1A2B4A]">{m.title}</p>
                        <p className="text-xs text-[#8A97A5]">
                          {m.time} — {m.place}
                        </p>
                      </div>
                      <m.icon size={16} className="shrink-0 text-[#8A97A5]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Deployments */}
          <div className={cardClass}>
            <SectionHeader title="Active Deployments" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {deployments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate("/assets")}
                  className="relative h-36 overflow-hidden rounded-xl text-left"
                >
                  <img src={d.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <p className="text-sm font-bold">{d.title}</p>
                    <p className="text-[10px] font-semibold tracking-wide text-white/70">
                      DEPLOYMENT ID: {d.id}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Enterprise Performance */}
          <div className="flex flex-col rounded-2xl bg-[#16283D] p-5 text-white">
            <h3 className="text-base font-bold">Enterprise Performance</h3>
            <div className="mt-5 flex flex-col items-center gap-5">
              {rings.map((r) => (
                <Ring key={r.label} value={r.value} color={r.color} label={r.label} />
              ))}
            </div>
            <button
              onClick={() => navigate("/reports")}
              className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#4ADE9A] hover:underline"
            >
              View Detailed Analytics
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Critical Updates */}
          <div className={cardClass}>
            <div className="mb-3 flex items-center gap-2 text-[#1A2B4A]">
              <Zap size={16} className="text-[#1F6E5A]" />
              <span className="text-xs font-bold tracking-[0.15em] text-[#8A97A5]">
                CRITICAL UPDATES
              </span>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/maintenance")}
                className="block w-full border-l-2 border-[#E5484D] pl-3 text-left"
              >
                <p className="text-sm font-semibold text-[#1A2B4A]">Maintenance Overdue</p>
                <p className="text-xs text-[#8A97A5]">Sensor #901 in Server Room B</p>
              </button>
              <button
                onClick={() => navigate("/assets")}
                className="block w-full border-l-2 border-[#1F6E5A] pl-3 text-left"
              >
                <p className="text-sm font-semibold text-[#1A2B4A]">New Inventory Arrived</p>
                <p className="text-xs text-[#8A97A5]">15x Robotic Arm Assemblies</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-[#A2ACB6]">
        © {currentYear} AssetFlow Enterprise ERP. Powered by Precision &amp; Growth Systems.
      </footer>

      {/* Floating action button */}
      <button
        onClick={() => navigate("/assets")}
        aria-label="Add asset"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F6E5A] text-white shadow-lg transition hover:bg-[#195C4B]"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Dashboard;

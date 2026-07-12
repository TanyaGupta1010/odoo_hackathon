import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, TrendingUp, AlertTriangle, Play, HelpCircle } from "lucide-react";

const departmentData = [
  { name: "Engineering", utilization: 84 },
  { name: "Facilities", utilization: 92 },
  { name: "Field Ops", utilization: 75 },
  { name: "HR", utilization: 45 },
  { name: "Marketing", utilization: 68 },
];

const maintenanceData = [
  { month: "Jan", count: 4 },
  { month: "Feb", count: 8 },
  { month: "Mar", count: 6 },
  { month: "Apr", count: 12 },
  { month: "May", count: 9 },
  { month: "Jun", count: 15 },
  { month: "Jul", count: 17 },
];

const Reports = () => {
  const exportCSV = () => {
    // Generate simple CSV download for mockup purposes
    const headers = "Asset Tag,Asset Name,Category,Status,Utilization Count\n";
    const rows = [
      "Room B2,HQ Meeting Space,Spaces,Available,34",
      "Van AF-343,Ford Transit Shuttle,Vehicles,Available,21",
      "Projector AF-335,Epson projector,Electronics,Under Maintenance,18",
    ].join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "AssetFlow_Utilization_Report.csv");
    a.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#203030]">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-[#75808A]">
            Actionable operation insights, asset utilization, and maintenance logs.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1F6E5A] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#2C8A71]"
        >
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Utilization by Department */}
        <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#203030] mb-4">Utilization by Department (%)</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7F9" />
                <XAxis dataKey="name" stroke="#75808A" fontSize={11} tickLine={false} />
                <YAxis stroke="#75808A" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip cursor={{ fill: "#F8FAFB" }} />
                <Bar dataKey="utilization" fill="#1F6E5A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Frequency */}
        <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#203030] mb-4">Maintenance Frequency (Monthly)</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7F9" />
                <XAxis dataKey="month" stroke="#75808A" fontSize={11} tickLine={false} />
                <YAxis stroke="#75808A" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#D64545" strokeWidth={3} dot={{ fill: "#D64545", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid of Tables/Lists */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Most Used vs Idle Assets */}
        <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-[#203030] mb-3">Most Used Assets</h3>
            <div className="divide-y divide-[#E7ECEF]">
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-[#203030]">Room B2</span>
                  <p className="text-xs text-[#75808A]">HQ Main Conference Space</p>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  34 bookings this month
                </span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-[#203030]">Van AF-343</span>
                  <p className="text-xs text-[#75808A]">Ford Transit Operations Shuttle</p>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  21 trips this month
                </span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-[#203030]">Projector AF-335</span>
                  <p className="text-xs text-[#75808A]">Epson Wireless HD Projector</p>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  18 uses
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#203030] mb-3">Idle Assets</h3>
            <div className="divide-y divide-[#E7ECEF]">
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-[#203030]">Camera AF-0301</span>
                  <p className="text-xs text-[#75808A]">Sony DSLR Mirrorless Kit</p>
                </div>
                <span className="rounded-full bg-slate-50 border border-[#E7ECEF] px-3 py-1 text-xs font-bold text-[#75808A]">
                  unused 60+ days
                </span>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-[#203030]">Chair AF-0410</span>
                  <p className="text-xs text-[#75808A]">High-back Swivel Chair</p>
                </div>
                <span className="rounded-full bg-slate-50 border border-[#E7ECEF] px-3 py-1 text-xs font-bold text-[#75808A]">
                  unused 45 days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Forecast & Retirement */}
        <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#203030] mb-4">Assets Due for Maintenance / Nearing Retirement</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
              <AlertTriangle className="shrink-0 text-amber-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-sm text-[#203030]">Forklift AF-0087</h4>
                <p className="text-xs text-[#75808A] mt-0.5">Toyota Heavy Duty Reach Truck</p>
                <span className="inline-block mt-2 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  Service due in 5 days
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-800">
              <AlertTriangle className="shrink-0 text-red-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-sm text-[#203030]">Laptop AF-0020</h4>
                <p className="text-xs text-[#75808A] mt-0.5">Apple MacBook Pro 16-inch</p>
                <span className="inline-block mt-2 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                  4 years old : nearing retirement
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

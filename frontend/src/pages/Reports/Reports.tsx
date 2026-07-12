import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, AlertTriangle } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

interface DepartmentUtilization {
  name: string;
  utilization: number;
}

interface MaintenanceFrequency {
  month: string;
  count: number;
}

interface MostUsedAsset {
  assetTag: string;
  name: string;
  category: string;
  bookingsCount: number;
}

interface IdleAsset {
  assetTag: string;
  name: string;
  idleDays: number;
}

interface DueForMaintenanceAsset {
  id: number;
  name: string;
  assetTag: string;
  type: string;
  label: string;
}

interface ReportSummary {
  utilizationByDepartment: DepartmentUtilization[];
  maintenanceFrequency: MaintenanceFrequency[];
  mostUsedAssets: MostUsedAsset[];
  idleAssets: IdleAsset[];
  dueForMaintenance: DueForMaintenanceAsset[];
}

const Reports = () => {
  const [data, setData] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/reports/summary`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch reports summary from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const exportCSV = () => {
    if (!data) return;
    const headers = "Asset Tag,Asset Name,Category/Details,Type/Activity Metric\n";
    
    // Add most used
    let rows = data.mostUsedAssets.map(
      (a) => `"${a.assetTag}","${a.name}","${a.category}","${a.bookingsCount} Bookings"`
    );
    // Add idle
    rows = rows.concat(
      data.idleAssets.map(
        (a) => `"${a.assetTag}","${a.name}","Idle Assets","Unused ${a.idleDays} Days"`
      )
    );
    // Add due/retirement
    rows = rows.concat(
      data.dueForMaintenance.map(
        (a) => `"${a.assetTag}","${a.name}","Alerts","${a.label}"`
      )
    );

    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "AssetFlow_Analytics_Report.csv");
    a.click();
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-sm font-semibold text-[#75808A]">
        Loading reports & analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-800">
        {error || "Failed to load dashboard data."}
      </div>
    );
  }

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
              <BarChart data={data.utilizationByDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <LineChart data={data.maintenanceFrequency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              {data.mostUsedAssets.map((asset, index) => (
                <div key={index} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-[#203030]">{asset.assetTag}</span>
                    <p className="text-xs text-[#75808A]">{asset.name}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    {asset.bookingsCount} bookings
                  </span>
                </div>
              ))}
              {data.mostUsedAssets.length === 0 && (
                <div className="text-center py-4 text-xs text-[#75808A]">No booking analytics yet.</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#203030] mb-3">Idle Assets</h3>
            <div className="divide-y divide-[#E7ECEF]">
              {data.idleAssets.map((asset, index) => (
                <div key={index} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-[#203030]">{asset.assetTag}</span>
                    <p className="text-xs text-[#75808A]">{asset.name}</p>
                  </div>
                  <span className="rounded-full bg-slate-50 border border-[#E7ECEF] px-3 py-1 text-xs font-bold text-[#75808A]">
                    unused {asset.idleDays}+ days
                  </span>
                </div>
              ))}
              {data.idleAssets.length === 0 && (
                <div className="text-center py-4 text-xs text-[#75808A]">No idle assets found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Maintenance Forecast & Retirement */}
        <div className="rounded-2xl border border-[#E7ECEF] bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#203030] mb-4">Assets Due for Maintenance / Nearing Retirement</h3>
          <div className="flex flex-col gap-4">
            {data.dueForMaintenance.map((asset, index) => {
              const isRetirement = asset.type === "retirement";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 rounded-xl border p-4 ${
                    isRetirement
                      ? "border-red-100 bg-red-50 text-red-800"
                      : "border-amber-100 bg-amber-50 text-amber-800"
                  }`}
                >
                  <AlertTriangle className={`shrink-0 mt-0.5 ${isRetirement ? "text-red-600" : "text-amber-600"}`} size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-[#203030]">{asset.name} ({asset.assetTag})</h4>
                    <span
                      className={`inline-block mt-2 rounded px-2 py-0.5 text-[10px] font-bold ${
                        isRetirement ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {asset.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {data.dueForMaintenance.length === 0 && (
              <div className="text-center py-8 text-xs text-[#75808A]">No warnings or maintenance updates.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, AlertCircle, CheckCircle, Calendar, ArrowRightLeft } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

interface ActivityLog {
  id: number;
  actorId?: number;
  actionType: string;
  details: string;
  createdAt: string;
  actor?: {
    id: number;
    name: string;
  };
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const getNotificationStyle = (actionType: string) => {
  const type = actionType.toUpperCase();
  if (type.includes("ALERT") || type.includes("DISCREPANCY") || type.includes("OVERDUE")) {
    return {
      icon: AlertCircle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    };
  }
  if (type.includes("BOOKING")) {
    return {
      icon: Calendar,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    };
  }
  if (type.includes("TRANSFER")) {
    return {
      icon: ArrowRightLeft,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    };
  }
  return {
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Alerts" | "Approvals" | "Bookings">("All");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      // Build filter query param based on activeTab selection
      const filterParam = activeTab === "All" ? "" : `?type=${activeTab}`;
      const res = await axios.get(`${API_BASE}/notifications${filterParam}`);
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch notification feed from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#203030]">Activity Logs & Notifications</h1>
        <p className="mt-1 text-sm text-[#75808A]">
          Track organization activity, approvals status, and resource alerts.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#E7ECEF] bg-white rounded-t-2xl p-4 gap-2">
        {(["All", "Alerts", "Approvals", "Bookings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              activeTab === tab
                ? "bg-[#1F6E5A] text-white"
                : "text-[#75808A] hover:bg-[#F8FAFB] hover:text-[#203030]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Notification Feed List */}
      <div className="rounded-2xl border border-[#E7ECEF] bg-white shadow-sm overflow-hidden divide-y divide-[#E7ECEF]">
        {loading ? (
          <div className="flex h-[200px] items-center justify-center text-xs font-semibold text-[#75808A]">
            Loading activities...
          </div>
        ) : logs.map((log) => {
          const style = getNotificationStyle(log.actionType);
          const IconComponent = style.icon;
          return (
            <div
              key={log.id}
              className="flex items-center justify-between p-5 transition hover:bg-[#F8FAFB]"
            >
              <div className="flex items-center gap-4">
                {/* Status Indicator Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.color}`}>
                  <IconComponent size={20} />
                </div>
                <div className="text-sm font-semibold text-[#203030]">
                  {log.details}
                </div>
              </div>
              <div className="text-xs font-medium text-[#75808A] shrink-0 ml-4">
                {getRelativeTime(log.createdAt)}
              </div>
            </div>
          );
        })}

        {!loading && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-[#75808A]">
            <Bell size={32} className="mb-2 opacity-30 text-[#1F6E5A]" />
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

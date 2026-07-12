import React, { useState } from "react";
import { Bell, AlertCircle, CheckCircle, Calendar, ArrowRightLeft, FileText } from "lucide-react";

interface NotificationItem {
  id: number;
  type: "Alert" | "Approval" | "Booking" | "Log";
  message: string;
  time: string;
  icon: any;
  color: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "Approval",
    message: "Laptop AF-0014 assigned to Priya shah",
    time: "2m ago",
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    id: 2,
    type: "Approval",
    message: "Maintenance request AF-0055 approved",
    time: "18m ago",
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    id: 3,
    type: "Booking",
    message: "Booking confirmed : Room B2 : 2:00 to 3:00 PM",
    time: "1h ago",
    icon: Calendar,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    id: 4,
    type: "Approval",
    message: "Transfer approved : AF-0033 to facilities dept",
    time: "3h ago",
    icon: ArrowRightLeft,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    id: 5,
    type: "Alert",
    message: "Overdue return : AF-0021 was due 3 days ago",
    time: "1d ago",
    icon: AlertCircle,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    id: 6,
    type: "Alert",
    message: "audit discrepancy flagged : AF-0088 damaged",
    time: "2d ago",
    icon: AlertCircle,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Alerts" | "Approvals" | "Bookings">("All");

  const filteredNotifications = initialNotifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Alerts") return n.type === "Alert";
    if (activeTab === "Approvals") return n.type === "Approval";
    if (activeTab === "Bookings") return n.type === "Booking";
    return true;
  });

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

      {/* Notification Feed List */}
      <div className="rounded-2xl border border-[#E7ECEF] bg-white shadow-sm overflow-hidden divide-y divide-[#E7ECEF]">
        {filteredNotifications.map((notif) => {
          const IconComponent = notif.icon;
          return (
            <div
              key={notif.id}
              className="flex items-center justify-between p-5 transition hover:bg-[#F8FAFB]"
            >
              <div className="flex items-center gap-4">
                {/* Status Indicator Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${notif.color}`}>
                  <IconComponent size={20} />
                </div>
                <div className="text-sm font-semibold text-[#203030]">
                  {notif.message}
                </div>
              </div>
              <div className="text-xs font-medium text-[#75808A] shrink-0 ml-4">
                {notif.time}
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
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

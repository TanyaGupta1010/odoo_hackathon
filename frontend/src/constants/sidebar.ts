import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowRightLeft,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Organization Setup",
    icon: Building2,
    path: "/organization",
    adminOnly: true,
  },
  {
    title: "Assets",
    icon: Package,
    path: "/assets",
  },
  {
    title: "Allocation & Transfer",
    icon: ArrowRightLeft,
    path: "/allocation",
  },
  {
    title: "Resource Booking",
    icon: CalendarDays,
    path: "/booking",
  },
  {
    title: "Maintenance",
    icon: Wrench,
    path: "/maintenance",
  },
  {
    title: "Audit",
    icon: ClipboardCheck,
    path: "/audit",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
];
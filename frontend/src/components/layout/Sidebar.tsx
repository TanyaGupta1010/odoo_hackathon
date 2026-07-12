import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Organization Setup", path: "/organization" },
  { name: "Assets", path: "/assets" },
  { name: "Allocation & Transfer", path: "/allocation" },
  { name: "Resource Booking", path: "/booking" },
  { name: "Maintenance", path: "/maintenance" },
  { name: "Audit", path: "/audit" },
  { name: "Reports", path: "/reports" },
  { name: "Notifications", path: "/notifications" },
];

export default function Sidebar() {
  return (
    <aside className="w-48 bg-white border-r border-[#E7ECEF] flex flex-col">

      <div className="px-4 py-4 border-b border-[#E7ECEF]">
        <h1 className="font-bold text-lg text-[#203030]">
          AssetFlow
        </h1>
      </div>

      <nav className="flex flex-col gap-1 p-3">

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              px-3
              py-2
              text-sm
              rounded
              transition
              ${
                isActive
                  ? "border border-[#1F6E5A] text-[#1F6E5A] bg-[#F7FCFA]"
                  : "text-[#303030] hover:bg-gray-50"
              }
            `
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>
    </aside>
  );
}
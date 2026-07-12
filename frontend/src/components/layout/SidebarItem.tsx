import { NavLink } from "react-router-dom";

type SidebarItemProps = {
  title: string;
  icon: React.ElementType;
  path: string;
  adminOnly?: boolean;
};

const SidebarItem = ({ title, icon: Icon, path }: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
          isActive
            ? "bg-[#EEF7F4] text-[#1F6E5A] font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <Icon size={20} />
      <span>{title}</span>
    </NavLink>
  );
};

export default SidebarItem;
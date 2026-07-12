import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "../../constants/sidebar";
import { getCurrentUser, clearCurrentUser } from "../../utils/user";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-[#E6EAEE] bg-white">
      {/* Logo */}
      <div className="shrink-0 px-6 pt-6 pb-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1F6E5A]">
          AssetFlow
        </h1>
      </div>

      {/* Profile */}
      <div className="flex shrink-0 flex-col items-center px-4 pb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DDE5E8] text-2xl font-bold text-[#5E6C74]">
          {user.initials}
        </div>

        <h2 className="mt-3 w-full break-words text-center text-lg font-semibold text-[#203030]">
          {user.name}
        </h2>

        <p className="mt-0.5 text-sm text-[#667085]">{user.role}</p>
      </div>

      {/* Menu (scrolls if it can't all fit) */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.title} {...item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-[#E6EAEE] p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#475467] transition hover:bg-[#F5F7F9]"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import SidebarItem from "./SidebarItem";
import { sidebarItems } from "../../constants/sidebar";

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-[#E6EAEE] bg-white">
      {/* Logo */}
      <div className="shrink-0 px-6 pt-6 pb-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1F6E5A]">
          AssetFlow
        </h1>
      </div>

      {/* Menu (scrolls if it can't all fit) */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.title} {...item} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

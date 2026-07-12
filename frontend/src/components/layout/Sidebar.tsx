import { LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "../../constants/sidebar";

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-[#E6EAEE] bg-white">

      {/* Logo */}

      <div className="px-8 pt-8 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1F6E5A]">
          AssetFlow
        </h1>
      </div>

      {/* Profile */}

      <div className="flex flex-col items-center px-6">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DDE5E8] text-3xl font-bold text-[#5E6C74]">
          ST
        </div>

        <h2 className="mt-5 text-[22px] font-semibold text-[#203030]">
          Sophia Thompson
        </h2>

        <p className="mt-1 text-base text-[#667085]">
          Lead Asset Manager
        </p>

      </div>

      {/* Menu */}

      <nav className="mt-8 flex flex-1 flex-col gap-2 px-4">

        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.title}
            {...item}
          />
        ))}

      </nav>

      {/* Logout */}

      <div className="border-t border-[#E6EAEE] p-4">

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#475467] transition hover:bg-[#F5F7F9]">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
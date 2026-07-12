import { Bell, Search, Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="flex h-24 items-center justify-between border-b border-[#E6EAEE] bg-white px-10">

      <div className="relative w-[600px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search assets, teams or schedules..."
          className="w-full rounded-xl border border-[#D0D5DD] bg-white py-4 pl-12 pr-4 text-[16px] outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell
          size={28}
          className="cursor-pointer text-[#344054]"
        />

        <Settings
          size={28}
          className="cursor-pointer text-[#344054]"
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F6E5A] font-semibold text-white">
          ST
        </div>

      </div>

    </header>
  );
};

export default Header;
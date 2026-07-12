import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { getCurrentUser, clearCurrentUser } from "../../utils/user";

const Header = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/login", { replace: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative flex h-24 items-center justify-between border-b border-[#E6EAEE] bg-white px-10">
      {/* Search Bar */}
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

      {/* Nav Controls */}
      <div className="flex items-center gap-6 relative">
        <Bell
          size={28}
          onClick={() => navigate("/notifications")}
          className="cursor-pointer text-[#344054] hover:text-[#1F6E5A] transition"
        />

        <div className="relative" ref={dropdownRef}>
          <Settings
            size={28}
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className={`cursor-pointer transition hover:text-[#1F6E5A] ${
              showSettingsDropdown ? "text-[#1F6E5A]" : "text-[#344054]"
            }`}
          />

          {/* Settings / Profile Dropdown Menu */}
          {showSettingsDropdown && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-[#E7ECEF] bg-white p-5 shadow-xl z-50 animate-fade-in">
              {/* Profile Details */}
              <div className="flex items-center gap-4 border-b border-[#E7ECEF] pb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F6E5A]/10 text-lg font-bold text-[#1F6E5A]">
                  {user.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#203030] truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-[#75808A] mt-0.5 truncate">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex flex-col gap-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Initials badge */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F6E5A] font-semibold text-white">
          {user.initials}
        </div>
      </div>
    </header>
  );
};

export default Header;
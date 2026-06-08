import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

const PosterHeader = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex-shrink-0 h-14 z-10 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-4 shadow-sm">
      <button className="relative text-gray-500 hover:text-[#0A6E5C] transition-colors">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-[#111827]">Poster</p>
          <p className="text-xs text-[#0A6E5C] font-semibold">
            {user?.name || ""}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-xs">
          {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
        </div>
      </div>
    </div>
  );
};

export default PosterHeader;

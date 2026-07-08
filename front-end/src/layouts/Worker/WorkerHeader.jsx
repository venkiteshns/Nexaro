import { Bell, ToggleLeft, ToggleRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

const WorkerHeader = () => {
  const user = useSelector((state) => state.auth.user);

  const [isLive, setIsLive] = useState(true);

  return (
    <div className="flex-shrink-0 h-14 z-10 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-4 shadow-sm">

      <button
        onClick={() => setIsLive(!isLive)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${isLive
            ? "bg-emerald-50 border-emerald-300 text-[#0A6E5C]"
            : "bg-gray-100 border-gray-200 text-gray-500"
          }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${isLive ? "bg-[#0A6E5C]" : "bg-gray-400"
            }`}
        />
        {isLive ? "You are Live" : "You are Offline"}
        {isLive ? (
          <ToggleRight size={18} className="text-[#0A6E5C]" />
        ) : (
          <ToggleLeft size={18} className="text-gray-400" />
        )}
      </button>

      <button className="relative text-gray-500 hover:text-[#0A6E5C] transition-colors">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
        <span className="text-xs font-bold text-[#0A6E5C]">₹12,450</span>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-[#111827]">Worker</p>
          <p className="text-xs text-[#0A6E5C] font-semibold">
            {user?.name || ""}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-xs">
          {user?.name ? user.name.charAt(0).toUpperCase() : "W"}
        </div>
      </div>
    </div>
  );
};

export default WorkerHeader;

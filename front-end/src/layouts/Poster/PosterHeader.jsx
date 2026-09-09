import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetPosterUnreadCountQuery } from "../../store/services/posterApi";

const PosterHeader = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { data: unreadData } = useGetPosterUnreadCountQuery();
  const unreadCount = unreadData?.unreadCount || 0;

  return (
    <div className="shrink-0 h-14 z-10 bg-white border-b border-gray-200 pl-16 md:pl-6 pr-6 flex items-center justify-end gap-4 shadow-sm">
      <button
        type="button"
        onClick={() => navigate("/poster/notifications")}
        className="relative p-2 rounded-xl text-gray-500 hover:text-[#0A6E5C] hover:bg-emerald-50 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[#0A6E5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-2xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
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

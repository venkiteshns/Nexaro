import { Bell, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetWorkerUnreadCountQuery,
  useGetWorkerHeaderStatusQuery,
  useToggleWorkerLiveStatusMutation,
} from "../../store/services/workerApi";
import { updateUserLiveStatus } from "../../store/Slices/UserSlice";
import { showSuccess, showWarning, showError } from "../../utils/toast";

const WorkerHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Unread notifications count
  const { data: unreadData } = useGetWorkerUnreadCountQuery();
  const unreadCount = unreadData?.unreadCount || 0;

  // Real-time worker header status (live state + wallet balance) from DB
  const { data: headerStatus, isLoading: isStatusLoading } = useGetWorkerHeaderStatusQuery();
  const [toggleLive, { isLoading: isToggling }] = useToggleWorkerLiveStatusMutation();

  const isLive = headerStatus?.isLive ?? user?.worker?.isLive ?? true;
  const walletAmount = headerStatus?.walletAmount ?? 0;

  const handleToggleLive = async () => {
    if (isToggling) return;
    const nextState = !isLive;
    try {
      const res = await toggleLive({ isLive: nextState }).unwrap();
      dispatch(updateUserLiveStatus(res.isLive));
      if (res.isLive) {
        showSuccess(res.message || "You are now Live!");
      } else {
        showWarning(res.message || "You are now Offline.");
      }
    } catch (error) {
      showError(error?.data?.message || "Failed to update live status");
    }
  };

  return (
    <div className="shrink-0 h-14 z-10 bg-white border-b border-gray-200 pl-14 pr-6 md:px-6 flex items-center justify-end gap-4 shadow-sm">
      {/* Live / Offline Toggle Button */}
      <button
        type="button"
        onClick={handleToggleLive}
        disabled={isToggling}
        title={isLive ? "Click to go offline" : "Click to go live"}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
          isLive
            ? "bg-emerald-50 border-emerald-300 text-[#0A6E5C] hover:bg-emerald-100/50"
            : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200/60"
        } ${isToggling ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isLive ? "bg-[#0A6E5C] animate-pulse" : "bg-gray-400"
          }`}
        />
        <span>{isLive ? "You are Live" : "You are Offline"}</span>
        {isToggling ? (
          <Loader2 size={16} className="animate-spin text-gray-400" />
        ) : isLive ? (
          <ToggleRight size={18} className="text-[#0A6E5C]" />
        ) : (
          <ToggleLeft size={18} className="text-gray-400" />
        )}
      </button>

      {/* Notifications Bell */}
      <button
        onClick={() => navigate("/worker/notifications")}
        className="relative p-2 rounded-xl text-gray-500 hover:text-[#0A6E5C] hover:bg-emerald-50 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[#0A6E5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Real-time Wallet Balance */}
      <button
        type="button"
        onClick={() => navigate("/worker/earnings")}
        title="View Wallet & Earnings"
        className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#0A6E5C] hover:bg-emerald-50/20 rounded-xl px-3 py-1 shadow-2xs transition-all cursor-pointer group"
      >
        <span className="text-xs font-bold text-[#0A6E5C]">
          ₹{Number(walletAmount || 0).toLocaleString("en-IN")}
        </span>
      </button>

      {/* Worker Profile Avatar & Name */}
      <div
        onClick={() => navigate("/worker/profile")}
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-3 py-1 shadow-2xs cursor-pointer transition-colors"
        title="View Profile"
      >
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-[#111827]">Worker</p>
          <p className="text-xs text-[#0A6E5C] font-semibold truncate max-w-[110px]">
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

import { Bell, ToggleLeft, ToggleRight, Loader2, Wallet, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetWorkerUnreadCountQuery,
  useGetWorkerHeaderStatusQuery,
  useToggleWorkerLiveStatusMutation,
} from "../../../store/services/workerApi";
import { updateUserLiveStatus } from "../../../store/Slices/UserSlice";
import { showSuccess, showWarning, showError } from "../../../utils/toast";

const WorkerDashboardHeader = ({ onMenuClick, userName: propUserName, walletAmount: propWalletAmount, isLive: propIsLive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { data: unreadData } = useGetWorkerUnreadCountQuery();
  const unreadCount = unreadData?.unreadCount || 0;

  const { data: headerStatus } = useGetWorkerHeaderStatusQuery();
  const [toggleLive, { isLoading: isToggling }] = useToggleWorkerLiveStatusMutation();

  const isLive = headerStatus?.isLive ?? propIsLive ?? user?.worker?.isLive ?? true;
  const walletAmount = headerStatus?.walletAmount ?? propWalletAmount ?? 0;
  const displayName = propUserName || user?.name || "Alex";

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
    <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-2.5 sticky top-0 z-30 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        {/* Left: Mobile Menu & Greeting */}
        <div className="flex items-center gap-2.5">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-gray-600 hover:text-[#0A6E5C] hover:bg-emerald-50 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu size={19} />
            </button>
          )}

          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
              Find Work, <span className="text-[#0A6E5C]">{displayName}</span>
            </h1>
            <p className="text-[11px] text-gray-400">
              Check out the latest opportunities in your area.
            </p>
          </div>
        </div>

        {/* Right: Live Toggle, Notifications, Wallet, Profile */}
        <div className="flex items-center flex-wrap gap-2 self-end md:self-auto">
          {/* Live Status Toggle Pill */}
          <button
            type="button"
            onClick={handleToggleLive}
            disabled={isToggling}
            title={isLive ? "Click to go offline" : "Click to go live"}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isLive
                ? "bg-emerald-50 border-emerald-300 text-[#0A6E5C] hover:bg-emerald-100/60"
                : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200/70"
            } ${isToggling ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLive ? "bg-[#0A6E5C] animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="font-bold text-xs">{isLive ? "You are Live" : "You are Offline"}</span>
            {isToggling ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : isLive ? (
              <ToggleRight size={16} className="text-[#0A6E5C]" />
            ) : (
              <ToggleLeft size={16} className="text-gray-400" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => navigate("/worker/notifications")}
            className="relative p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-[#0A6E5C] hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#0A6E5C] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Wallet Balance Badge */}
          <button
            type="button"
            onClick={() => navigate("/worker/earnings")}
            title="View Wallet & Earnings"
            className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-200/90 hover:border-[#0A6E5C] hover:bg-emerald-100/40 rounded-full px-3 py-1 shadow-2xs transition-all cursor-pointer group"
          >
            <Wallet size={14} className="text-[#0A6E5C] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-extrabold text-[#0A6E5C]">
              ₹{Number(walletAmount || 0).toLocaleString("en-IN")}
            </span>
          </button>

          {/* Worker Profile Avatar */}
          <div
            onClick={() => navigate("/worker/profile")}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#0A6E5C] rounded-full p-0.5 sm:px-2 sm:py-0.5 shadow-2xs cursor-pointer transition-colors"
            title="View Profile"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-[11px] shrink-0">
              {displayName ? displayName.charAt(0).toUpperCase() : "W"}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-gray-800 truncate max-w-[80px]">
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkerDashboardHeader;

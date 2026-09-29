import { useEffect } from "react";
import { Bell, ToggleLeft, ToggleRight, Loader2, Wallet, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetWorkerUnreadCountQuery,
  useGetWorkerHeaderStatusQuery,
  useToggleWorkerLiveStatusMutation,
  useGetWorkerProfileQuery,
} from "../../../store/services/workerApi";
import { updateUserLiveStatus, updateUser } from "../../../store/Slices/UserSlice";
import { showSuccess, showWarning, showError } from "../../../utils/toast";
import UserAvatar from "../../sharedComponents/UserAvatar";

const WorkerDashboardHeader = ({ onMenuClick, userName: propUserName, walletAmount: propWalletAmount, isLive: propIsLive, avatar: propAvatar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { data: profileData } = useGetWorkerProfileQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const workerProfile = profileData?.profileData;

  const { data: unreadData } = useGetWorkerUnreadCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const unreadCount = unreadData?.unreadCount || 0;

  const { data: headerStatus } = useGetWorkerHeaderStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [toggleLive, { isLoading: isToggling }] = useToggleWorkerLiveStatusMutation();

  const isLive = headerStatus?.isLive ?? propIsLive ?? user?.worker?.isLive ?? true;
  const walletAmount = headerStatus?.walletAmount ?? propWalletAmount ?? 0;
  const displayName = propUserName || workerProfile?.name || user?.name || "Alex";

  useEffect(() => {
    const avatarUrl = workerProfile?.avatar || workerProfile?.selfie || propAvatar;
    if (avatarUrl && avatarUrl !== user?.avatar && avatarUrl !== user?.selfie) {
      dispatch(updateUser({ avatar: avatarUrl, selfie: avatarUrl }));
    }
  }, [workerProfile?.avatar, workerProfile?.selfie, propAvatar, user?.avatar, user?.selfie, dispatch]);

  const displayUser = {
    ...user,
    ...(workerProfile || {}),
    name: displayName,
    avatar: propAvatar || workerProfile?.avatar || user?.avatar || user?.selfie,
    selfie: propAvatar || workerProfile?.avatar || user?.selfie || user?.avatar,
  };

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
        {/* Left: Mobile Menu Clearance & Greeting */}
        <div className="flex items-center gap-2.5 pl-12 md:pl-0 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-gray-600 hover:text-[#0A6E5C] hover:bg-emerald-50 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu size={19} />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 tracking-tight truncate">
              Find Work, <span className="text-[#0A6E5C]">{displayName}</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
              Check out the latest opportunities in your area.
            </p>
          </div>
        </div>

        {/* Right: Live Toggle, Notifications, Wallet, Profile */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 pt-0.5 md:pt-0">
          {/* Live Status Toggle Pill */}
          <button
            type="button"
            onClick={handleToggleLive}
            disabled={isToggling}
            title={isLive ? "Click to go offline" : "Click to go live"}
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 ${
              isLive
                ? "bg-emerald-50 border-emerald-300 text-[#0A6E5C] hover:bg-emerald-100/60"
                : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200/70"
            } ${isToggling ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isLive ? "bg-[#0A6E5C] animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="font-bold text-xs whitespace-nowrap">
              <span className="hidden min-[380px]:inline">You are </span>
              {isLive ? "Live" : "Offline"}
            </span>
            {isToggling ? (
              <Loader2 size={13} className="animate-spin text-gray-400 shrink-0" />
            ) : isLive ? (
              <ToggleRight size={15} className="text-[#0A6E5C] shrink-0" />
            ) : (
              <ToggleLeft size={15} className="text-gray-400 shrink-0" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => navigate("/worker/notifications")}
            className="relative p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-[#0A6E5C] hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer shadow-2xs shrink-0"
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
            className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-200/90 hover:border-[#0A6E5C] hover:bg-emerald-100/40 rounded-full px-2.5 sm:px-3 py-1 shadow-2xs transition-all cursor-pointer group shrink-0"
          >
            <Wallet size={13} className="text-[#0A6E5C] group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-xs font-extrabold text-[#0A6E5C] whitespace-nowrap">
              ₹{Number(walletAmount || 0).toLocaleString("en-IN")}
            </span>
          </button>

          {/* Worker Profile Avatar */}
          <div
            onClick={() => navigate("/worker/profile")}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#0A6E5C] rounded-full p-0.5 sm:px-2 sm:py-0.5 shadow-2xs cursor-pointer transition-colors shrink-0"
            title="View Profile"
          >
            <UserAvatar user={displayUser} className="w-6 h-6" textClassName="text-[11px]" defaultInitial="W" />
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

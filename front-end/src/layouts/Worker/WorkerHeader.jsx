import { useEffect } from "react";
import { Bell, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetWorkerUnreadCountQuery,
  useGetWorkerHeaderStatusQuery,
  useToggleWorkerLiveStatusMutation,
  useGetWorkerProfileQuery,
} from "../../store/services/workerApi";
import { updateUserLiveStatus, updateUser } from "../../store/Slices/UserSlice";
import { showSuccess, showWarning, showError } from "../../utils/toast";
import UserAvatar from "../../components/sharedComponents/UserAvatar";

const WorkerHeader = () => {
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

  const isLive = headerStatus?.isLive ?? user?.worker?.isLive ?? true;
  const walletAmount = headerStatus?.walletAmount ?? 0;

  useEffect(() => {
    const avatarUrl = workerProfile?.avatar || workerProfile?.selfie;
    if (avatarUrl && avatarUrl !== user?.avatar && avatarUrl !== user?.selfie) {
      dispatch(updateUser({ avatar: avatarUrl, selfie: avatarUrl }));
    }
  }, [workerProfile?.avatar, workerProfile?.selfie, user?.avatar, user?.selfie, dispatch]);

  const displayUser = {
    ...user,
    ...(workerProfile || {}),
    name: workerProfile?.name || user?.name || "",
    avatar: workerProfile?.avatar || user?.avatar || user?.selfie,
    selfie: workerProfile?.avatar || user?.selfie || user?.avatar,
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
    <div className="shrink-0 h-14 sticky top-0 z-20 w-full bg-white border-b border-gray-200 pl-13 sm:pl-16 pr-2.5 sm:pr-6 flex items-center justify-end gap-1.5 sm:gap-3 shadow-xs">
      <button
        type="button"
        onClick={handleToggleLive}
        disabled={isToggling}
        title={isLive ? "Click to go offline" : "Click to go live"}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          isLive
            ? "bg-emerald-50 border-emerald-300 text-[#0A6E5C] hover:bg-emerald-100/50"
            : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200/60"
        } ${isToggling ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isLive ? "bg-[#0A6E5C] animate-pulse" : "bg-gray-400"
          }`}
        />
        <span className="whitespace-nowrap">
          <span className="hidden min-[420px]:inline">You are </span>
          {isLive ? "Live" : "Offline"}
        </span>
        {isToggling ? (
          <Loader2 size={15} className="animate-spin text-gray-400 shrink-0" />
        ) : isLive ? (
          <ToggleRight size={17} className="text-[#0A6E5C] shrink-0" />
        ) : (
          <ToggleLeft size={17} className="text-gray-400 shrink-0" />
        )}
      </button>

      <button
        onClick={() => navigate("/worker/notifications")}
        className="relative p-1.5 sm:p-2 rounded-xl text-gray-500 hover:text-[#0A6E5C] hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
        title="Notifications"
      >
        <Bell size={18} className="sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 sm:min-w-[18px] sm:h-[18px] px-1 bg-[#0A6E5C] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => navigate("/worker/earnings")}
        title="View Wallet & Earnings"
        className="flex items-center gap-1 sm:gap-1.5 bg-white border border-gray-200 hover:border-[#0A6E5C] hover:bg-emerald-50/20 rounded-xl px-2.5 sm:px-3 py-1 shadow-2xs transition-all cursor-pointer group shrink-0"
      >
        <span className="text-xs font-bold text-[#0A6E5C] whitespace-nowrap">
          ₹{Number(walletAmount || 0).toLocaleString("en-IN")}
        </span>
      </button>

      <div
        onClick={() => navigate("/worker/profile")}
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 rounded-full sm:rounded-xl p-1 sm:px-3 sm:py-1 shadow-2xs cursor-pointer transition-colors shrink-0"
        title="View Profile"
      >
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-[#111827]">Worker</p>
          <p className="text-xs text-[#0A6E5C] font-semibold truncate max-w-[110px]">
            {displayUser?.name || ""}
          </p>
        </div>
        <UserAvatar user={displayUser} className="w-7 h-7" textClassName="text-xs" defaultInitial="W" />
      </div>
    </div>
  );
};

export default WorkerHeader;

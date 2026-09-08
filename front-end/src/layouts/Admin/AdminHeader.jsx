import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActivePage } from "../../store/Slices/AdminSlice";
import { useAdminGetNotificationsQuery } from "../../store/services/adminApi";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, selfie } = useSelector((state) => state.adminAuth.admin || {});
  const { data } = useAdminGetNotificationsQuery({ page: 1, limit: 1 });
  const unreadCount = data?.unreadCount || 0;

  const handleGoToNotifications = () => {
    dispatch(setActivePage("Notifications"));
    navigate("/admin/notifications");
  };

  return (
    <div className="sticky top-0 z-40 py-1 bg-white border-b border-gray-200 px-6 flex items-center justify-end shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={handleGoToNotifications}
          title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          className="relative p-1.5 text-gray-500 hover:text-[#0A6E5C] transition-colors cursor-pointer"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
          <div className="hidden sm:block">
            <h4 className="text-xs font-semibold text-[#111827]">Admin</h4>
            <p className="text-xs text-green-700 font-semibold" >{name}</p>
          </div>
          <img
            src={selfie}
            alt="admin"
            className="w-7 h-7 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

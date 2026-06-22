import {
  Bell,
} from "lucide-react";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { name, selfie } = useSelector((state) => state.adminAuth.admin);

  return (
    <div className="sticky top-0 z-40 py-1 bg-white border-b border-gray-200 px-6 flex items-center justify-end shadow-sm">
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-[#0A6E5C]">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
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

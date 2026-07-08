
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wallet,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from '../../assets/Nex_Logo.png'
import Logo from '../../components/Logo/Logo'
import { setSideBar, adminLogOut, setActivePage } from "../../store/Slices/AdminSlice";
import { useAdminLogoutMutation } from "../../store/services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AdminNavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.adminAuth.sideBarOpen);

  const active = useSelector((state) => state.adminAuth.activePage)
  const [adminLogoutApi] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await adminLogoutApi().unwrap();
    } catch {
      // Still log out locally even if the backend call fails
    } finally {
      dispatch(adminLogOut());
      navigate("/admin/login");
    }
  };

  const adminNav = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      redirect: '/admin/dashboard'
    },
    {
      label: "Users",
      icon: <Users size={20} />,
      redirect: '/admin/users'
    },
    {
      label: "Tasks",
      icon: <ClipboardList size={20} />,
      redirect: '/admin/tasks'
    },
    {
      label: "Financials",
      icon: <Wallet size={20} />,
      redirect: '/admin/finance'
    },
    {
      label: "Notifications",
      icon: <Bell size={20} />,
      redirect: '/admin/notifications'
    },
  ];

  return (
    <div
      className={`h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex flex-col justify-between ${
        sidebarOpen
          ? "fixed top-0 left-0 w-[260px]"
          : "sticky top-0 w-[90px]"
      }`}
    >
      <div>
        {/* LOGO */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-3 overflow-hidden">
            {!sidebarOpen && <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              <img src={logo} alt="" />
            </div>}

            {sidebarOpen && (
              <div>
                <Logo/>
                <p className="text-xs text-gray-500">Editorial Premium</p>
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(setSideBar(!sidebarOpen))}
            className="text-gray-500 hover:text-[#0A6E5C]"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="p-4 space-y-2">
          {adminNav.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                dispatch(setActivePage(item.label))
                navigate(item.redirect)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.label === active
                  ? "bg-[#0A6E5C] text-white"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
              }`}
            >
              {item.icon}

              {sidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} />

          {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminNavBar;

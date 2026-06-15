import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  Bell,
  LogOut,
  User,
  PlusSquare,
  Menu,
  X,
} from "lucide-react";
import Logo from "../../components/Logo/Logo";
import logo from "../../assets/Nex_Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logOut } from "../../store/Slices/UserSlice";
import { useUserLogoutMutation } from "../../store/services/api";

const PosterNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
    } catch (error) {
      // log out locally even if API fails
    } finally {
      dispatch(logOut());
      navigate("/user/login");
    }
  };

  const posterNav = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      redirect: "/poster/dashboard",
    },
    {
      label: "Post Task",
      icon: <PlusSquare size={20} />,
      redirect: "/poster/post-task",
    },
    {
      label: "My Tasks",
      icon: <ClipboardList size={20} />,
      redirect: "/poster/my-tasks",
    },
    {
      label: "Payments",
      icon: <Wallet size={20} />,
      redirect: "/poster/payments",
    },
    {
      label: "Notifications",
      icon: <Bell size={20} />,
      redirect: "/poster/notifications",
    },
    {
      label: "Profile",
      icon: <User size={20} />,
      redirect: "/poster/profile",
    },
  ];

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex flex-col justify-between flex-shrink-0 ${
        sidebarOpen ? "w-[220px]" : "w-[72px]"
      }`}
    >
      <div>
        {/* LOGO */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-hidden">
            {sidebarOpen ? (
              <div>
                <Logo />
                <p className="text-xs text-gray-400 mt-0.5 pl-1">
                  MARKETPLACE POSTER
                </p>
              </div>
            ) : (
              <img src={logo} alt="Nexaro" className="w-9 h-9 object-contain" />
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-[#0A6E5C] transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Avatar — only when open */}
        {sidebarOpen && (
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[#111827] text-sm font-semibold truncate">
                {user?.name || "Poster"}
              </p>
              <p className="text-xs text-[#0A6E5C] font-medium">
                Premium Poster
              </p>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="p-3 space-y-1 mt-1">
          {posterNav.map((item, index) => {
            const myTasksGroup = ['/poster/my-tasks', '/poster/review-bids', '/poster/work-progress'];
            const isActive =
              location.pathname === item.redirect ||
              (item.redirect === '/poster/my-tasks' &&
                myTasksGroup.some((prefix) => location.pathname.startsWith(prefix)));
            return (
              <button
                key={index}
                onClick={() => navigate(item.redirect)}
                title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-[#0A6E5C] text-white"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                } ${!sidebarOpen ? "justify-center" : ""}`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={!sidebarOpen ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-medium ${
            !sidebarOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default PosterNavBar;

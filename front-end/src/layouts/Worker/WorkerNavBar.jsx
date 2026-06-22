import React, { useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Briefcase,
  Wallet,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Wrench,
} from "lucide-react";
import Logo from "../../components/Logo/Logo";
import logo from "../../assets/Nex_Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logOut } from "../../store/Slices/UserSlice";
import { useUserLogoutMutation } from "../../store/services/api";

const WorkerNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
    } catch (error) {
    } finally {
      dispatch(logOut());
      navigate("/user/login");
    }
  };

  const workerNav = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      redirect: "/worker/dashboard",
    },
    {
      label: "Nearby Tasks",
      icon: <ListChecks size={20} />,
      redirect: "/worker/nearby-tasks",
    },
    {
      label: "My Bids",
      icon: <Briefcase size={20} />,
      redirect: "/worker/my-bids",
    },
    {
      label: "Active Job",
      icon: <Wrench size={20} />,
      redirect: "/worker/active-job",
    },
    {
      label: "Earnings",
      icon: <Wallet size={20} />,
      redirect: "/worker/earnings",
    },
    {
      label: "Notifications",
      icon: <Bell size={20} />,
      redirect: "/worker/notifications",
    },
    {
      label: "Profile",
      icon: <User size={20} />,
      redirect: "/worker/profile",
    },
  ];

  return (
    <div
      className={`h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex flex-col justify-between flex-shrink-0 ${sidebarOpen
          ? "fixed top-0 left-0 w-[220px]"
          : "relative w-[72px]"
        }`}
    >
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-hidden">
            {sidebarOpen ? (
              <div>
                <Logo />
                <p className="text-xs text-gray-400 mt-0.5 pl-1">
                  MARKETPLACE WORKER
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

        {sidebarOpen && (
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "W"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[#111827] text-sm font-semibold truncate">
                {user?.name || "Worker"}
              </p>
              <p className="text-xs text-[#0A6E5C] font-medium">
                Elite Contractor
              </p>
            </div>
          </div>
        )}

        <div className="p-3 space-y-1 mt-1">
          {workerNav.map((item, index) => {
            const routeGroups = {
              '/worker/my-bids': ['/worker/my-bids', '/worker/task-bid-details'],
              '/worker/nearby-tasks': ['/worker/nearby-tasks', '/worker/place-bid'],
              '/worker/active-job': ['/worker/active-job'],
            };
            const group = routeGroups[item.redirect];
            const isActive =
              location.pathname === item.redirect ||
              (group ? group.some((prefix) => location.pathname.startsWith(prefix)) : false);
            return (
              <button
                key={index}
                onClick={() => navigate(item.redirect)}
                title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium ${isActive
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

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={!sidebarOpen ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-medium ${!sidebarOpen ? "justify-center" : ""
            }`}
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default WorkerNavBar;

import { useState } from "react";
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
import { useUserLogoutMutation } from "../../store/services/authApi";

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

const routeGroups = {
  "/worker/my-bids": ["/worker/my-bids", "/worker/task-bid-details"],
  "/worker/nearby-tasks": ["/worker/nearby-tasks", "/worker/place-bid"],
  "/worker/active-job": ["/worker/active-job"],
};

const NavContent = ({ isExpanded, onToggle, onNavClick, onLogout, user }) => {
  const location = useLocation();

  const isActive = (redirect) => {
    const group = routeGroups[redirect];
    return (
      location.pathname === redirect ||
      (group ? group.some((prefix) => location.pathname.startsWith(prefix)) : false)
    );
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-hidden">
            {isExpanded ? (
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
            onClick={onToggle}
            className="text-gray-500 hover:text-[#0A6E5C] transition-colors shrink-0"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isExpanded && (
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm shrink-0">
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
          {workerNav.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavClick(item.redirect)}
              title={!isExpanded ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive(item.redirect)
                  ? "bg-[#0A6E5C] text-white"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
              } ${!isExpanded ? "justify-center" : ""}`}
            >
              {item.icon}
              {isExpanded && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          title={!isExpanded ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-medium ${
            !isExpanded ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const WorkerNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
    } catch {
      // Logout locally even if server request fails
    } finally {
      dispatch(logOut());
      navigate("/user/login");
    }
  };

  const handleNav = (redirect) => {
    navigate(redirect);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#0A6E5C] transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 h-full z-50 w-[220px] bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent
          user={user}
          isExpanded={true}
          onToggle={() => setMobileOpen(false)}
          onNavClick={handleNav}
          onLogout={handleLogout}
        />
      </div>

      <div
        className={`hidden md:flex sticky top-0 h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex-col justify-between shrink-0 ${
          desktopOpen ? "w-[220px]" : "w-[72px]"
        }`}
      >
        <NavContent
          user={user}
          isExpanded={desktopOpen}
          onToggle={() => setDesktopOpen(!desktopOpen)}
          onNavClick={handleNav}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
};

export default WorkerNavBar;

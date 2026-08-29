
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wallet,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import logo from '../../assets/Nex_Logo.png'
import Logo from '../../components/Logo/Logo'
import { setSideBar, adminLogOut, setActivePage } from "../../store/Slices/AdminSlice";
import { useAdminLogoutMutation } from "../../store/services/authApi";
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
      children: [
        {
          label: "Payments & Revenue",
          redirect: '/admin/finance/payments'
        },
        {
          label: "Financial Reports",
          redirect: '/admin/finance/reports'
        },
      ]
    },
    {
      label: "Notifications",
      icon: <Bell size={20} />,
      redirect: '/admin/notifications'
    },
  ];

  // Keep a group expanded when one of its children is the active page
  const [openMenu, setOpenMenu] = useState(
    () => adminNav.find((item) => item.children?.some((child) => child.label === active))?.label || null
  );

  const toggleMenu = (label) => {
    // The labels are hidden while collapsed, so open the sidebar first
    if (!sidebarOpen) dispatch(setSideBar(true));
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const goTo = (item) => {
    dispatch(setActivePage(item.label));
    navigate(item.redirect);
  };

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
          {adminNav.map((item) => {
            const childActive = item.children?.some((child) => child.label === active);
            const isActive = item.label === active || childActive;

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => (item.children ? toggleMenu(item.label) : goTo(item))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? item.children
                        ? "bg-emerald-50 text-[#0A6E5C]"
                        : "bg-[#0A6E5C] text-white"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                  }`}
                >
                  {item.icon}

                  {sidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}

                  {sidebarOpen && item.children && (
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {sidebarOpen && item.children && openMenu === item.label && (
                  <div className="ml-5 pl-3 border-l border-gray-200 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => goTo(child)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          child.label === active
                            ? "bg-[#0A6E5C] text-white font-medium"
                            : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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

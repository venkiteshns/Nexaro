import { useState, useEffect } from "react";
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
import logo from '../../assets/Nex_Logo.png';
import Logo from '../../components/Logo/Logo';
import { setSideBar, adminLogOut, setActivePage } from "../../store/Slices/AdminSlice";
import { useAdminLogoutMutation } from "../../store/services/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LogoutConfirmModal from "../../components/sharedComponents/LogoutConfirmModal";

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

const NavContent = ({
  isExpanded,
  onToggle,
  onNavClick,
  onLogout,
  openMenu,
  toggleMenu,
  active,
}) => {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="h-20 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-3 overflow-hidden">
            {!isExpanded ? (
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <img src={logo} alt="Nexaro" />
              </div>
            ) : (
              <div>
                <Logo />
                <p className="text-xs text-gray-500">Editorial Premium</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-[#0A6E5C] p-1 transition-colors"
          >
            {isExpanded ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="p-4 space-y-2">
          {adminNav.map((item) => {
            const isChildActive = item.children?.some(
              (child) => location.pathname === child.redirect || child.label === active
            );
            const isActive =
              location.pathname === item.redirect ||
              item.label === active ||
              isChildActive;

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => (item.children ? toggleMenu(item.label) : onNavClick(item))}
                  title={!isExpanded ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? item.children
                        ? "bg-emerald-50 text-[#0A6E5C]"
                        : "bg-[#0A6E5C] text-white"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                  } ${!isExpanded ? "justify-center" : ""}`}
                >
                  <div className="shrink-0">{item.icon}</div>

                  {isExpanded && (
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  )}

                  {isExpanded && item.children && (
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {isExpanded && item.children && openMenu === item.label && (
                  <div className="ml-5 pl-3 border-l border-gray-200 space-y-1">
                    {item.children.map((child) => {
                      const childIsActive =
                        location.pathname === child.redirect || child.label === active;
                      return (
                        <button
                          key={child.label}
                          onClick={() => onNavClick(child)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            childIsActive
                              ? "bg-[#0A6E5C] text-white font-medium"
                              : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          title={!isExpanded ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer ${
            !isExpanded ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {isExpanded && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

const AdminNavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector((state) => state.adminAuth.sideBarOpen);
  const active = useSelector((state) => state.adminAuth.activePage);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location.pathname]);

  const [adminLogoutApi] = useAdminLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminLogoutApi().unwrap();
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      dispatch(adminLogOut());
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      navigate("/admin/login");
    }
  };

  const [openMenu, setOpenMenu] = useState(
    () => adminNav.find((item) => item.children?.some((child) => child.label === active))?.label || null
  );

  const toggleMenu = (label) => {
    if (!sidebarOpen) dispatch(setSideBar(true));
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const handleNav = (item) => {
    dispatch(setActivePage(item.label));
    navigate(item.redirect);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-2.5 left-3 z-50 w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 bg-white/95 backdrop-blur-xs border border-gray-200/80 shadow-2xs hover:text-[#0A6E5C] hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full z-[999] w-[260px] bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent
          isExpanded={true}
          onToggle={() => setMobileOpen(false)}
          onNavClick={handleNav}
          onLogout={() => setShowLogoutModal(true)}
          openMenu={openMenu}
          toggleMenu={(label) => setOpenMenu((prev) => (prev === label ? null : label))}
          active={active}
        />
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex sticky top-0 h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex-col justify-between shrink-0 ${
          sidebarOpen ? "w-[260px]" : "w-[90px]"
        }`}
      >
        <NavContent
          isExpanded={sidebarOpen}
          onToggle={() => dispatch(setSideBar(!sidebarOpen))}
          onNavClick={handleNav}
          onLogout={() => setShowLogoutModal(true)}
          openMenu={openMenu}
          toggleMenu={toggleMenu}
          active={active}
        />
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        title="Log Out of Admin?"
        message="Are you sure you want to log out of the admin panel? You will need to sign in again to access the admin controls."
      />
    </>
  );
};

export default AdminNavBar;

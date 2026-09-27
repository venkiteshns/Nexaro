import { useState } from "react";
import {
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
import { useUserLogoutMutation } from "../../store/services/authApi";
import { useGetPosterUnreadCountQuery } from "../../store/services/posterApi";
import LogoutConfirmModal from "../../components/sharedComponents/LogoutConfirmModal";


  const posterNav = [
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
    { label: "Profile", icon: <User size={20} />, redirect: "/poster/profile" },
  ];

  const myTasksGroup = [
    "/poster/my-tasks",
    "/poster/review-bids",
    "/poster/work-progress",
    "/poster/completed-task",
  ];

 const NavContent = ({ isExpanded, onToggle, onNavClick, onLogout, user, unreadCount = 0 }) =>{
  const location = useLocation();

  return (

    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-hidden">
            {isExpanded ? (
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
            onClick={onToggle}
            className="text-gray-500 hover:text-[#0A6E5C] transition-colors shrink-0"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isExpanded && (
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm shrink-0">
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

        <div className="p-3 space-y-1 mt-1">
          {posterNav.map((item, index) => {
            const isActive =
              location.pathname === item.redirect ||
              (item.redirect === "/poster/my-tasks" &&
                myTasksGroup.some((prefix) =>
                  location.pathname.startsWith(prefix),
                ));
            const isNotifications = item.redirect === "/poster/notifications";

            return (
              <button
                key={index}
                onClick={() => onNavClick(item.redirect)}
                title={!isExpanded ? item.label : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium
                  ${isActive ? "bg-[#0A6E5C] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"}
                  ${!isExpanded ? "justify-center" : ""}`}
              >
                <div className="relative shrink-0">
                  {item.icon}
                  {!isExpanded && isNotifications && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0A6E5C] rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </div>

                {isExpanded && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {isNotifications && unreadCount > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-[#0A6E5C]"
                        }`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          title={!isExpanded ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-medium
            ${!isExpanded ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  )};

const PosterNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { data: unreadData } = useGetPosterUnreadCountQuery();
  const unreadCount = unreadData?.unreadCount || 0;

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [userLogout] = useUserLogoutMutation();

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await userLogout().unwrap();
    } catch (error) {
      console.error("Poster logout error:", error);
    } finally {
      dispatch(logOut());
      setIsLoggingOut(false);
      setShowLogoutModal(false);
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
        className="md:hidden fixed top-2.5 left-3 z-50 w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 bg-white/95 backdrop-blur-xs border border-gray-200/80 shadow-2xs hover:text-[#0A6E5C] hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 h-full z-[999] w-[220px] bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent
          user={user}
          unreadCount={unreadCount}
          isExpanded={true}
          onToggle={() => setMobileOpen(false)}
          onNavClick={handleNav}
          onLogout={() => setShowLogoutModal(true)}
        />
      </div>

      <div
        className={`hidden md:flex h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex-col justify-between shrink-0 ${
          desktopOpen ? "w-[220px]" : "w-[72px]"
        }`}
      >
        <NavContent
          user={user}
          unreadCount={unreadCount}
          isExpanded={desktopOpen}
          onToggle={() => setDesktopOpen(!desktopOpen)}
          onNavClick={handleNav}
          onLogout={() => setShowLogoutModal(true)}
        />
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        title="Log Out of Nexaro?"
        message="Are you sure you want to log out? You will need to sign in again to access your poster dashboard."
      />
    </>
  );
};

export default PosterNavBar;

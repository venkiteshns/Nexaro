import { useState } from "react";
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
import { useUserLogoutMutation } from "../../store/services/authApi";

const PosterNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // md+ desktop: collapsed (icon-only) ↔ expanded
  const [desktopOpen, setDesktopOpen] = useState(false);
  // <md mobile: hidden ↔ overlay open
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
    } catch {
      // log out locally even if API fails
    } finally {
      dispatch(logOut());
      navigate("/user/login");
    }
  };

  const handleNav = (redirect) => {
    navigate(redirect);
    setMobileOpen(false); // auto-close overlay on navigation (mobile)
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
    { label: "Profile", icon: <User size={20} />, redirect: "/poster/profile" },
  ];

  const myTasksGroup = [
    "/poster/my-tasks",
    "/poster/review-bids",
    "/poster/work-progress",
    "/poster/completed-task",
  ];

  // ── Shared inner content ──────────────────────────────────────────────────
  const NavContent = ({ isExpanded, onToggle, onNavClick, onLogout }) => (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Logo + toggle */}
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

        {/* User avatar — only when expanded */}
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

        {/* Navigation links */}
        <div className="p-3 space-y-1 mt-1">
          {posterNav.map((item, index) => {
            const isActive =
              location.pathname === item.redirect ||
              (item.redirect === "/poster/my-tasks" &&
                myTasksGroup.some((prefix) =>
                  location.pathname.startsWith(prefix),
                ));
            return (
              <button
                key={index}
                onClick={() => onNavClick(item.redirect)}
                title={!isExpanded ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium
                  ${isActive ? "bg-[#0A6E5C] text-white" : "text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"}
                  ${!isExpanded ? "justify-center" : ""}`}
              >
                {item.icon}
                {isExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
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
  );

  return (
    <>
      {/* ── MOBILE (<md): floating hamburger ──────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 w-10 h-10 rounded-full  flex items-center justify-center text-gray-600 hover:text-[#0A6E5C] transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* ── MOBILE: dim backdrop (click to close) ─────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: slide-in sidebar overlay ──────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full z-50 w-[220px] bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent
          isExpanded={true}
          onToggle={() => setMobileOpen(false)}
          onNavClick={handleNav}
          onLogout={handleLogout}
        />
      </div>

      {/* ── DESKTOP (md+): in-flow sidebar ────────────────────────────────── */}
      <div
        className={`hidden md:flex h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-sm flex-col justify-between shrink-0 ${
          desktopOpen ? "w-[220px]" : "w-[72px]"
        }`}
      >
        <NavContent
          isExpanded={desktopOpen}
          onToggle={() => setDesktopOpen(!desktopOpen)}
          onNavClick={handleNav}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
};

export default PosterNavBar;

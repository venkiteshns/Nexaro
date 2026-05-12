import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiPlusCircle,
  FiList,
  FiCreditCard,
  FiBell,
  FiUser,
  FiMenu,
  FiLogOut
} from 'react-icons/fi';
import useAuthStore from '../../../../store/store';
import { useLogout } from '../../../../hooks/useLogout.js';
import { useModal } from '../../../../hooks/useModal.js';

const navItems = [
  { icon: FiHome, label: 'Dashboard', path: '/poster/dashboard' },
  { icon: FiPlusCircle, label: 'Post Task', path: '/poster/post-task' },
  { icon: FiList, label: 'My Tasks', path: '/poster/tasks' },
  { icon: FiCreditCard, label: 'Payments', path: '/poster/payments' },
  { icon: FiBell, label: 'Notifications', path: '/poster/notifications' },
  { icon: FiUser, label: 'Profile', path: '/poster/profile' },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoggingOut } = useLogout();
  const { confirm } = useModal();

  useEffect(() => {
    if (isMobileOpen && window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      <div
        className={`poster-sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={`poster-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="poster-sidebar-header">
          <div className="poster-logo">{isCollapsed ? 'N' : 'NEXARO'}</div>
        </div>

        <div className="poster-sidebar-profile">
          <div className="poster-avatar">
            {user?.selfie ? <img src={user.selfie} alt="" /> : (user?.name?.charAt(0).toUpperCase() || 'P')}
          </div>
          {!isCollapsed && (
            <div className="poster-profile-info">
              <span className="poster-profile-name">{user?.name || 'Guest'}</span>
              <span className="poster-profile-role">Marketplace Poster</span>
            </div>
          )}
        </div>

        <nav className="poster-sidebar-nav">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `poster-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => window.innerWidth <= 1024 && setIsMobileOpen(false)}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon className="poster-nav-icon" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="poster-sidebar-footer">
          {window.innerWidth > 1024 && (
            <button
              className="poster-nav-item"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <FiMenu className="poster-nav-icon" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              {!isCollapsed && <span>Collapse Sidebar</span>}
            </button>
          )}
          <button
            className="poster-nav-item"
            title={isCollapsed ? "Logout" : ""}
            onClick={async () => {
              const isConfirmed = await confirm({
                title: 'Confirm Logout',
                description: 'Are you sure you want to log out of your account?',
                confirmText: 'Log Out',
                cancelText: 'Cancel',
                variant: 'danger'
              });
              if (isConfirmed) {
                logout();
              }
            }}
            disabled={isLoggingOut}
            style={{ opacity: isLoggingOut ? 0.6 : 1, cursor: isLoggingOut ? 'not-allowed' : 'pointer' }}
          >
            <FiLogOut className="poster-nav-icon" style={{ animation: isLoggingOut ? 'spin 1s linear infinite' : 'none' }} />
            {!isCollapsed && <span>{isLoggingOut ? 'Signing out...' : 'Logout'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

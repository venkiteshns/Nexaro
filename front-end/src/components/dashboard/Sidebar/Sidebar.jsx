import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import useAuthStore from '../../../store/store';

const navItems = [
  { icon: FiHome, label: 'Dashboard', path: '/worker/dashboard' },
  { icon: FiMapPin, label: 'Nearby Tasks', path: '/worker/tasks', badge: '12' },
  { icon: FiBriefcase, label: 'My Bids', path: '/worker/bids' },
  { icon: FiClock, label: 'Active Jobs', path: '/worker/jobs', badge: '2' },
  { icon: FiDollarSign, label: 'Earnings', path: '/worker/earnings' },
  { icon: FiBell, label: 'Notifications', path: '/worker/notifications', badge: '3' },
  { icon: FiUser, label: 'Profile', path: '/worker/profile' },
  { icon: FiSettings, label: 'Settings', path: '/worker/settings' },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <motion.aside
        className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        initial={false}
        animate={{
          x: isMobileOpen ? 0 : (windowWidth > 1024 ? 0 : -280),
          width: windowWidth > 1024 ? (isCollapsed ? 80 : 280) : 280
        }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">{isCollapsed ? 'N' : 'NEXARO'}</div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.selfie ? <img src={user.selfie} alt="" /> : (user?.name?.charAt(0).toUpperCase() || 'W')}
          </div>
          {!isCollapsed && (
            <div className="profile-info">
              <span className="profile-name">{user?.name} <br />Elite {user?.role}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed-item' : ''}`}
              onClick={() => window.innerWidth <= 1024 && setIsMobileOpen(false)}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon className="nav-icon" />
              {!isCollapsed && <span>{item.label}</span>}
              {!isCollapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {windowWidth > 1024 && (
            <button
              className={`nav-item ${isCollapsed ? 'collapsed-item' : ''}`}
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand" : "Collapse"}
              style={{ marginBottom: '8px' }}
            >
              <FiMenu className="nav-icon" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              {!isCollapsed && <span>Collapse</span>}
            </button>
          )}
          <button className={`nav-item ${isCollapsed ? 'collapsed-item' : ''}`} title={isCollapsed ? "Logout" : ""}>
            <FiLogOut className="nav-icon" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

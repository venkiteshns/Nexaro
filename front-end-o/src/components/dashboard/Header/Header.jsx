import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';
import AvailabilityToggle from '../AvailabilityToggle/AvailabilityToggle';
import useAuthStore from '../../../store/store.js';
const Header = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user?.name || "Worker");
  const selfie = useAuthStore((state) => state.user?.selfie);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGreeting = () => {
    if (windowWidth > 768) return `Find Work, ${user}`;
    if (windowWidth > 420) return `Hi, ${user}`;
    return `Hi`;
  };

  return (
    <header className="dashboard-header">
      <div className="header-greeting">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className="greeting-text">
          <h1 className="greeting-title">{getGreeting()}</h1>
          {windowWidth > 576 && (
            <p className="greeting-subtitle">Here's what's happening near you today.</p>
          )}
        </div>
      </div>

      <div className="header-center">
        <AvailabilityToggle />
      </div>

      <div className="header-actions">
        <button className="header-icon-btn">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-avatar" style={{ width: 40, height: 40, fontSize: 16, cursor: 'pointer', flexShrink: 0 }}>
          {selfie ? <img src={selfie} alt="" /> : user?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;

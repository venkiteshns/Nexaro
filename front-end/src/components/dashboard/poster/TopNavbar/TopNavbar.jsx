import React from 'react';
import { FiMenu, FiBell, FiPlus } from 'react-icons/fi';
import useAuthStore from '../../../../store/store';

const TopNavbar = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user?.name || "Poster");
  
  const getGreeting = () => {
    return `Welcome back, ${user}`;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="poster-top-navbar">
      <div className="poster-navbar-left">
        <button className="poster-mobile-menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className="poster-greeting">
          <h1>{getGreeting()}</h1>
          <div className="poster-date">{currentDate}</div>
        </div>
      </div>

      <div className="poster-navbar-right">
        <button className="poster-btn-primary">
          <FiPlus />
          <span>Post New Task</span>
        </button>
        
        <button className="poster-icon-btn">
          <FiBell />
          <span className="poster-notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;

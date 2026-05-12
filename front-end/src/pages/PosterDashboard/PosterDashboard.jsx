import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/poster/Sidebar/Sidebar';
import TopNavbar from '../../components/dashboard/poster/TopNavbar/TopNavbar';
import StatsCards from '../../components/dashboard/poster/StatsCards/StatsCards';
import ActiveTasks from '../../components/dashboard/poster/ActiveTasks/ActiveTasks';
import ActivityPanel from '../../components/dashboard/poster/ActivityPanel/ActivityPanel';
import PaymentOverview from '../../components/dashboard/poster/PaymentOverview/PaymentOverview';

import '../../styles/poster-dashboard.css';
import '../../styles/poster-dashboard-responsive.css';

const PosterDashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // If window resizes above mobile breakpoint, make sure mobile menu closes
    if (windowWidth > 1024 && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [windowWidth, isMobileOpen]);

  return (
    <div className="poster-dashboard-layout">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <main className={`poster-main-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />
        
        <div className="poster-dashboard-content">
          <StatsCards />
          
          <div className="poster-content-grid">
            <ActiveTasks />
            <div>
              <ActivityPanel />
              <PaymentOverview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PosterDashboard;

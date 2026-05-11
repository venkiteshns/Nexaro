import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar/Sidebar';
import Header from '../../components/dashboard/Header/Header';
import StatsCards from '../../components/dashboard/StatsCards/StatsCards';
import TaskFeed from '../../components/dashboard/TaskFeed/TaskFeed';
import ActiveBids from '../../components/dashboard/ActiveBids/ActiveBids';
import '../../styles/dashboard.css';
import '../../styles/dashboard-responsive.css';

const WorkerDashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <main className={`dashboard-main-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        
        <div className="dashboard-content">
          <StatsCards />
          
          <div className="dashboard-grid">
            <TaskFeed />
            <ActiveBids />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;

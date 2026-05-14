import React from 'react';
import { FiBriefcase, FiList, FiCheckCircle, FiCreditCard } from 'react-icons/fi';

const stats = [
  { label: 'Active Tasks', value: '4', icon: FiBriefcase },
  { label: 'Total Bids', value: '24', icon: FiList },
  { label: 'Completed', value: '18', icon: FiCheckCircle },
  { label: 'Total Spent', value: '₹2,450', icon: FiCreditCard },
];

const StatsCards = () => {
  return (
    <div className="poster-stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="poster-stat-card">
          <div className="poster-stat-header">
            <div className="poster-stat-icon-wrapper">
              <stat.icon />
            </div>
          </div>
          <div>
            <div className="poster-stat-value">{stat.value}</div>
            <div className="poster-stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

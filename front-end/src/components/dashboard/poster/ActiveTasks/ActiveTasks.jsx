import React from 'react';
import { FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

const tasks = [
  {
    id: 1,
    title: 'Deep Clean 4BHK Villa',
    category: 'Cleaning',
    location: 'Beverly Hills, CA',
    date: 'Oct 24, 2023',
    bids: 5,
    status: 'Open',
    budget: '₹150 - ₹200'
  },
  {
    id: 2,
    title: 'Assemble IKEA Furniture',
    category: 'Handyman',
    location: 'Downtown LA, CA',
    date: 'Oct 26, 2023',
    bids: 0,
    status: 'In Progress',
    budget: '₹80'
  },
  {
    id: 3,
    title: 'Garden Landscaping',
    category: 'Gardening',
    location: 'Santa Monica, CA',
    date: 'Oct 20, 2023',
    bids: 12,
    status: 'Completed',
    budget: '₹450'
  }
];

const ActiveTasks = () => {
  return (
    <div className="poster-section">
      <div className="poster-section-header">
        <h2 className="poster-section-title">My Active Tasks</h2>
        <a href="/poster/tasks" className="poster-section-link">View All</a>
      </div>
      <div className="poster-section-content">
        <div className="poster-task-list">
          {tasks.map(task => (
            <div key={task.id} className="poster-task-card">
              <div className="poster-task-top">
                <div>
                  <div className="poster-task-meta" style={{ marginBottom: '8px' }}>
                    <span style={{ color: 'var(--poster-primary)', fontWeight: '600' }}>{task.category}</span>
                  </div>
                  <h3 className="poster-task-title">{task.title}</h3>
                </div>
                <span className={`poster-status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </div>
              
              <div className="poster-task-meta">
                <span><FiMapPin /> {task.location}</span>
                <span><FiCalendar /> {task.date}</span>
                <span><FiUsers /> {task.bids} Bids</span>
              </div>
              
              <div className="poster-task-bottom">
                <div className="poster-task-budget">{task.budget}</div>
                {task.status === 'Open' ? (
                  <button className="poster-btn-outline">View Bids</button>
                ) : (
                  <button className="poster-btn-outline" style={{ border: 'none' }}>Details</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveTasks;

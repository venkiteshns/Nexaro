import React from 'react';
import { FiMessageSquare, FiUserCheck, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const activities = [
  {
    id: 1,
    icon: FiMessageSquare,
    text: <>New bid from <strong>Alex Smith</strong> on "Deep Clean 4BHK Villa"</>,
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: FiUserCheck,
    text: <>You accepted <strong>Sarah Connor's</strong> bid for "Assemble IKEA Furniture"</>,
    time: '5 hours ago'
  },
  {
    id: 3,
    icon: FiCreditCard,
    text: <>Payment of <strong>₹450</strong> released to <strong>Mike Johnson</strong></>,
    time: '1 day ago'
  },
  {
    id: 4,
    icon: FiCheckCircle,
    text: <>Task "Garden Landscaping" marked as <strong>Completed</strong></>,
    time: '1 day ago'
  }
];

const ActivityPanel = () => {
  return (
    <div className="poster-section">
      <div className="poster-section-header">
        <h2 className="poster-section-title">Recent Activity</h2>
      </div>
      <div className="poster-section-content">
        <div className="poster-activity-feed">
          {activities.map((activity) => (
            <div key={activity.id} className="poster-activity-item">
              <div className="poster-activity-icon">
                <activity.icon />
              </div>
              <div className="poster-activity-content">
                <p className="poster-activity-text">{activity.text}</p>
                <span className="poster-activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;

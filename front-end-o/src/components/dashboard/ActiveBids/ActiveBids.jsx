import React from 'react';
import { motion } from 'framer-motion';

const mockBids = [
  {
    id: 1,
    title: 'Install 4 Ceiling Fans',
    amount: '₹120',
    status: 'Pending',
    statusClass: 'status-pending',
    time: '2h ago'
  },
  {
    id: 2,
    title: 'Garden Cleanup',
    amount: '₹85',
    status: 'Accepted',
    statusClass: 'status-accepted',
    time: '1d ago'
  },
  {
    id: 3,
    title: 'Paint Living Room',
    amount: '₹250',
    status: 'Rejected',
    statusClass: 'status-rejected',
    time: '2d ago'
  }
];

const ActiveBids = () => {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">My Active Bids</h2>
        <a href="#all-bids" className="section-action">View All</a>
      </div>

      <div className="active-bids-panel">
        <div className="panel-header">
          <span className="panel-title">Recent Bids</span>
        </div>

        <div className="bids-list">
          {mockBids.map((bid, index) => (
            <motion.div
              key={bid.id}
              className="bid-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bid-header">
                <span className="bid-title">{bid.title}</span>
                <span className="bid-amount">{bid.amount}</span>
              </div>

              <div className="bid-meta">
                <span>{bid.time}</span>
                <div className={`bid-status ${bid.statusClass}`}>
                  <div className="status-indicator"></div>
                  {bid.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveBids;

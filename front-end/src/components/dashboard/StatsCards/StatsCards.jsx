import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiCheckCircle, FiStar } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const statsData = [
  { id: 1, title: 'Active Bids', value: '12', icon: FiBriefcase, color: 'var(--color-accent)' },
  { id: 2, title: 'Jobs Completed', value: '48', icon: FiCheckCircle, color: '#3B82F6' },
  { id: 3, title: 'Total Earned', value: ' ₹4,250', icon: FaRupeeSign, color: '#10B981' },
  { id: 4, title: 'Worker Rating', value: '4.9', icon: FiStar, color: '#F59E0B' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const StatsCards = () => {
  return (
    <motion.div
      className="stats-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statsData.map((stat) => (
        <motion.div key={stat.id} className="stat-card" variants={itemVariants}>
          <div className="stat-header">
            <span className="stat-title">{stat.title}</span>
            <div className="stat-icon" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
              <stat.icon />
            </div>
          </div>
          <div className="stat-value">{stat.value}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;

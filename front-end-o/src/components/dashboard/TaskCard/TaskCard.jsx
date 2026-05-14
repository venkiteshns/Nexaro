import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock } from 'react-icons/fi';

const TaskCard = ({ task }) => {
  return (
    <motion.div 
      className="task-card"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="task-icon-wrapper">
        <task.icon />
      </div>
      
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className="task-price">{task.price}</span>
        </div>
        
        <p className="task-desc">{task.description}</p>
        
        <div className="task-meta">
          <div className="task-meta-item">
            <FiClock />
            <span>{task.postedTime}</span>
          </div>
          <div className="task-meta-item">
            <FiMapPin />
            <span>{task.location} ({task.distance})</span>
          </div>
        </div>
        
        <div className="task-footer">
          <div className="task-tags">
            {task.isUrgent && <span className="task-tag urgent">Urgent</span>}
            <span className="task-tag">{task.category}</span>
          </div>
          <button className="btn-bid">Place Bid</button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;

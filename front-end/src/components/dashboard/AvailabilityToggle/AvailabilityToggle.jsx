import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AvailabilityToggle = () => {
  const [isOnline, setIsOnline] = useState(true);

  const toggleStatus = () => setIsOnline(!isOnline);

  return (
    <button 
      className={`availability-toggle ${isOnline ? 'online' : 'offline'}`}
      onClick={toggleStatus}
      aria-label="Toggle availability status"
    >
      <div className="toggle-track">
        <motion.div 
          className="toggle-handle"
          layout
          initial={false}
          animate={{
            x: isOnline ? 20 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {isOnline && <div className="pulse-dot" />}
        </motion.div>
      </div>
      <span className="status-text">{isOnline ? 'You Are Live' : 'Offline'}</span>
    </button>
  );
};

export default AvailabilityToggle;

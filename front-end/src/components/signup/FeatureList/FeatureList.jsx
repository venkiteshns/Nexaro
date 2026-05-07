import React from 'react';
import './FeatureList.css';

const FeatureList = () => {
  return (
    <div className="feature-list">
      <div className="feature-item">
        <div className="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
        </div>
        <span>Get Bids in Minutes</span>
      </div>
      <div className="feature-item">
        <div className="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
        </div>
        <span>Pay Only When Done</span>
      </div>
      <div className="feature-item">
        <div className="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        </div>
        <span>Verified Workers Only</span>
      </div>
    </div>
  );
};

export default FeatureList;

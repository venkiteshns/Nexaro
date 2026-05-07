import React from 'react';
import './FloatingCards.css';

const FloatingCards = () => {
  return (
    <div className="floating-cards-container">
      <div className="float-card card-task">
        <div className="card-header">
          <span className="badge">ACTIVE TASK</span>
          <span className="price">₹500</span>
        </div>
        <h4 className="card-title">Fix bathroom water leakage</h4>
        <p className="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Dwarka, Sector 12
        </p>
        <div className="card-footer">
          <div className="avatar-group">
            <div className="avatar bg-blue"></div>
            <div className="avatar bg-green"></div>
            <div className="avatar bg-purple"></div>
            <div className="avatar-more">+1</div>
          </div>
          <span className="status"><span className="dot"></span> 4 workers bidding</span>
        </div>
      </div>

      <div className="float-card card-bid">
        <div className="bid-icon-wrapper">
          <div className="bid-icon">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01M18 12h.01"></path>
            </svg>
          </div>
        </div>
        <div className="bid-info">
          <p className="bid-title">New bid received — ₹420</p>
          <p className="bid-sub">from Ravi Kumar</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingCards;

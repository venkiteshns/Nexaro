import React from 'react';
import { FiLock, FiUnlock, FiBriefcase } from 'react-icons/fi';

const PaymentOverview = () => {
  return (
    <div className="poster-section" style={{ marginTop: '24px' }}>
      <div className="poster-section-header">
        <h2 className="poster-section-title">Payment Overview</h2>
        <a href="/poster/payments" className="poster-section-link">History</a>
      </div>
      <div className="poster-section-content">
        <div className="poster-payment-summary">
          <div className="poster-payment-row">
            <span className="poster-payment-label"><FiLock /> In Escrow</span>
            <span className="poster-payment-value">₹230.00</span>
          </div>
          <div className="poster-payment-row">
            <span className="poster-payment-label"><FiUnlock /> Released</span>
            <span className="poster-payment-value">₹2,220.00</span>
          </div>
          <div className="poster-payment-row">
            <span className="poster-payment-label"><FiBriefcase /> Tasks Paid</span>
            <span className="poster-payment-value">18</span>
          </div>
          <div className="poster-payment-total">
            <span className="poster-payment-label">Total Spent</span>
            <span className="poster-payment-value">₹2,450.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;

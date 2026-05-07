import React from 'react';
import './FeatureList.css';

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Real-time bidding',
    desc: 'Competitive transparent pricing in seconds.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Verified workers',
    desc: 'Rigorous vetting for quality assurance.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Escrow-safe payments',
    desc: 'Funds only release when the job is done.',
  },
];

const FeatureList = () => (
  <div className="lfl-list">
    {features.map((f, i) => (
      <div key={i} className="lfl-item">
        <div className="lfl-icon">{f.icon}</div>
        <div className="lfl-text">
          <p className="lfl-title">{f.title}</p>
          <p className="lfl-desc">{f.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export default FeatureList;

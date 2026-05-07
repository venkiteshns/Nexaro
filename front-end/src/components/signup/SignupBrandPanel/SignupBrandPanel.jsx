import React from 'react';
import FloatingCards from '../FloatingCards/FloatingCards';
import FeatureList from '../FeatureList/FeatureList';
import './SignupBrandPanel.css';

const SignupBrandPanel = () => {
  return (
    <div className="brand-panel">
      <div className="brand-content">
        <div className="brand-logo-area">
          <div className="logo-icon">N</div>
          <span className="logo-text">NEXARO</span>
        </div>
        <h1 className="brand-tagline">Skills Meet Needs. Instantly.</h1>
        
        <div className="brand-visuals">
          <FloatingCards />
        </div>
        
        <FeatureList />
        
        <div className="brand-footer">
          <p>TRUSTED BY 10,000+ PEOPLE</p>
        </div>
      </div>
    </div>
  );
};

export default SignupBrandPanel;

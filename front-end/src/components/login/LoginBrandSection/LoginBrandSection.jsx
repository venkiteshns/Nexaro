import React from 'react';
import FeatureList from '../FeatureList/FeatureList';
import './LoginBrandSection.css';

const LoginBrandSection = () => (
  <div className="lbs-panel">
    {/* Decorative background blobs */}
    <div className="lbs-blob lbs-blob--1" aria-hidden="true" />
    <div className="lbs-blob lbs-blob--2" aria-hidden="true" />

    <div className="lbs-content">
      {/* Logo */}
      <div className="lbs-logo">
        <div className="lbs-logo__icon">N</div>
        <span className="lbs-logo__text">NEXARO</span>
      </div>

      {/* Headline */}
      <div className="lbs-hero">
        <h1 className="lbs-headline">
          Skills Meet Needs.<br />
          <span className="lbs-headline--accent">Instantly.</span>
        </h1>
        <p className="lbs-subtext">
          The editorial-grade marketplace for skilled professionals and ambitious projects.
        </p>
      </div>

      {/* Features */}
      <FeatureList />

      {/* Trust badge */}
      <div className="lbs-trust">
        <span className="lbs-trust__dot" />
        TRUSTED BY 10,000+ PEOPLE ACROSS INDIA
      </div>
    </div>
  </div>
);

export default LoginBrandSection;

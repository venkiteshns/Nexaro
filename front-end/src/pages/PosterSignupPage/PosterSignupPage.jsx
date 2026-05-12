import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PasswordInput from '../../components/shared/PasswordInput/PasswordInput.jsx';
import LocationAccessCard from '../../components/location/LocationAccessCard/LocationAccessCard.jsx';
import { useLocationAccess } from '../../hooks/useLocationAccess.js';
import './PosterSignupPage.css';

// ─────────────────────────────────────────────
// CustomSelect Component
// ─────────────────────────────────────────────

const IconSend = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// CustomSelect is handled inside shared LocationAccessCard where needed

// ─────────────────────────────────────────────
// FloatingCards
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// FeatureList
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// SignupBrandPanel
// ─────────────────────────────────────────────
const SignupBrandPanel = () => {
  return (
    <div className="brand-panel">
      <div className="brand-content">
        <div className="brand-logo-area">
          <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: "32px", width: "auto" }} />
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

// ─────────────────────────────────────────────
// SignupForm
// ─────────────────────────────────────────────
const SignupForm = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const password = watch('password');
  const { geoState, setGeoState, attempts, requestLocation, maxRetries } = useLocationAccess(setValue);

  const onSubmit = (data) => {
    console.log('Form Submitted', data);
    // Handle submission logic here
  };

  return (
    <div className="signup-form-container">
      <div className="form-header">
        <div className="login-link">
          Already have an account? <Link to="/login" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Login →</Link>
        </div>
        <h2>Create Your <span className="text-accent">Poster</span> Account</h2>
        <p className="subtitle">Join India's most trusted hyperlocal task marketplace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form" noValidate>
        <div className="form-group">
          <label>FULL NAME</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              className={errors.fullName ? 'error-input' : ''}
              {...register('fullName', { required: 'Full name is required' })}
            />
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="rahul@example.com"
                className={errors.email ? 'error-input' : ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format'
                  }
                })}
              />
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group half">
            <label>PHONE NUMBER</label>
            <div className="input-wrapper phone-wrapper">
              <span className="phone-prefix">+91</span>
              <input
                type="tel"
                placeholder="98765 43210"
                className={errors.phone ? 'error-input' : ''}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Must be 10 digits'
                  }
                })}
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>CREATE PASSWORD</label>
          <PasswordInput 
            name="password"
            register={register}
            rules={{ required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" }, pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/, message: "Include at least one uppercase letter and one number" } }}
            error={errors.password}
            placeholder="••••••••••••"
            watch={watch}
            showStrength={true}
          />
        </div>

        <div className="form-group">
          <label>CONFIRM PASSWORD</label>
          <PasswordInput 
            name="confirmPassword"
            register={register}
            rules={{ required: "Please confirm your password", validate: value => value === password || "Passwords do not match" }}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
            watch={watch}
          />
        </div>

        <div className="form-group">
          <label>YOUR LOCATION</label>
          <div style={{ marginTop: '6px' }}>
            <LocationAccessCard 
              geoState={geoState}
              attempts={attempts}
              maxRetries={maxRetries}
              requestLocation={requestLocation}
              setGeoState={setGeoState}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              requireServiceArea={false}
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" {...register('terms', { required: 'You must agree to the terms' })} />
            <span className="checkmark"></span>
            <span className="terms-text">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I understand NEXARO uses my location to show nearby tasks.
            </span>
          </label>
          {errors.terms && <span className="error-text">{errors.terms.message}</span>}
        </div>

        <button type="submit" className="btn-primary">
          <span className="btn-icon"><IconSend /></span> Create My Account
        </button>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button type="button" className="btn-google">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google Account
        </button>

        <div className="auth-cta-container">
          <Link to="/login" className="auth-cta-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="auth-cta-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            </div>
            <div className="auth-cta-content">
              <span className="auth-cta-subtitle">Already have an account?</span>
              <h3 className="auth-cta-title">
                Log in to Nexaro
                <svg className="auth-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </h3>
            </div>
          </Link>

          <Link to="/signup/worker" className="auth-cta-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="auth-cta-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div className="auth-cta-content">
              <span className="auth-cta-subtitle">Looking to earn?</span>
              <h3 className="auth-cta-title">
                Register as a Worker
                <svg className="auth-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </h3>
            </div>
          </Link>
        </div>
      </form>

      <div className="form-footer-text">
        © 2026 NEXARO. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const PosterSignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-left">
        <SignupBrandPanel />
      </div>
      <div className="signup-right">
        <SignupForm />
      </div>
    </div>
  );
};

export default PosterSignupPage;

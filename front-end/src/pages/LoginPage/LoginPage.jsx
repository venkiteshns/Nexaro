import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './LoginPage.css';

// ─────────────────────────────────────────────
// FeatureList
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// LoginBrandSection
// ─────────────────────────────────────────────
const LoginBrandSection = () => (
  <div className="lbs-panel">
    <div className="lbs-blob lbs-blob--1" aria-hidden="true" />
    <div className="lbs-blob lbs-blob--2" aria-hidden="true" />

    <div className="lbs-content">
      <div className="lbs-logo">
        <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: "32px", width: "auto" }} />
        <span className="lbs-logo__text">NEXARO</span>
      </div>

      <div className="lbs-hero">
        <h1 className="lbs-headline">
          Skills Meet Needs.<br />
          <span className="lbs-headline--accent">Instantly.</span>
        </h1>
        <p className="lbs-subtext">
          The editorial-grade marketplace for skilled professionals and ambitious projects.
        </p>
      </div>

      <FeatureList />

      <div className="lbs-trust">
        <span className="lbs-trust__dot" />
        TRUSTED BY 10,000+ PEOPLE ACROSS INDIA
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// SocialLoginButton
// ─────────────────────────────────────────────
const SocialLoginButton = ({ onClick }) => (
  <button type="button" className="slb-btn" onClick={onClick}>
    <svg viewBox="0 0 24 24" width="20" height="20" className="slb-icon">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
    Sign in with Google
  </button>
);

// ─────────────────────────────────────────────
// LoginFormCard
// ─────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const LoginFormCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log('Login data:', data);
  };

  return (
    <div className="lfc-card">
      <div className="lfc-header">
        <div className="lfc-logo">
          <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: "32px", width: "auto" }} />
          <span className="lfc-logo__text">NEXARO</span>
        </div>
        <h2 className="lfc-title">Welcome back</h2>
        <p className="lfc-subtitle">Login to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="lfc-form" noValidate>
        <div className="lfc-field">
          <label className="lfc-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="name@company.com"
            className={`lfc-input ${errors.email ? 'lfc-input--error' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <span className="lfc-error">{errors.email.message}</span>}
        </div>

        <div className="lfc-field">
          <div className="lfc-label-row">
            <label className="lfc-label" htmlFor="login-password">Password</label>
            <a href="#" className="lfc-forgot">Forgot password?</a>
          </div>
          <div className="lfc-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`lfc-input lfc-input--padded ${errors.password ? 'lfc-input--error' : ''}`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              className="lfc-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && <span className="lfc-error">{errors.password.message}</span>}
        </div>

        <button type="submit" className="lfc-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Login to Nexaro'}
        </button>

        <div className="lfc-divider"><span>or continue with</span></div>

        <SocialLoginButton />

        <div className="auth-cta-container">
          <Link to="/signup/worker" className="auth-cta-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="auth-cta-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="auth-cta-content">
              <span className="auth-cta-subtitle">Looking to earn?</span>
              <h3 className="auth-cta-title">
                Register as a Worker
                <svg className="auth-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </h3>
            </div>
          </Link>

          <Link to="/signup/poster" className="auth-cta-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="auth-cta-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div className="auth-cta-content">
              <span className="auth-cta-subtitle">Need to hire someone?</span>
              <h3 className="auth-cta-title">
                Register as a Poster
                <svg className="auth-cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </h3>
            </div>
          </Link>
        </div>
      </form>

      <div className="lfc-footer-links">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Support</a>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const LoginPage = () => (
  <div className="login-page">
    <div className="login-page__left">
      <LoginBrandSection />
    </div>
    <div className="login-page__right">
      <LoginFormCard />
    </div>
  </div>
);

export default LoginPage;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import SocialLoginButton from '../SocialLoginButton/SocialLoginButton';
import './LoginFormCard.css';

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
    // Simulate async login
    await new Promise((r) => setTimeout(r, 600));
    console.log('Login data:', data);
  };

  return (
    <div className="lfc-card">
      {/* Card header */}
      <div className="lfc-header">
        <div className="lfc-logo">
          <div className="lfc-logo__icon">N</div>
          <span className="lfc-logo__text">NEXARO</span>
        </div>
        <h2 className="lfc-title">Welcome back</h2>
        <p className="lfc-subtitle">Login to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="lfc-form" noValidate>
        {/* Email */}
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

        {/* Password */}
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

        {/* Submit */}
        <button
          type="submit"
          className="lfc-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in…' : 'Login to Nexaro'}
        </button>

        {/* Divider */}
        <div className="lfc-divider"><span>or continue with</span></div>

        {/* Google */}
        <SocialLoginButton />

        {/* Register link */}
        <p className="lfc-register">
          Don't have an account?{' '}
          <Link to="/signup/poster" className="lfc-register__link">Register</Link>
        </p>
      </form>

      {/* Footer links */}
      <div className="lfc-footer-links">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Support</a>
      </div>
    </div>
  );
};

export default LoginFormCard;

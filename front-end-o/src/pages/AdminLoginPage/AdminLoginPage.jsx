import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChevronRight,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings2,
  BarChart3,
  Terminal,
} from 'lucide-react';
import './AdminLoginPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// Animation Variants
// ─────────────────────────────────────────────────────────────────────────────
const heroVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 40, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 * i },
  }),
};

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    transition: { duration: 0.5 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SecurityFeatureCard
// ─────────────────────────────────────────────────────────────────────────────
const securityFeatures = [
  {
    icon: <Shield size={18} />,
    title: 'Security Architecture',
    desc: 'Military-grade encryption with zero-knowledge access protocols.',
  },
  {
    icon: <Layers size={18} />,
    title: 'Platform Governance',
    desc: 'Full-stack control over user permissions, roles, and data flows.',
  },
  {
    icon: <Activity size={18} />,
    title: 'System Integrity',
    desc: 'Real-time audit trails and compliance monitoring across all nodes.',
  },
];

const SecurityFeatureCard = () => (
  <motion.div
    className="asc-card"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
  >
    <div className="asc-card__glow" aria-hidden="true" />
    <div className="asc-card__header">
      <span className="asc-card__badge">
        <span className="asc-card__badge-dot" />
        System Active
      </span>
    </div>
    <div className="asc-card__features">
      {securityFeatures.map((f, i) => (
        <motion.div
          key={i}
          className="asc-feature"
          custom={i}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className="asc-feature__icon">{f.icon}</div>
          <div className="asc-feature__text">
            <p className="asc-feature__title">{f.title}</p>
            <p className="asc-feature__desc">{f.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// AdminHeroPanel
// ─────────────────────────────────────────────────────────────────────────────
const AdminHeroPanel = () => (
  <motion.div
    className="ahp-panel"
    variants={heroVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Ambient background layers */}
    <div className="ahp-bg-radial ahp-bg-radial--1" aria-hidden="true" />
    <div className="ahp-bg-radial ahp-bg-radial--2" aria-hidden="true" />
    <div className="ahp-grid" aria-hidden="true" />

    <div className="ahp-content">
      {/* Logo */}
      <motion.div
        className="ahp-logo"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <img src="/Logo_Nex.png" alt="NEXARO" style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
        <span className="ahp-logo__text">NEXARO</span>
      </motion.div>

      {/* Label */}
      <motion.div
        className="ahp-label"
        custom={1}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <Terminal size={12} strokeWidth={2.5} />
        Admin Control Center
      </motion.div>

      {/* Headline */}
      <motion.div
        className="ahp-headline-block"
        custom={2}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <h1 className="ahp-headline">
          Precision Control<br />
          <span className="ahp-headline--accent">for Modern Operations.</span>
        </h1>
        <p className="ahp-subtext">
          Access the core architecture of the NEXARO platform with
          enterprise-grade security protocols and operational command.
        </p>
      </motion.div>

      {/* Security card */}
      <SecurityFeatureCard />

      {/* Stat strip */}
      <motion.div
        className="ahp-stats"
        custom={6}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        {[
          { icon: <BarChart3 size={14} />, value: '99.99%', label: 'Uptime' },
          { icon: <Shield size={14} />, value: 'AES-256', label: 'Encryption' },
          { icon: <Settings2 size={14} />, value: '24 / 7', label: 'Monitoring' },
        ].map((s, i) => (
          <div key={i} className="ahp-stat">
            <span className="ahp-stat__icon">{s.icon}</span>
            <span className="ahp-stat__value">{s.value}</span>
            <span className="ahp-stat__label">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// AdminAuthCard
// ─────────────────────────────────────────────────────────────────────────────
const AdminAuthCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitState, setSubmitState] = useState('idle'); // idle | loading | success | error

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    setSubmitState('loading');
    // Simulate API call — wire up real admin auth here
    await new Promise((r) => setTimeout(r, 1800));
    // Demo: toggle success/error based on a fake condition
    if (data.email.includes('admin')) {
      setSubmitState('success');
    } else {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
    console.log('[AdminLogin] payload:', data);
  };

  const isLoading = submitState === 'loading';
  const isSuccess = submitState === 'success';
  const isError = submitState === 'error';

  return (
    <motion.div
      className="aac-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(10,110,92,0.18)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient top glow */}
      <div className="aac-top-glow" aria-hidden="true" />

      {/* ── Header ── */}
      <motion.div
        className="aac-header"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <div className="aac-header__icon">
          <Shield size={20} strokeWidth={2} />
        </div>
        <div>
          <h2 className="aac-title">Admin Access</h2>
          <p className="aac-subtitle">Authenticated administrators only</p>
        </div>
      </motion.div>

      {/* ── Form ── */}
      <AnimatePresence>
        {isSuccess ? (
          <motion.div
            key="success"
            className="aac-success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <CheckCircle2 size={48} className="aac-success-icon" />
            </motion.div>
            <p className="aac-success-text">Access Granted</p>
            <p className="aac-success-sub">Redirecting to Admin Panel…</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="aac-form"
            noValidate
            variants={shakeVariants}
            animate={isError ? 'shake' : ''}
          >
            {/* Error banner */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  className="aac-error-banner"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle size={14} />
                  Invalid credentials. Please try again.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <motion.div
              className="aac-field"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <label className="aac-label" htmlFor="admin-email">Email Address</label>
              <div className="aac-input-wrap">
                <span className="aac-input-icon">
                  <Mail size={15} strokeWidth={2} />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@nexaro.io"
                  autoComplete="email"
                  className={`aac-input ${errors.email ? 'aac-input--error' : ''}`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  onBlur={() => trigger('email')}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.span
                    className="aac-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle size={11} />
                    {errors.email.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password field */}
            <motion.div
              className="aac-field"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="aac-label-row">
                <label className="aac-label" htmlFor="admin-password">Password</label>
                <a href="#" className="aac-forgot">Forgot password?</a>
              </div>
              <div className="aac-input-wrap">
                <span className="aac-input-icon">
                  <Lock size={15} strokeWidth={2} />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className={`aac-input aac-input--pw ${errors.password ? 'aac-input--error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
                <button
                  type="button"
                  className="aac-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.span
                    className="aac-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle size={11} />
                    {errors.password.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember me */}
            <motion.div
              className="aac-remember-row"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <button
                type="button"
                className={`aac-checkbox ${rememberMe ? 'aac-checkbox--checked' : ''}`}
                onClick={() => setRememberMe((v) => !v)}
                aria-pressed={rememberMe}
                id="admin-remember"
              >
                {rememberMe && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <CheckCircle2 size={12} />
                  </motion.span>
                )}
              </button>
              <label htmlFor="admin-remember" className="aac-remember-label" onClick={() => setRememberMe((v) => !v)}>
                Keep me signed in for 30 days
              </label>
            </motion.div>

            {/* CTA button */}
            <motion.button
              type="submit"
              className={`aac-btn-primary ${isLoading ? 'aac-btn-primary--loading' : ''}`}
              disabled={isLoading}
              custom={4}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              whileHover={!isLoading ? { y: -2, boxShadow: '0 12px 32px rgba(10,110,92,0.45)' } : {}}
              whileTap={!isLoading ? { y: 0, scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="aac-btn-spinner" />
                  Authenticating…
                </>
              ) : (
                <>
                  Login to Admin Panel
                  <ChevronRight size={16} className="aac-btn-arrow" />
                </>
              )}
            </motion.button>

            {/* Security note */}
            <motion.div
              className="aac-security-note"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Shield size={11} strokeWidth={2.5} />
              Authorized admin access only · All sessions are logged and monitored
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AdminLoginPage
// ─────────────────────────────────────────────────────────────────────────────
const AdminLoginPage = () => (
  <div className="alp-page">
    {/* Cinematic background */}
    <div className="alp-bg" aria-hidden="true">
      <div className="alp-bg__orb alp-bg__orb--1" />
      <div className="alp-bg__orb alp-bg__orb--2" />
      <div className="alp-bg__orb alp-bg__orb--3" />
    </div>

    <div className="alp-split">
      {/* Left hero */}
      <div className="alp-split__left">
        <AdminHeroPanel />
      </div>

      {/* Right auth */}
      <div className="alp-split__right">
        <AdminAuthCard />
      </div>
    </div>
  </div>
);

export default AdminLoginPage;

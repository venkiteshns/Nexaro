import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMailCheckLine, RiShieldCheckLine, RiLockPasswordLine } from 'react-icons/ri';

import OtpInput from '../../components/shared/OtpInput/OtpInput';
import SuccessAnimation from '../../components/shared/SuccessAnimation/SuccessAnimation';
import ErrorFeedback from '../../components/shared/ErrorFeedback/ErrorFeedback';

import './VerifyOtpPage.css';

/* ──────────────────────────────────────────────────────────────────────────
   CONSTANTS
   ──────────────────────────────────────────────────────────────────────── */
const DEMO_CORRECT_OTP = '123456'; // frontend simulation only
const TIMER_SECONDS = 60;
const MASKED_EMAIL = 'j••••e@company.com'; // Replace with real value later

/* ──────────────────────────────────────────────────────────────────────────
   MINI-NAV
   ──────────────────────────────────────────────────────────────────────── */
const VerifyNavbar = () => (
  <motion.nav
    className="votp-nav"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <div className="votp-nav__inner">
      <Link to="/" className="votp-nav__logo" aria-label="Nexaro home">
        <img src="/Logo_Nex.png" alt="NEXARO" className="votp-nav__logo-img" />
        <span className="votp-nav__logo-text">NEXARO</span>
      </Link>
      <div className="votp-nav__security">
        <RiShieldCheckLine size={14} className="votp-nav__shield" aria-hidden="true" />
        <span>Secure Verification</span>
      </div>
    </div>
  </motion.nav>
);

/* ──────────────────────────────────────────────────────────────────────────
   TIMER HOOK
   ──────────────────────────────────────────────────────────────────────── */
function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    setRunning(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatted = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return { seconds, formatted, canResend: !running && seconds === 0, restart: start };
}

/* ──────────────────────────────────────────────────────────────────────────
   TRUST BADGES
   ──────────────────────────────────────────────────────────────────────── */
const TrustBadges = () => (
  <motion.div
    className="votp-trust"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.7, duration: 0.5 }}
  >
    {[
      { icon: <RiLockPasswordLine size={13} />, text: 'Code expires in 1 min' },
      { icon: <RiMailCheckLine size={13} />, text: 'Sent to verified address' },
    ].map(({ icon, text }, i) => (
      <div key={i} className="votp-trust__badge">
        <span className="votp-trust__badge-icon" aria-hidden="true">{icon}</span>
        <span>{text}</span>
      </div>
    ))}
  </motion.div>
);

/* ──────────────────────────────────────────────────────────────────────────
   MAIN PAGE
   ──────────────────────────────────────────────────────────────────────── */
const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [status, setStatus] = useState('idle'); // idle | submitting | error | success
  const [resendCount, setResendCount] = useState(0);
  const [resendMsg, setResendMsg] = useState('');

  const { seconds, formatted, canResend, restart } = useCountdown(TIMER_SECONDS);

  /* ── digit change handler ── */
  const handleDigitChange = useCallback((index, digit) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // Clear error when user starts typing again
    if (status === 'error') setStatus('idle');
  }, [status]);

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;

    setStatus('submitting');
    // Simulate network round-trip
    await new Promise((r) => setTimeout(r, 900));

    if (code === DEMO_CORRECT_OTP) {
      setStatus('success');
      // Redirect after success animation plays
      setTimeout(() => navigate('/'), 2600);
    } else {
      setStatus('error');
      // Auto-reset error state after shake completes
      setTimeout(() => {
        setStatus('idle');
        setDigits(Array(6).fill(''));
      }, 1800);
    }
  };

  /* ── keyboard: submit on Enter when all filled ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && digits.join('').length === 6 && status === 'idle') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [digits, status]);

  /* ── resend ── */
  const handleResend = () => {
    if (!canResend) return;
    setResendCount((n) => n + 1);
    setDigits(Array(6).fill(''));
    setStatus('idle');
    restart();
    setResendMsg('A new code has been sent to your email.');
    setTimeout(() => setResendMsg(''), 4000);
  };

  const isComplete = digits.join('').length === 6;
  const isSubmitting = status === 'submitting';
  const hasError = status === 'error';

  return (
    <>
      {/* ── Background decoration ── */}
      <div className="votp-bg" aria-hidden="true">
        <div className="votp-bg__blob votp-bg__blob--1" />
        <div className="votp-bg__blob votp-bg__blob--2" />
        <div className="votp-bg__grid" />
      </div>

      {/* ── Navbar ── */}
      <VerifyNavbar />

      {/* ── Page wrapper ── */}
      <main className="votp-page" id="main-content">
        <motion.div
          className="votp-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          {/* ── Icon ── */}
          <motion.div
            className="votp-card__icon-wrap"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            <RiMailCheckLine size={26} className="votp-card__icon" aria-hidden="true" />
          </motion.div>

          {/* ── Header ── */}
          <motion.header
            className="votp-card__header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut', delay: 0.26 }}
          >
            <h1 className="votp-card__title">Verify Your Email</h1>
            <p className="votp-card__subtitle">
              We sent a 6-digit verification code to your email address.
            </p>
            <p className="votp-card__email">
              <span className="votp-card__email-addr">{MASKED_EMAIL}</span>
              {' '}
              <button
                type="button"
                className="votp-card__change-email"
                onClick={() => navigate('/login')}
                aria-label="Change email address"
              >
                Change email
              </button>
            </p>
          </motion.header>

          {/* ── Divider ── */}
          <div className="votp-divider" aria-hidden="true" />

          {/* ── OTP Form ── */}
          <form
            className="votp-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="OTP verification form"
          >
            {/* OTP Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.34 }}
            >
              <fieldset className="votp-fieldset" aria-label="Enter verification code">
                <legend className="votp-fieldset__legend">Verification Code</legend>
                <OtpInput
                  value={digits}
                  onChange={handleDigitChange}
                  hasError={hasError}
                  disabled={isSubmitting || status === 'success'}
                />
              </fieldset>
            </motion.div>

            {/* Error feedback */}
            <ErrorFeedback
              visible={hasError}
              message="That code doesn't match. Please check and try again."
            />

            {/* Resend success toast */}
            <AnimatePresence>
              {resendMsg && (
                <motion.p
                  className="votp-resend-msg"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                  role="status"
                  aria-live="polite"
                >
                  {resendMsg}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.42 }}
            >
              <button
                type="submit"
                className={`votp-btn-primary ${!isComplete || isSubmitting ? 'votp-btn-primary--disabled' : ''}`}
                disabled={!isComplete || isSubmitting || status === 'success'}
                id="verify-email-btn"
                aria-label="Verify email address"
              >
                {isSubmitting ? (
                  <span className="votp-btn-primary__spinner" aria-label="Verifying…">
                    <span className="votp-spinner" aria-hidden="true" />
                    Verifying…
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
            </motion.div>

            {/* Timer + resend */}
            <motion.div
              className="votp-timer-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.38 }}
            >
              {canResend ? (
                <span className="votp-timer-row__text">Didn't receive the code?{' '}
                  <button
                    type="button"
                    className="votp-resend-btn"
                    onClick={handleResend}
                    id="resend-otp-btn"
                    aria-label="Resend verification code"
                  >
                    Resend code
                    {resendCount > 0 && (
                      <span className="votp-resend-btn__count"> ({resendCount})</span>
                    )}
                  </button>
                </span>
              ) : (
                <span className="votp-timer-row__text">
                  Resend code in{' '}
                  <span className="votp-timer-row__countdown" aria-live="polite" aria-atomic="true">
                    {formatted}
                  </span>
                </span>
              )}
            </motion.div>
          </form>

          {/* ── Divider ── */}
          <div className="votp-divider" aria-hidden="true" />

          {/* ── Trust badges ── */}
          <TrustBadges />

          {/* ── Footer links ── */}
          <motion.footer
            className="votp-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.78, duration: 0.4 }}
          >
            <a href="#" className="votp-footer__link">Terms</a>
            <span className="votp-footer__sep" aria-hidden="true">·</span>
            <a href="#" className="votp-footer__link">Privacy</a>
            <span className="votp-footer__sep" aria-hidden="true">·</span>
            <a href="#" className="votp-footer__link">Support</a>
          </motion.footer>
        </motion.div>

        {/* Hint below card */}
        <motion.p
          className="votp-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          <strong>Tip:</strong> Check your spam folder if you don't see the email.
        </motion.p>
      </main>

      {/* ── Success overlay ── */}
      <SuccessAnimation visible={status === 'success'} />
    </>
  );
};

export default VerifyOtpPage;

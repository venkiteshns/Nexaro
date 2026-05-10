import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SuccessAnimation.css';

/**
 * SuccessAnimation — Premium emerald checkmark reveal.
 * Show with `visible` prop.
 */
const SuccessAnimation = ({ visible = false }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="success-anim__overlay"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
          aria-label="Email verification successful"
        >
          {/* Outer pulse ring */}
          <motion.div
            className="success-anim__ring"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.15, 1], opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          />

          {/* Circle */}
          <motion.div
            className="success-anim__circle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            {/* SVG checkmark — drawn via stroke-dashoffset */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                d="M8 18.5L14.5 25L28 11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* Text */}
          <motion.div
            className="success-anim__text-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.55 }}
          >
            <p className="success-anim__title">Email Verified!</p>
            <p className="success-anim__sub">Welcome to Nexaro. Redirecting you now…</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation;

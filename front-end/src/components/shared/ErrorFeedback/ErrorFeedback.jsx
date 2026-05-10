import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiErrorWarningLine } from 'react-icons/ri';
import './ErrorFeedback.css';

/**
 * ErrorFeedback — Inline inline error message banner.
 * Props:
 *   message   string  — error text to display
 *   visible   bool    — mount/unmount with animation
 */
const ErrorFeedback = ({ message = 'Invalid code. Please try again.', visible = false }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="error-feedback"
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <RiErrorWarningLine className="error-feedback__icon" aria-hidden="true" size={16} />
          <span className="error-feedback__text">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorFeedback;

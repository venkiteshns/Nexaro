import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './OtpInput.css';

/**
 * OtpInput — Premium 6-digit OTP field.
 * Props:
 *   value      string[6]   current digits array
 *   onChange   fn(index, digit)
 *   hasError   bool
 *   disabled   bool
 */
const OtpInput = ({ value = [], onChange, hasError = false, disabled = false }) => {
  const inputRefs = useRef([]);

  const focusAt = (index) => {
    const el = inputRefs.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const handleChange = useCallback((e, index) => {
    const raw = e.target.value;
    // Allow only digits
    const digit = raw.replace(/\D/g, '').slice(-1);
    onChange(index, digit);
    if (digit && index < 5) {
      focusAt(index + 1);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[index]) {
        onChange(index, '');
      } else if (index > 0) {
        onChange(index - 1, '');
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      focusAt(index + 1);
    }
  }, [value, onChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    pasted.split('').forEach((digit, i) => {
      if (i < 6) onChange(i, digit);
    });
    // Focus last filled or next empty
    const focusIndex = Math.min(pasted.length, 5);
    focusAt(focusIndex);
  }, [onChange]);

  const handleFocus = (e) => e.target.select();

  return (
    <div
      className="otp-input__group"
      role="group"
      aria-label="One-time password input"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          className={`otp-input__cell-wrapper`}
          animate={hasError ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
          transition={hasError ? { duration: 0.45, ease: 'easeOut' } : {}}
        >
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            id={`otp-digit-${index + 1}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            disabled={disabled}
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1} of 6`}
            className={[
              'otp-input__cell',
              hasError ? 'otp-input__cell--error' : '',
              value[index] ? 'otp-input__cell--filled' : '',
            ].join(' ')}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default OtpInput;

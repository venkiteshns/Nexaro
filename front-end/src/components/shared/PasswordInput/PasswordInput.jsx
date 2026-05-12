import React, { useState } from 'react';
import { getStrength } from '../../../utils/helpers';
import './PasswordInput.css';

const IconEye = ({ off }) => off ? (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
) : (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default function PasswordInput({ register, name, rules, error, placeholder, watch, showStrength = false }) {
  const [showPw, setShowPw] = useState(false);
  const password = watch ? watch(name, "") : "";
  const strength = showStrength ? getStrength(password) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div className="nx-password-wrap">
        <input 
          type={showPw ? "text" : "password"} 
          className={`nx-input${error ? " error" : ""}`} 
          placeholder={placeholder || "Create a password"} 
          {...register(name, rules)} 
        />
        <button 
          type="button" 
          className="nx-password-toggle" 
          onClick={() => setShowPw(v => !v)}
        >
          <IconEye off={showPw} />
        </button>
      </div>
      
      {showStrength && password && strength && (
        <>
          <div className="nx-strength-bar">
            <div 
              className="nx-strength-fill" 
              style={{ width: `${strength.score * 25}%`, background: strength.color }} 
            />
          </div>
          <span className="nx-strength-label" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </>
      )}
      
      {error && <span className="nx-error-text">⚠ {error.message}</span>}
    </div>
  );
}

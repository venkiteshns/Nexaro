import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomSelect.css";

export default function CustomSelect({ name, options, placeholder, rules, register, setValue, watch, errors }) {
  const selectedValue = watch(name);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const dropdownRef = useRef(null);

  const updateCoords = useCallback(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left,
        top: rect.bottom + window.scrollY,
        width: rect.width
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen, updateCoords]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!event.target.closest('.nx-custom-dropdown')) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`nx-custom-select-wrap${isOpen ? ' nx-custom-select-wrap--open' : ''}`}
    >
      <input type="hidden" {...register(name, rules)} />
      <div
        className={`nx-custom-select ${errors[name] ? 'error' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(o => !o); } 
          if (e.key === 'Escape') setIsOpen(false); 
        }}
      >
        <span style={{ color: selectedValue ? 'var(--color-heading)' : 'var(--color-muted)' }}>
          {selectedValue || placeholder}
        </span>
        <svg
          className={`nx-custom-select-icon${isOpen ? ' nx-custom-select-icon--open' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && coords && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="nx-custom-dropdown"
              style={{
                position: 'absolute',
                top: coords.top + 6,
                left: coords.left,
                width: coords.width,
                zIndex: 99999,
              }}
              role="listbox"
            >
              {options && options.length > 0 ? (
                options.map(option => (
                  <div
                    key={option}
                    className={`nx-custom-option${selectedValue === option ? ' selected' : ''}`}
                    role="option"
                    aria-selected={selectedValue === option}
                    onClick={() => {
                      setValue(name, option, { shouldValidate: true });
                      setIsOpen(false);
                    }}
                  >
                    {option}
                    {selectedValue === option && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                ))
              ) : (
                <div className="nx-custom-option" style={{ color: 'var(--color-muted)', cursor: 'default', justifyContent: 'center' }}>
                  No options available
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const InputModal = ({ id, title, description, placeholder = '', defaultValue = '', submitText = 'Submit', cancelText = 'Cancel', onClose, type = 'info' }) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="nx-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${id}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="nx-modal__body">
          <h2 id={`modal-title-${id}`} className="nx-modal__title">{title}</h2>
          {description && <p className="nx-modal__description">{description}</p>}
          <input
            ref={inputRef}
            type="text"
            className="nx-modal__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="nx-modal__footer">
          <button 
            type="button"
            onClick={() => onClose(null)} 
            className="nx-modal__btn nx-modal__btn--secondary"
          >
            {cancelText}
          </button>
          <button 
            type="submit"
            className={`nx-modal__btn nx-modal__btn--${type === 'danger' ? 'danger' : 'primary'}`}
          >
            {submitText}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default InputModal;

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const iconMap = {
  danger: <AlertCircle size={24} strokeWidth={2} />,
  warning: <AlertTriangle size={24} strokeWidth={2} />,
  info: <Info size={24} strokeWidth={2} />,
  success: <CheckCircle size={24} strokeWidth={2} />
};

const ConfirmModal = ({ id, title, description, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'info', onClose }) => {
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
      <div className="nx-modal__body">
        <div className={`nx-modal__icon nx-modal__icon--${variant}`}>
          {iconMap[variant]}
        </div>
        <h2 id={`modal-title-${id}`} className="nx-modal__title">{title}</h2>
        {description && <p className="nx-modal__description">{description}</p>}
      </div>
      <div className="nx-modal__footer">
        <button 
          onClick={() => onClose(false)} 
          className="nx-modal__btn nx-modal__btn--secondary"
        >
          {cancelText}
        </button>
        <button 
          onClick={() => onClose(true)} 
          className={`nx-modal__btn nx-modal__btn--${variant === 'danger' ? 'danger' : 'primary'}`}
        >
          {confirmText}
        </button>
      </div>
    </motion.div>
  );
};

export default ConfirmModal;

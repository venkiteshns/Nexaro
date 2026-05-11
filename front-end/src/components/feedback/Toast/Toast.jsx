import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const iconMap = {
  success: <CheckCircle size={16} strokeWidth={2.5} />,
  error: <AlertCircle size={16} strokeWidth={2.5} />,
  warning: <AlertTriangle size={16} strokeWidth={2.5} />,
  info: <Info size={16} strokeWidth={2.5} />,
};

const titleMap = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

const Toast = ({ id, type = 'info', message, title, onClose }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`nx-toast nx-toast--${type}`}
      role="alert"
    >
      <div className="nx-toast__icon">
        {iconMap[type]}
      </div>
      <div className="nx-toast__content">
        <h4 className="nx-toast__title">{title || titleMap[type]}</h4>
        <p className="nx-toast__message">{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="nx-toast__close" aria-label="Close">
        <X size={14} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
};

export default Toast;

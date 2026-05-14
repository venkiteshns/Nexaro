import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotificationContext } from '../../../context/NotificationContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, removeToast } = useNotificationContext();

  return (
    <div className="nx-toast-container" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;

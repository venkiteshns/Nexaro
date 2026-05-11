import { useNotificationContext } from '../context/NotificationContext';

export const useToast = () => {
  const { addToast, removeToast } = useNotificationContext();

  const toast = {
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    custom: (message, options = {}) => addToast({ type: 'custom', message, ...options }),
    dismiss: (id) => removeToast(id),
  };

  return toast;
};

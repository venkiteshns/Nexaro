import { useNotificationContext } from '../context/NotificationContext';

export const useModal = () => {
  const { addModal } = useNotificationContext();

  const modal = {
    // Equivalent to confirm()
    confirm: (options) => addModal({ type: 'confirm', ...options }),
    
    // Equivalent to prompt()
    prompt: (options) => addModal({ type: 'prompt', ...options }),
    
    // Custom specific modals can go here
    custom: (options) => addModal({ type: 'custom', ...options }),
  };

  return modal;
};

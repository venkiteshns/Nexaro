import React, { createContext, useState, useCallback, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addModal = useCallback((modalParams) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    return new Promise((resolve) => {
      setModals((prev) => [
        ...prev,
        {
          id,
          ...modalParams,
          onClose: (result) => {
            removeModal(id);
            resolve(result);
          },
        },
      ]);
    });
  }, []);

  const removeModal = useCallback((id) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast, modals, addModal, removeModal }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);

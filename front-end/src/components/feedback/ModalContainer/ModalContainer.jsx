import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotificationContext } from '../../../context/NotificationContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import InputModal from '../InputModal/InputModal';

const ModalContainer = () => {
  const { modals } = useNotificationContext();

  // Block body scroll if any modal is open
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [modals.length]);

  return (
    <AnimatePresence>
      {modals.length > 0 && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="nx-modal-overlay"
        >
          <AnimatePresence mode="wait">
            {modals.map((modal, index) => {
              // Only render the topmost modal
              if (index !== modals.length - 1) return null;

              if (modal.type === 'confirm') {
                return <ConfirmModal key={modal.id} {...modal} />;
              }
              if (modal.type === 'prompt') {
                return <InputModal key={modal.id} {...modal} />;
              }
              // Handle custom modals here if needed
              return null;
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalContainer;

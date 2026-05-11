import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiX, FiLoader } from 'react-icons/fi';
import ModalPortal from '../../../portals/ModalPortal/ModalPortal';
import './LocationAccessModal.css';

export default function LocationAccessModal({ 
  isOpen, 
  onClose, 
  onAllow, 
  onManual, 
  geoState = "idle", 
  attempts = 0, 
  maxAttempts = 3 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalPortal>
          <div className="nx-location-modal-overlay">
            <motion.div
              className="nx-location-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
            <motion.div
              className="nx-location-modal-container"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <div className="nx-location-modal-header">
                 <div className={`nx-location-icon-wrapper ${geoState}`}>
                   {geoState === 'loading' ? (
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                       <FiLoader size={24} />
                     </motion.div>
                   ) : (
                     <FiMapPin size={24} />
                   )}
                 </div>
                 <button className="nx-location-close-btn" onClick={onClose} aria-label="Close modal">
                   <FiX size={20} />
                 </button>
              </div>
              
              <div className="nx-location-modal-body">
                {geoState === 'idle' && (
                  <>
                    <h3>Enable Location Access</h3>
                    <p>Allow Nexaro to detect your location for precise hyperlocal matching and better job recommendations.</p>
                  </>
                )}
                {geoState === 'loading' && (
                  <>
                    <h3>Detecting Location</h3>
                    <p>Please wait while we securely determine your precise location...</p>
                  </>
                )}
                {geoState === 'failed' && (
                  <>
                    <h3 style={{ color: '#DC2626' }}>Location Access Failed</h3>
                    <p>We couldn't automatically determine your location. You have {maxAttempts - attempts} {maxAttempts - attempts === 1 ? 'attempt' : 'attempts'} remaining.</p>
                  </>
                )}
              </div>
              
              <div className="nx-location-modal-footer">
                {geoState !== 'loading' && (
                  <button 
                    className={`nx-btn-primary ${geoState === 'failed' ? 'error' : ''}`} 
                    onClick={onAllow}
                  >
                    {geoState === 'failed' ? 'Retry Access' : 'Allow Location Access'}
                  </button>
                )}
                {geoState !== 'loading' && (
                  <button className="nx-btn-secondary" onClick={onManual}>
                    {geoState === 'failed' ? 'Skip and enter manually' : 'Enter manually'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </ModalPortal>
      )}
    </AnimatePresence>
  );
}

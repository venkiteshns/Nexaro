import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  let portalRoot = document.getElementById('modal-portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'modal-portal-root';
    document.body.appendChild(portalRoot);
  }

  return createPortal(children, portalRoot);
};

export default ModalPortal;

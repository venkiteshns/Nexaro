import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

/**
 * PublicRoute — Redirects authenticated users away from auth pages.
 * Uses activeRole (matches userSchema) for role-based redirection.
 */
const PublicRoute = () => {
  const { user, token } = useAuthStore((state) => state);

  if (user && token) {
    const role = user.activeRole || user.role;
    if (role === 'worker') return <Navigate to="/worker/dashboard" replace />;
    if (role === 'poster') return <Navigate to="/poster/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin-panel" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

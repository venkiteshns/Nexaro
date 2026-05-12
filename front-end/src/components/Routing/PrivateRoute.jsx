import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

/**
 * PrivateRoute — Blocks unauthenticated access.
 * Checks BOTH user object AND token existence.
 * Uses replace so the protected URL is removed from history.
 */
const PrivateRoute = () => {
  const { user, token } = useAuthStore((state) => state);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

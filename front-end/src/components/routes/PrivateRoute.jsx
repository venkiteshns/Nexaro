import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ allowedRoles, redirectTo = '/user/login' }) {
  const { accessToken, user } = useSelector((state) => state.auth);

  if (!accessToken || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(user?.role)) {
      const roleRedirects = {
        poster: '/poster/dashboard',
        worker: '/worker/dashboard',
      };
      const fallback = roleRedirects[user?.role] ?? '/';
      return <Navigate to={fallback} replace />;
    }
  }

  return <Outlet />;
}

export default PrivateRoute;

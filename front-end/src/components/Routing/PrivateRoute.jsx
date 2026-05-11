import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

const PrivateRoute = () => {
  const { user, token } = useAuthStore((state) => state);
  
  // If no user or token exists, redirect to login page
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access to the child routes
  return <Outlet />;
};

export default PrivateRoute;

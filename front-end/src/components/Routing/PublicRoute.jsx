import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

const PublicRoute = () => {
  const { user, token } = useAuthStore((state) => state);
  
  // If user is already logged in, redirect them away from auth pages (like login/signup)
  if (user && token) {
    return <Navigate to="/" replace />; // You can change this to /dashboard or based on role
  }

  return <Outlet />;
};

export default PublicRoute;

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

const PublicRoute = () => {
  const { user, token } = useAuthStore((state) => state);

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

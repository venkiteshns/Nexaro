import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

const PrivateRoute = () => {
  const { user, token } = useAuthStore((state) => state);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

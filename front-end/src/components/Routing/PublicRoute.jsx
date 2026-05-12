import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/store';

const PublicRoute = () => {
  const { user, token } = useAuthStore((state) => state);

  if (user && token) {
    if (user.role === "worker") return <Navigate to="/worker/dashboard" replace />;
    if (user.role === "poster") return <Navigate to="/poster/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

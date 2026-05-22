import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
  const { accessToken, user } = useSelector((state) => state.auth);
  if (accessToken && user) {
  
    const role = user.role;
    if (role === 'worker') return <Navigate to="/worker/dashboard" replace />;
    if (role === 'poster') return <Navigate to="/poster/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin-panel" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;

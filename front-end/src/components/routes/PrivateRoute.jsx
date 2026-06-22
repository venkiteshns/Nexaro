import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ allowedRoles }) {
  const adminAuth = useSelector((state) => state.adminAuth);
  const userAuth = useSelector((state) => state.auth);

  if (allowedRoles === "admin") {
    if (!(adminAuth.accessToken && adminAuth.admin)) {
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    if (!(userAuth.accessToken && userAuth.user)) {
      return <Navigate to="/user/login" replace />;
    }
  }

  return <Outlet />;
}

export default PrivateRoute;

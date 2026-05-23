import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ allowedRoles }) {
  if (allowedRoles === "admin") {
    const { accessToken, admin } = useSelector((state) => state.adminAuth);
    if (!(accessToken && admin)) {
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    if (!(accessToken && user)) {
      return <Navigate to="/user/login" replace />;
    }
    const { accessToken, user } = useSelector((state) => state.auth);
  }

  return <Outlet />;
}

export default PrivateRoute;

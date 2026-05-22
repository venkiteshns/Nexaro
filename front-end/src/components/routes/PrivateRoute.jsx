import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ allowedRoles }) {
  const { accessToken, user } = useSelector((state) => state.auth);

  if (!(accessToken && user)) {
    if (allowedRoles === "admin") {
      return <Navigate to="/admin/login" replace />;
    } else {
      return <Navigate to="/user/login" replace />;
    }
  }
  return <Outlet />;
}

export default PrivateRoute;

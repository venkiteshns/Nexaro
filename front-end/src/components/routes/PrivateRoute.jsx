import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ allowedRoles }) {
  const adminAuth = useSelector((state) => state?.adminAuth);
  const userAuth = useSelector((state) => state?.auth);

  if (allowedRoles === "admin") {
    if (!(adminAuth?.accessToken && adminAuth?.admin)) {
      return <Navigate to="/admin/login" replace />;
    }
      return <Outlet />;

  } else {
    // 1. Check if user is logged in
    if (!(userAuth?.accessToken && userAuth?.user)) {
      return <Navigate to="/user/login" replace />;
    }

    if (allowedRoles == userAuth.user.role) {
      console.log("allo state role", allowedRoles, userAuth.user.role);
      return <Outlet />;
    } else {
      if (userAuth.user.role === "worker") {
        return <Navigate to="/worker/dashboard" replace />;
      } else if (userAuth.user.role === "poster") {
        return <Navigate to="/poster/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }
}

export default PrivateRoute;

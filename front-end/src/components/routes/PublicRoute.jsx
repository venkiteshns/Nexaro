import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute({ user }) {
  if (user == "admin") {
    const { accessToken, admin } = useSelector((state) => state.adminAuth);

    if (accessToken && admin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  } else {
    const { accessToken, user } = useSelector((state) => state.auth);

    if (accessToken && user) {
      const role = user.role;
      if (role === "worker") return <Navigate to="/worker/dashboard" replace />;
      if (role === "poster") return <Navigate to="/poster/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default PublicRoute;

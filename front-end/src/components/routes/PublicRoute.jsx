import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute({ user: roleProp }) {
  const adminAuth = useSelector((state) => state.adminAuth);
  const userAuth = useSelector((state) => state.auth);

  if (roleProp === "admin") {
    if (adminAuth.accessToken && adminAuth.admin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  } else {
    if (userAuth.accessToken && userAuth.user) {
      const role = userAuth.user.role;
      if (role === "worker") return <Navigate to="/worker/dashboard" replace />;
      if (role === "poster") return <Navigate to="/poster/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default PublicRoute;

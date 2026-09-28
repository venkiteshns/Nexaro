import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  const adminAuth = useSelector((state) => state?.adminAuth);
  const userAuth = useSelector((state) => state?.auth);

  // If Admin is logged in, redirect away from public pages to admin dashboard
  if (adminAuth?.accessToken && adminAuth?.admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If Worker or Poster is logged in, redirect away from public pages to their respective dashboard/tasks
  if (userAuth?.accessToken && userAuth?.user) {
    const role = userAuth?.user?.role;
    if (role === "worker") {
      return <Navigate to="/worker/dashboard" replace />;
    }
    if (role === "poster") {
      return <Navigate to="/poster/my-tasks" replace />;
    }
  }

  return <Outlet />;
}

export default PublicRoute;

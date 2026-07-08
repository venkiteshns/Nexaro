import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ErrorBoundary from "./components/routes/ErrorBoundary.jsx";
import PublicRoute from "./components/routes/PublicRoute.jsx";
import PrivateRoute from "./components/routes/PrivateRoute.jsx";
import useSocketNotification from "./customHooks/useSocketNotification.js";

import Landing from "./pages/Landing/Landing.jsx";
import Map from "./components/Maps/Map.jsx";
import PosterSignup from "./pages/auth/PosterSignup.jsx";
import WorkerSignup from "./pages/auth/WorkerSignup.jsx";
import UserLogin from "./pages/auth/UserLogin.jsx";
import PosterDasboard from "./pages/poster/PosterDasboard.jsx";
import PostTask from "./pages/poster/PostTask.jsx";
import MyTasks from "./pages/poster/MyTasks.jsx";
import ReviewBids from "./pages/poster/ReviewBids.jsx";
import WorkProgress from "./pages/poster/WorkProgress.jsx";
import CompletedTaskDetails from "./pages/poster/CompletedTaskDetails.jsx";
import PosterProfile from "./pages/poster/PosterProfile.jsx";
import WorkerDashboard from "./pages/worker/WorkerDashboard.jsx";
import NearbyTasks from "./pages/worker/NearbyTasks.jsx";
import PlaceBid from "./pages/worker/PlaceBid.jsx";
import MyBids from "./pages/worker/MyBids.jsx";
import TaskBidDetails from './pages/worker/TaskBidDetails.jsx'
import ActiveJob from './pages/worker/ActiveJob.jsx'
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserMangement.jsx";
import UserVerificationPanel from './pages/admin/UserVerificationPanel.jsx'
import AdminTaskManagement from './pages/admin/AdminTaskManagement.jsx'
import AdminTaskDetails from './pages/admin/AdminTaskDetails.jsx'

function App() {
  useSocketNotification();

  return (
    <ErrorBoundary>
      <Router>
        <ToastContainer />
        <Routes>

          <Route element={<PublicRoute user={"admin"} />}>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          <Route element={<PublicRoute user={"user"} />}>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<Map />} />
            <Route path="/signup/poster" element={<PosterSignup />} />
            <Route path="/signup/worker" element={<WorkerSignup />} />
            <Route path="/user/login" element={<UserLogin />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles="poster" />}>
            <Route path="/poster">
              <Route path="dashboard" element={<PosterDasboard />} />
              <Route path="post-task" element={<PostTask />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="review-bids/:taskId" element={<ReviewBids />} />
              <Route path="work-progress/:taskId" element={<WorkProgress />} />
              <Route path="completed-task/:taskId" element={<CompletedTaskDetails />} />
              <Route path="profile" element={<PosterProfile />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles="worker" />}>
            <Route path="/worker">
              <Route path="dashboard" element={<WorkerDashboard />} />
              <Route path="nearby-tasks" element={<NearbyTasks />} />
              <Route path="place-bid/:taskId" element={<PlaceBid />} />
              <Route path="my-bids" element={<MyBids />} />
              <Route path='task-bid-details/:bidId' element={<TaskBidDetails />} />
              <Route path='active-job/:taskId' element={<ActiveJob />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles="admin" />}>
            <Route path="/admin">
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/verification" element={<UserVerificationPanel />} />
              <Route path="tasks" element={<AdminTaskManagement />} />
              <Route path="tasks/:taskId" element={<AdminTaskDetails />} />
            </Route>
          </Route>

        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

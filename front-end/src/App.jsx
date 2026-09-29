import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ErrorBoundary from "./components/routes/ErrorBoundary.jsx";
import PublicRoute from "./components/routes/PublicRoute.jsx";
import PrivateRoute from "./components/routes/PrivateRoute.jsx";
import useSocketNotification from "./customHooks/useSocketNotification.js";
import PageLoader from "./components/sharedComponents/PageLoader.jsx";

// Lazy load route pages for code-splitting
const Landing = lazy(() => import("./pages/Landing/Landing.jsx"));
const Map = lazy(() => import("./components/Maps/Map.jsx"));
const PosterSignup = lazy(() => import("./pages/auth/PosterSignup.jsx"));
const WorkerSignup = lazy(() => import("./pages/auth/WorkerSignup.jsx"));
const UserLogin = lazy(() => import("./pages/auth/UserLogin.jsx"));

const PostTask = lazy(() => import("./pages/poster/PostTask.jsx"));
const MyTasks = lazy(() => import("./pages/poster/MyTasks.jsx"));
const ReviewBids = lazy(() => import("./pages/poster/ReviewBids.jsx"));
const WorkProgress = lazy(() => import("./pages/poster/WorkProgress.jsx"));
const CompletedTaskDetails = lazy(() => import("./pages/poster/CompletedTaskDetails.jsx"));
const PosterProfile = lazy(() => import("./pages/poster/PosterProfile.jsx"));
const ReviewPage = lazy(() => import("./pages/poster/ReviewPage.jsx"));
const PosterNotifications = lazy(() => import("./pages/poster/PosterNotifications.jsx"));
const PosterPayments = lazy(() => import("./pages/poster/PosterPayments.jsx"));

const WorkerDashboard = lazy(() => import("./pages/worker/WorkerDashboard.jsx"));
const NearbyTasks = lazy(() => import("./pages/worker/NearbyTasks.jsx"));
const PlaceBid = lazy(() => import("./pages/worker/PlaceBid.jsx"));
const MyBids = lazy(() => import("./pages/worker/MyBids.jsx"));
const TaskBidDetails = lazy(() => import("./pages/worker/TaskBidDetails.jsx"));
const ActiveJob = lazy(() => import("./pages/worker/ActiveJob.jsx"));
const ActiveJobEntry = lazy(() => import("./pages/worker/ActiveJobEntry.jsx"));
const WorkerProfile = lazy(() => import("./pages/worker/WorkerProfile.jsx"));
const WorkerAllReviews = lazy(() => import("./pages/worker/WorkerAllReviews.jsx"));
const WorkerEarnings = lazy(() => import("./pages/worker/WorkerEarnings.jsx"));
const WorkerCompletedTaskDetails = lazy(() => import("./pages/worker/CompletedTaskDetails.jsx"));
const WorkerNotifications = lazy(() => import("./pages/worker/WorkerNotifications.jsx"));

const AdminLogin = lazy(() => import("./pages/auth/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const UserManagement = lazy(() => import("./pages/admin/UserMangement.jsx"));
const UserVerificationPanel = lazy(() => import("./pages/admin/UserVerificationPanel.jsx"));
const AdminTaskManagement = lazy(() => import("./pages/admin/AdminTaskManagement.jsx"));
const AdminTaskDetails = lazy(() => import("./pages/admin/AdminTaskDetails.jsx"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments.jsx"));
const AdminFinancialReports = lazy(() => import("./pages/admin/AdminFinancialReports.jsx"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications.jsx"));
const PaymentReceivedModal = lazy(() => import("./components/Worker/PaymentReceivedModal.jsx"));


function AppInner() {
  const navigate = useNavigate();
  const { paymentModalData, closePaymentModal } = useSocketNotification();

  const handleCloseModal = () => {
    const taskId = paymentModalData?.taskId;
    closePaymentModal();
    if (taskId) {
      navigate(`/worker/completed-task/${taskId}`);
    } else {
      navigate('/worker/my-bids');
    }
  };

  return (
    <>
      <ToastContainer limit={2} />
      {paymentModalData && (
        <PaymentReceivedModal
          data={paymentModalData}
          onClose={handleCloseModal}
          onViewTask={handleCloseModal}
        />
      )}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
            <PageLoader title="Loading" text="Please wait..." />
          </div>
        }
      >
        <Routes>

          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/map" element={<Map />} />
            <Route path="/signup/poster" element={<PosterSignup />} />
            <Route path="/signup/worker" element={<WorkerSignup />} />
            <Route path="/user/login" element={<UserLogin />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles="poster" />}>
            <Route path="/poster">
              <Route index element={<Navigate to="/poster/my-tasks" replace />} />
              <Route path="dashboard" element={<Navigate to="/poster/my-tasks" replace />} />
              <Route path="post-task" element={<PostTask />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="review-bids/:taskId" element={<ReviewBids />} />
              <Route path="work-progress/:taskId" element={<WorkProgress />} />
              <Route path="completed-task/:taskId" element={<CompletedTaskDetails />} />
              <Route path="profile" element={<PosterProfile />} />
              <Route path="review/:taskId" element={<ReviewPage />} />
              <Route path="notifications" element={<PosterNotifications />} />
              <Route path="payments" element={<PosterPayments />} />
            </Route>
          </Route>


          <Route element={<PrivateRoute allowedRoles="worker" />}>
            <Route path="/worker">
              <Route index element={<Navigate to="/worker/dashboard" replace />} />
              <Route path="dashboard" element={<WorkerDashboard />} />
              <Route path="nearby-tasks" element={<NearbyTasks />} />
              <Route path="place-bid/:taskId" element={<PlaceBid />} />
              <Route path="task-details/:taskId" element={<PlaceBid />} />
              <Route path="task/:taskId" element={<PlaceBid />} />
              <Route path="my-bids" element={<MyBids />} />
              <Route path='task-bid-details/:bidId' element={<TaskBidDetails />} />
              <Route path='active-job' element={<ActiveJobEntry />} />
              <Route path='active-job/:taskId' element={<ActiveJob />} />
              <Route path='completed-task/:taskId' element={<WorkerCompletedTaskDetails />} />
              <Route path='profile' element={<WorkerProfile />} />
              <Route path='all-reviews' element={<WorkerAllReviews />} />
              <Route path='earnings' element={<WorkerEarnings />} />
              <Route path='notifications' element={<WorkerNotifications />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles="admin" />}>
            <Route path="/admin">
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/verification" element={<UserVerificationPanel />} />
              <Route path="tasks" element={<AdminTaskManagement />} />
              <Route path="tasks/:taskId" element={<AdminTaskDetails />} />
              <Route path="finance/payments" element={<AdminPayments />} />
              <Route path="finance/reports" element={<AdminFinancialReports />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppInner />
      </Router>
    </ErrorBoundary>
  );
}

export default App;

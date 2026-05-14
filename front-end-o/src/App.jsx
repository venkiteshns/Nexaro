import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './pages/HomePage/HomePage.jsx'
import PosterSignupPage from './pages/PosterSignupPage/PosterSignupPage.jsx'
import WorkerSignupPage from './pages/WorkerSignupPage/WorkerSignupPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import WorkerDashboard from './pages/WorkerDashboard/WorkerDashboard.jsx'
import PosterDashboard from './pages/PosterDashboard/PosterDashboard.jsx'
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage.jsx'

// Protected Route Components
import PrivateRoute from './components/Routing/PrivateRoute.jsx'
import PublicRoute from './components/Routing/PublicRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

import { NotificationProvider } from './context/NotificationContext.jsx';
import ToastContainer from './components/feedback/Toast/ToastContainer.jsx';
import ModalContainer from './components/feedback/ModalContainer/ModalContainer.jsx';
import './styles/feedback.css';
function App() {

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Router>
          <Routes>

            <Route path="/" element={<HomePage />} />

            <Route element={<PublicRoute />}>
              <Route path="/signup/poster" element={<PosterSignupPage />} />
              <Route path="/signup/worker" element={<WorkerSignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              <Route path="/poster/dashboard" element={<PosterDashboard />} />
            </Route>

          </Routes>
        </Router>
        <ToastContainer />
        <ModalContainer />
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './pages/HomePage/HomePage.jsx'
import PosterSignupPage from './pages/PosterSignupPage/PosterSignupPage.jsx'
import WorkerSignupPage from './pages/WorkerSignupPage/WorkerSignupPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import VerifyOtpPage from './pages/VerifyOtpPage/VerifyOtpPage.jsx'

// Protected Route Components
import PrivateRoute from './components/Routing/PrivateRoute.jsx'
import PublicRoute from './components/Routing/PublicRoute.jsx'
import OtpProtectRoute from './components/Routing/OtpProtectRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes - Accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          
          {/* Public Routes - Restricted for logged-in users */}
          <Route element={<PublicRoute />}>
            <Route path="/signup/poster" element={<PosterSignupPage />} />
            <Route path="/signup/worker" element={<WorkerSignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* OTP Verification Route */}
          <Route element={<OtpProtectRoute />}>
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
          </Route>

          {/* Private Routes - Only accessible to logged-in users */}
          <Route element={<PrivateRoute />}>
            {/* Future private routes (dashboard, profile, etc.) go here */}
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App


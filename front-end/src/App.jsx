import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './pages/HomePage/HomePage.jsx'
import PosterSignupPage from './pages/PosterSignupPage/PosterSignupPage.jsx'
import WorkerSignupPage from './pages/WorkerSignupPage/WorkerSignupPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'

// Protected Route Components
import PrivateRoute from './components/Routing/PrivateRoute.jsx'
import PublicRoute from './components/Routing/PublicRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>

          <Route path="/" element={<HomePage />} />

          <Route element={<PublicRoute />}>
            <Route path="/signup/poster" element={<PosterSignupPage />} />
            <Route path="/signup/worker" element={<WorkerSignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<PrivateRoute />}>

          </Route>

        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App


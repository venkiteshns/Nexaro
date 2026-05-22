import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ErrorBoundary  from './components/routes/ErrorBoundary.jsx';
import PublicRoute    from './components/routes/PublicRoute.jsx';
import PrivateRoute   from './components/routes/PrivateRoute.jsx';

import Landing        from './pages/Landing/Landing.jsx';
import PosterSignup   from './pages/auth/PosterSignup.jsx';
import WorkerSignup   from './pages/auth/WorkerSignup.jsx';
import UserLogin      from './pages/auth/UserLogin.jsx';
import PosterDasboard from './pages/dashboards/PosterDasboard.jsx';


function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>

          <Route path='/' element={<Landing />} />

          <Route element={<PublicRoute />}>
            <Route path='/signup/poster'  element={<PosterSignup />} />
            <Route path='/signup/worker'  element={<WorkerSignup />} />
            <Route path='/user/login'     element={<UserLogin />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles='poster' />}>
            <Route path='/poster/dashboard' element={<PosterDasboard />} />
          </Route>

          {/* ── Private routes — worker only (uncomment when page exists) ─────── */}
          {/* <Route element={<PrivateRoute allowedRoles='worker' />}>
            <Route path='/worker/dashboard' element={<WorkerDashboard />} />
          </Route> */}

        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ErrorBoundary  from './components/routes/ErrorBoundary.jsx';
import PublicRoute    from './components/routes/PublicRoute.jsx';
import PrivateRoute   from './components/routes/PrivateRoute.jsx';

import Landing        from './pages/Landing/Landing.jsx';
import PosterSignup   from './pages/auth/PosterSignup.jsx';
import WorkerSignup   from './pages/auth/WorkerSignup.jsx';
import UserLogin      from './pages/auth/UserLogin.jsx';
import PosterDasboard from './pages/poster/PosterDasboard.jsx';
import WorkerDashboard from './pages/worker/WorkerDashboard.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';


function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>

          <Route path='/' element={<Landing />} />
          <Route path='/admin/login' element={<AdminLogin/>} />

          <Route element={<PublicRoute />}>
            <Route path='/signup/poster'  element={<PosterSignup />} />
            <Route path='/signup/worker'  element={<WorkerSignup />} />
            <Route path='/user/login'     element={<UserLogin />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles='poster' />}>
            <Route path='/poster/dashboard' element={<PosterDasboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles='worker' />}>
            <Route path='/worker/dashboard' element={<WorkerDashboard />} />
          </Route>

          {/* <Route element={<PrivateRoute allowedRoles='admin' />}>
            <Route path='/worker/dashboard' element={<WorkerDashboard />} />
          </Route> */}

        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

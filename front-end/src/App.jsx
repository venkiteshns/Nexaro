import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage          from './pages/HomePage/HomePage.jsx'
import PosterSignupPage  from './pages/PosterSignupPage/PosterSignupPage.jsx'
import WorkerSignupPage  from './pages/WorkerSignupPage/WorkerSignupPage.jsx'
import LoginPage         from './pages/LoginPage/LoginPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/signup/poster"  element={<PosterSignupPage />} />
        <Route path="/signup/worker"  element={<WorkerSignupPage />} />
        <Route path="/login"           element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App

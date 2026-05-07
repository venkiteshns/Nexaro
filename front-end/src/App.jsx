import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage          from './pages/HomePage.jsx'
import PosterSignupPage  from './pages/PosterSignupPage.jsx'
import WorkerSignupPage  from './pages/WorkerSignupPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/signup/poster"  element={<PosterSignupPage />} />
        <Route path="/signup/worker"  element={<WorkerSignupPage />} />
      </Routes>
    </Router>
  )
}

export default App

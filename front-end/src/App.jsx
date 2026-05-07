import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './pages/HomePage'
import PosterSignupPage from './pages/PosterSignupPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup/poster" element={<PosterSignupPage />} />
      </Routes>
    </Router>
  )
}

export default App

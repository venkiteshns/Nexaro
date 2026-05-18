import { useState } from 'react'
import PosterSignup from './pages/auth/PosterSignup'
import Landing from './pages/Landing/Landing.jsx'
import WorkerSignup from './pages/auth/WorkerSignup.jsx'
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/signup/worker' element={<WorkerSignup/>} />
        <Route path='/signup/poster' element={<PosterSignup/>} />
      </Routes>
    </Router>
  )
}

export default App

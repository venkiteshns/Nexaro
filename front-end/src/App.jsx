import { useState } from 'react'
import PosterSignup from './pages/auth/PosterSignup'
import Landing from './pages/Landing/Landing.jsx'
import WorkerSignup from './pages/auth/WorkerSignup.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WorkerSignup/>
      {/* <PosterSignup/> */}
    </>
  )
}

export default App

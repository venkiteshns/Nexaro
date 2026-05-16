import { useState } from 'react'
import PosterSignup from './pages/auth/PosterSignup'
import Landing from './pages/Landing/Landing.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PosterSignup/>
    </>
  )
}

export default App

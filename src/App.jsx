import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { home } from './components/home'
import { login } from './components/login'
import { Navbar } from './components/Navbar'
import { logout } from './components/logout'
import { signup } from './components/signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/login" element={<login />} />
          <Route path="/signup" element={<signup />} />
          <Route path="/logout" element={<logout />} />
          <Route path="/" element={<Navbar />} />
          <Route path="/home" element={<home />} />
          <Route path="/navbar" element={<Navbar />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

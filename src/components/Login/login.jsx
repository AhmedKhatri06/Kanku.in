import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import axios from "axios";


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()
   const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      alert(res.data.message);
      localStorage.setItem("token", res.data.token); // store JWT token
    } catch (err) {
      alert("Login failed");
    }
  };
  // Check if user is already logged in (simulate session)
  useEffect(() => {
    const savedUser = localStorage.getItem('userEmail')
    if (savedUser) {
      setEmail(savedUser)
      setLoggedIn(true)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('')
    // Simulate backend check (replace with API in real world)
    if (!email || !password) {
      setMessage('Please enter both email and password.')
      return
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }
    // Simulate login success
    setLoggedIn(true)
    localStorage.setItem('userEmail', email)
    setMessage('')
    setTimeout(() => {
      navigate('/home')
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    setEmail('')
    setPassword('')
    setLoggedIn(false)
    setMessage('Logged out successfully.')
  }

   const getInitial = (email) => {
    if (!email) return ''
    return email.trim()[0].toUpperCase()
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <div style={{color: '#e53935', marginBottom: '12px', textAlign: 'center'}}>{message}</div>}
        {!loggedIn ? (
          <>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="username"
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button type="submit">Login</button>
            <p className="login-link">
              Don't have an account? <a href="/register">Register</a>
            </p>
          </>
        ) : (
          <div style={{textAlign: 'center', color: '#1a237e', fontWeight: 'bold', fontSize: '1.2rem'}}>
                <span
              style={{
                display: 'inline-block',
                background: '#ff9800',
                color: '#fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                lineHeight: '40px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}
            >
              {getInitial(email)}
            </span>
            Welcome, {email}!<br />
            <button type="button" style={{marginTop: '18px'}} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </form>
    </div>
  )
}

export default Login
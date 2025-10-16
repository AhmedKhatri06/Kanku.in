import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './register.css'
import axios from "axios";
const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

   const handleRegister = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/register", { email, password });
    alert(res.data.message);
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setMessage('All fields are required.')
      return
    }
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(user => user.email === email)) {
      setMessage('User already registered with this email.')
      return
    }
    // Save user (never store plain passwords in real apps)
    users.push({ name, email, password })
    localStorage.setItem('users', JSON.stringify(users))
    setMessage('Registration successful! Confirmation email sent.')
    setName('')
    setEmail('')
    setPassword('')
    alert(`A confirmation email has been sent to: ${email}`)
    setTimeout(() => {
      navigate('/login')
    }, 1200)
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {message && <div style={{color: '#1a237e', marginBottom: '12px', textAlign: 'center'}}>{message}</div>}
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Enter your name"
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Create a password"
        />
        <button type="submit">Register</button>
        <p className="register-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  )
}

export default Register
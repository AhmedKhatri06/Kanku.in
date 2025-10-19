import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './register.css'
import axios from "axios";

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // FIX: Added 'async' keyword here
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post("http://localhost:5002/register", { 
        name, 
        email, 
        password 
      });
      
      if (response.data.success) {
        setMessage('✅ Registration successful! Redirecting to login...');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        setMessage('❌ Cannot connect to server. Make sure backend is running on port 5001.');
      } else {
        setMessage('❌ Registration failed. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {message && (
          <div style={{
            color: message.includes('✅') ? '#1a237e' : '#e53935', 
            marginBottom: '12px', 
            textAlign: 'center',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: message.includes('✅') ? '#e8f5e8' : '#ffebee',
            border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`
          }}>
            {message}
          </div>
        )}
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Enter your full name"
          disabled={loading}
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          disabled={loading}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Create a password (min. 6 characters)"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        <p className="register-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  )
}

export default Register
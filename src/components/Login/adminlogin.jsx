import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './register.css'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // For demo purposes - you can replace with actual API call
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        const adminUser = {
          _id: 'admin-1',
          name: 'Administrator',
          email: 'admin@example.com',
          isAdmin: true
        }
        
        localStorage.setItem('user', JSON.stringify(adminUser))
        localStorage.setItem('token', 'admin-token-demo')
        
        setMessage('Admin login successful!')
        setTimeout(() => {
          navigate('/admin')
        }, 1000)
      } else {
        setError('Invalid admin credentials. Use: admin@example.com / admin123')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🔐 Admin Login</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Access the admin dashboard
        </p>

        {(message || error) && (
          <div className={`auth-message ${error ? 'error' : 'success'}`}>
            {message || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Demo Credentials:<br />
            Email: <strong>admin@example.com</strong><br />
            Password: <strong>admin123</strong>
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="auth-link"
          >
            ← Back to User Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
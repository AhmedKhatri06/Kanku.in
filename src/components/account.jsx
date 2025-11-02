import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Account = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const getInitial = (email) => {
    if (!email) return ''
    return email.trim()[0].toUpperCase()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setMessage('Logged out successfully.')
    setTimeout(() => {
      navigate('/login')
    }, 800)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }
    setMessage('Password changed successfully! (Demo only)')
    setShowChangePassword(false)
    setNewPassword('')
  }

  if (!user) {
    return (
      <div className="account-container" style={{maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(30,41,59,0.08)'}}>
        <h2 style={{textAlign: 'center', color: '#1a237e'}}>Account Information</h2>
        <div style={{color: '#e53935', marginTop: '24px', textAlign: 'center'}}>
          Please <a href="/login" style={{color: '#ff9800', textDecoration: 'underline'}}>login</a> to view your account information.
        </div>
      </div>
    )
  }

  return (
    <div className="account-container" style={{maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(30,41,59,0.08)'}}>
      <h2 style={{textAlign: 'center', color: '#1a237e'}}>Account Information</h2>
      <div style={{textAlign: 'center', marginTop: '24px'}}>
        <span
          style={{
            display: 'inline-block',
            background: '#ff9800',
            color: '#fff',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            lineHeight: '48px',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}
        >
          {getInitial(user.email)}
        </span>
        <div style={{fontWeight: 'bold', color: '#1a237e', fontSize: '1.1rem', marginBottom: '8px'}}>
          {user.name}
        </div>
        <div style={{color: '#666', fontSize: '0.9rem', marginBottom: '16px'}}>
          {user.email}
        </div>
        {message && (
          <div style={{
            color: message.includes('successfully') ? '#1a237e' : '#e53935', 
            marginBottom: '12px',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: message.includes('successfully') ? '#e8f5e8' : '#ffebee'
          }}>
            {message}
          </div>
        )}
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <button
            style={{
              padding: '12px 24px', 
              background: '#ff9800', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            style={{
              padding: '12px 24px', 
              background: '#1a237e', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel Password Change' : 'Change Password'}
          </button>
        </div>
        {showChangePassword && (
          <form onSubmit={handleChangePassword} style={{marginTop: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              style={{
                padding: '10px', 
                borderRadius: 6, 
                border: '1px solid #bdbdbd', 
                width: '100%', 
                marginBottom: '12px',
                fontSize: '1rem'
              }}
              required
              minLength="6"
            />
            <button
              type="submit"
              style={{
                padding: '10px 24px', 
                background: '#4caf50', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 6, 
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Save New Password
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Account
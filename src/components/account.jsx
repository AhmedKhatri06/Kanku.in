import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Account = () => {
  const email = localStorage.getItem('userEmail')
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const getInitial = (email) => {
    if (!email) return ''
    return email.trim()[0].toUpperCase()
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
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

  if (!email) {
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
          {getInitial(email)}
        </span>
        <div style={{fontWeight: 'bold', color: '#1a237e', fontSize: '1.1rem', marginBottom: '12px'}}>
          {email}
        </div>
        {message && <div style={{color: '#e53935', marginBottom: '12px'}}>{message}</div>}
        <button
          style={{margin: '10px 0', padding: '10px 24px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'}}
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          style={{margin: '10px 0', padding: '10px 24px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'}}
          onClick={() => setShowChangePassword(!showChangePassword)}
        >
          Change Password
        </button>
        {showChangePassword && (
          <form onSubmit={handleChangePassword} style={{marginTop: '16px'}}>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New Password"
              style={{padding: '8px', borderRadius: 6, border: '1px solid #bdbdbd', width: '100%', marginBottom: '10px'}}
              required
            />
            <button
              type="submit"
              style={{padding: '10px 24px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'}}
            >
              Save Password
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Account
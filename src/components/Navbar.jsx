import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/logo.png'
import home from '../assets/home.png'
import product from '../assets/product.png'
import cart from '../assets/cart.png'
import contact from '../assets/contact.png'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  // Get user data from localStorage and update on route changes
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      setUser(null)
    }
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getInitial = (email) => {
    if (!email) return ''
    return email.trim()[0].toUpperCase()
  }

  const handleLogout = (e) => {
    e.preventDefault()
    e.stopPropagation()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setDropdownOpen(false)
    navigate('/login')
  }

  const toggleDropdown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownOpen(!dropdownOpen)
  }

  const handleAccountClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownOpen(false)
    navigate('/account')
  }

  return (
    <header>
      <nav className='container'> 
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <ul>
          <li>
            <Link to="/home">
              <img src={home} alt="Home" className="nav-icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/products">
              <img src={product} alt="Products" className="nav-icon" /> Products
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <img src={cart} alt="Cart" className="nav-icon" /> Cart
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <button className='btn'>
                <img src={contact} alt="Contact" className="nav-icon" />
                Contact Us
              </button>
            </Link>
          </li>
          <li>
  {user ? (
    <div className="user-dropdown" ref={dropdownRef}>
      <button
        className="account-btn"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          font: 'inherit',
          borderRadius: '6px',
          color: '#333'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: '#ff9800',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            lineHeight: '32px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {getInitial(user.email)}
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
          {user.name}
        </span>
      </button>
      
      {dropdownOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: '200px',
            zIndex: '1000'
          }}
        >
          <div 
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0'
            }}
            onClick={() => {
              setDropdownOpen(false);
              navigate('/account');
            }}
          >
            👤 Account Information
          </div>
          <div 
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              color: '#e53935',
              fontWeight: 'bold'
            }}
            onClick={handleLogout}
          >
            🚪 Logout
          </div>
        </div>
      )}
    </div>
  ) : (
    <Link to="/login" className="nav-login-btn">Login</Link>
  )}
</li>
        </ul>
      </nav>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
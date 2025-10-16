import React from 'react'
import { Link , useNavigate} from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/logo.png'
import home from '../assets/home.png'
import product from '../assets/product.png'
import cart from '../assets/cart.png'
import contact from '../assets/contact.png'
import homepg from '../components/home'
import accunt from './account.jsx'
import about from '../components/about.jsx'
const Navbar = () => {
  const email = localStorage.getItem('userEmail')
  const navigate = useNavigate()
  const getInitial = (email) => {
    if (!email) return ''
    return email.trim()[0].toUpperCase()
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
            <button className='btn'>
            {email ? (
              <button
                className="account-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  font: 'inherit',
                  borderRadius: '6px',
                  padding: '4px 8px'
                }}
                onClick={() => navigate('/account')} 
                title="Account Info"
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
                  {getInitial(email)}
                </span>
              </button>
            ) : (
              <Link to="/login" className="nav-login-btn">Login</Link>
            )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
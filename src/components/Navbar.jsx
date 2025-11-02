import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import home from "../assets/home.png";
import product from "../assets/product.png";
import cart from "../assets/cart.png";
import contact from "../assets/contact.png";
import AdminLogin from "./adminlogin";
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitial = (email) => {
    if (!email) return "";
    return email.trim()[0].toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="navbar-header">
      <nav className="nav-container">
        <div className="logo-container">
          <img src={logo} alt="Kanku.in Logo" className="logo" />
        </div>

        <ul className="nav-list">
          <li>
            <Link to="/home" className="nav-link">
              <img src={home} alt="Home" className="nav-icon" />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
          </li>

          <li>
            <Link to="/products" className="nav-link">
              <img src={product} alt="Products" className="nav-icon" />
              <span>Products</span>
            </Link>
          </li>

          <li>
            <Link to="/cart" className="nav-link">
              <img src={cart} alt="Cart" className="nav-icon" />
              <span>Cart</span>
            </Link>
          </li>

          <li>
            <Link to="/contact" className="nav-link ">
              <img src={contact} alt="Contact" className="nav-icon" />
              <span>Contact Us</span>
            </Link>
          </li>
          
          {user && user.isAdmin && (
            <li>
              <Link to="/admin/dashboard" className="nav-link">
                <span>Admin Panel</span>
              </Link>
            </li>
          )}
          {/* User Dropdown */}
          <li className="user-menu-item">
            {user ? (
              <div className="user-dropdown-container" ref={dropdownRef}>
                <button
                  className="user-toggle-btn"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="user-avatar">{getInitial(user.email)}</span>
                  <span className="user-name">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu" role="menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/account");
                      }}
                      role="menuitem"
                    >
                      👤 Account Information
                    </button>

                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

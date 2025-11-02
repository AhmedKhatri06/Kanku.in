// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminlogin.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation
    if (!formData.email || !formData.password || !formData.secretKey) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.email.split("@")[0], // Generate name from email
          email: formData.email,
          password: formData.password,
          secretKey: formData.secretKey,
        }),
      });

      const data = await response.json();

      console.log("API Response:", data); // Debug log

      if (data.success) {
        // Store data in localStorage (use same keys as regular login)
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...response.data.user,
            role: "admin", // Make sure this is set
            isAdmin: true, // And/or this
          })
        );
        console.log("Admin login successful, redirecting...");
        // Redirect to correct dashboard path
        navigate("/admin/dashboard");
      } 
      else {
        setError(
          data.message || "Admin registration failed. Check your secret key."
        );
      }
    }
    catch (error) {
      console.error("Admin login error:", error);
      setError(
        "Cannot connect to server. Make sure backend is running on port 5002."
      );
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>👑 Admin Portal</h1>
          <p>Access the administration dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="secretKey">Admin Secret Key</label>
            <input
              type="password"
              id="secretKey"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              required
              placeholder="Enter admin secret key"
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "🔄 Processing..." : "🔐 Access Admin Dashboard"}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            <Link to="/login">← Back to User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5002/login", {
        email,
        password,
      });

      if (response.data.success) {
        // ✅ CORRECT: Use the actual user data from backend response
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Use actual data

        setMessage("✅ Login successful! Redirecting...");

        setTimeout(() => {
          // Redirect to admin dashboard if user is admin
          if (response.data.user.isAdmin) {
            navigate("/admin/dashboard");
          } else {
            navigate("/home");
          }
          window.dispatchEvent(new Event("storage"));
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.code === "ECONNREFUSED"
      ) {
        setMessage(
          "❌ Cannot connect to server. Make sure backend is running on port 5001."
        );
      } else {
        setMessage("❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && (
          <div
            style={{
              color: message.includes("✅") ? "#1a237e" : "#e53935",
              marginBottom: "12px",
              textAlign: "center",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: message.includes("✅") ? "#e8f5e8" : "#ffebee",
              border: `1px solid ${message.includes("✅") ? "#4caf50" : "#f44336"}`,
            }}
          >
            {message}
          </div>
        )}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          disabled={loading}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="login-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;

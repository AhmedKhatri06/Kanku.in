import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminAnalytics from "./AdminAnalytics.jsx";
import AdminOrders from "./AdminOrders.jsx";
import AdminUsers from "./AdminUsers.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNavClick = (page) => {
    console.log(`🖱️ Clicked ${page} link`);
    console.log("Current user:", JSON.parse(localStorage.getItem("user")));
    console.log("isAdmin:", JSON.parse(localStorage.getItem("user")).isAdmin);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        navigate("/login");
        return;
      }

      console.log("🔄 Fetching real dashboard data from MongoDB...");

      // Fetch dashboard stats from backend API
      const response = await fetch("http://localhost:5002/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }

      if (data.success) {
        console.log("✅ Real-time dashboard data received:", data.dashboard);
        
        // Update stats with REAL data from MongoDB
        setStats({
          totalUsers: data.dashboard.totalUsers || 0,
          totalProducts: data.dashboard.totalProducts || 0,
          totalOrders: data.dashboard.totalOrders || 0,
          revenue: data.dashboard.totalRevenue || 0,
        });

        // Fetch recent orders from database
        await fetchRecentOrders(token);
      } else {
        throw new Error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("❌ Error fetching real dashboard data:", error);
      setError(error.message);
      
      // Fallback to mock data only if API fails
      console.log("🔄 Using fallback mock data...");
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async (token) => {
    try {
      const response = await fetch("http://localhost:5002/admin/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Get latest 4 orders from real database
        const recentOrdersFromDB = data.orders.slice(0, 4).map(order => ({
          id: order._id,
          customer: order.user?.name || "Customer",
          amount: order.totalAmount,
          status: order.orderStatus,
          date: new Date(order.createdAt).toLocaleDateString()
        }));
        
        setRecentOrders(recentOrdersFromDB);
      } else {
        // Fallback to mock orders if API fails
        setRecentOrders([
          {
            id: "ORD001",
            customer: "Sanjana Yadav",
            amount: 2499,
            status: "Delivered",
          },
          {
            id: "ORD002",
            customer: "Santosh",
            amount: 1899,
            status: "Processing",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const refreshData = () => {
    setLoading(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <button className="btn btn-logout" onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}>
              Logout
            </button>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>📊 Loading real-time data from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="btn-refresh" onClick={refreshData}>
             Refresh
          </button>
          
          <button
            className="btn btn-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error} - Showing demo data
        </div>
      )}

      {/* Navigation */}
      <nav className="admin-nav">
        <Link
          to="/admin/dashboard"
          className="nav-item active"
          onClick={() => handleNavClick("Dashboard")}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/admin/AdminUsers"
          className="nav-item"
          onClick={() => handleNavClick("Users")}
        >
          👥 User Management
        </Link>
        <Link
          to="/admin/AdminProducts"
          className="nav-item"
          onClick={() => handleNavClick("Products")}
        >
          🛍️ Product Management
        </Link>
        <Link
          to="/admin/AdminOrders"
          className="nav-item"
          onClick={() => handleNavClick("Orders")}
        >
          📦 Order Management
        </Link>
        <Link
          to="/admin/AdminAnalytics"
          className="nav-item"
          onClick={() => handleNavClick("Analytics")}
        >
          📈 Analytics
        </Link>
      </nav>

      {/* Stats Overview - NOW SHOWING REAL DATA */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.revenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="dashboard-content">
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <span className="data-source">
              {recentOrders.length > 0}
            </span>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.toString().slice(-6)}</td>
                    <td>{order.customer}</td>
                    <td>{formatCurrency(order.amount)}</td>
                    <td>
                      <span
                        className={`status-badge status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-view">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="no-orders">
                <br></br>
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/admin/products/new" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add New Product</h3>
              <p>Create new product listing</p>
            </Link>

            <Link to="/admin/AdminUsers" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Manage Users</h3>
              <p>View and manage users</p>
            </Link>

            <Link to="/admin/AdminAnalytics" className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Sales and performance reports</p>
            </Link>

            <Link to="/admin/AdminProducts" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Inventory</h3>
              <p>Stock management</p>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
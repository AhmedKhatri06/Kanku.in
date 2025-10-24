import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./AdminDashboard.css";
import  AdminAnalytics  from "./AdminAnalytics.jsx";
import  AdminOrders  from "./AdminOrders.jsx";
import  AdminUsers  from "./AdminUsers.jsx";
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
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
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 2,
        totalProducts: 11,
        totalOrders: 4,
        revenue: 7098,
      });

      setRecentOrders([
        {
          id: "ORD001",
          customer: "Sanjana Yadav",
          amount: 2499,
          status: "Delivered",
        },
        {
          id: "ORD002",
          customer: "Santosh ",
          amount: 1899,
          status: "Processing",
        },
        {
          id: "ORD003",
          customer: "Ruby Chauhan",
          amount: 4599,
          status: "Shipped",
        },
        {
          id: "ORD004",
          customer: "Suraj",
          amount: 5000,
          status: "Processing",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
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

      {/* Stats Overview */}
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
          <h2>Recent Orders</h2>
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
                    <td>{order.id}</td>
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

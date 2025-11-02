import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAnalytics.css";
import { adminAPI } from "../../utils/adminAPI";
import './loading.css'
const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchAnalytics();
  }, []);

  const checkAdminAccess = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/admin-login");
      return;
    }
    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      navigate("/home");
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getDashboard();
      setAnalytics(data.dashboard);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-analytics">
        <div className="admin-header">
          <h1>📊 Analytics Dashboard</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Failed to Load Analytics</h2>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <div className="admin-header">
        <h1>📊 Analytics Dashboard</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>

      {analytics && (
        <div className="analytics-container">
          <div className="charts-section">
            <h2>Sales Overview</h2>
            <div className="chart-placeholder">
              📈 Sales chart will be displayed here
            </div>
          </div>

          <div className="popular-products">
            <h2>Popular Products</h2>
            {analytics.popularProducts &&
            analytics.popularProducts.length > 0 ? (
              <div className="products-list">
                {analytics.popularProducts.map((item, index) => (
                  <div key={index} className="popular-product">
                    <span>{item.product?.name || "Unknown Product"}</span>
                    <span className="sold-count">{item.totalSold} sold</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No sales data available</p>
            )}
          </div>

          <div className="order-status-chart">
            <h2>Order Status Distribution</h2>
            {analytics.orderStatus && analytics.orderStatus.length > 0 ? (
              <div className="status-list">
                {analytics.orderStatus.map((status, index) => (
                  <div key={index} className="status-item">
                    <span className="status-name">{status._id}</span>
                    <span className="status-count">{status.count} orders</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No order data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
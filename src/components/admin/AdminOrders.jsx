import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";
import { adminAPI } from "../../utils/adminAPI";
import './loading.css'
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error updating order:", error);
      alert(`Failed to update order: ${error.message}`);
    }
  };

  const handleRetry = () => {
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders">
        <div className="admin-header">
          <h1>📦 Order Management</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Failed to Load Orders</h2>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>📦 Order Management</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="orders-container">
        <div className="orders-stats">
          <div className="stat">Total Orders: {orders.length}</div>
          <div className="stat">
            Pending: {orders.filter((o) => o.orderStatus === "pending").length}
          </div>
          <div className="stat">
            Completed:{" "}
            {orders.filter((o) => o.orderStatus === "delivered").length}
          </div>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p className="customer">
                    Customer: {order.user?.name || "Unknown"}
                  </p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-total">₹{order.totalAmount}</div>
              </div>

              <div className="order-status">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/adminAPI";
import './loading.css'
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error("Error updating user:", error);
      alert(`Failed to update user role: ${error.message}`);
    }
  };

  const handleRetry = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="admin-header">
          <h1>👥 User Management</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Failed to Load Users</h2>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>👥 User Management</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="users-container">
        <div className="users-stats">
          <div className="stat">Total Users: {users.length}</div>
          <div className="stat">
            Admins: {users.filter((u) => u.role === "admin").length}
          </div>
          <div className="stat">
            Customers: {users.filter((u) => u.role === "user").length}
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
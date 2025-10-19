// AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import './admin.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  })

  // Check if user is admin (in real app, verify with backend)
  const isAdmin = localStorage.getItem('user') && 
                  JSON.parse(localStorage.getItem('user')).email === 'admin@example.com'

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch stats
      const statsResponse = await fetch('http://localhost:5002/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const statsData = await statsResponse.json()
      if (statsData.success) setStats(statsData.stats)

      // Fetch users
      const usersResponse = await fetch('http://localhost:5002/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const usersData = await usersResponse.json()
      if (usersData.success) setUsers(usersData.users)

      // Fetch products
      const productsResponse = await fetch('http://localhost:5002/products')
      const productsData = await productsResponse.json()
      if (productsData.success) setProducts(productsData.products)

      // Fetch orders
      const ordersResponse = await fetch('http://localhost:5002/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const ordersData = await ordersResponse.json()
      if (ordersData.success) setOrders(ordersData.orders)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Load sample data for demo
      loadSampleData()
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    setStats({
      totalUsers: 150,
      totalProducts: 45,
      totalOrders: 289,
      totalRevenue: 125000,
      recentOrders: []
    })
    
    setUsers([
      { _id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-15' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-14' }
    ])
    
    setOrders([
      { _id: '1', totalAmount: 3499, status: 'delivered', createdAt: '2024-01-15' },
      { _id: '2', totalAmount: 1999, status: 'shipped', createdAt: '2024-01-14' }
    ])
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Product added successfully!')
        setNewProduct({
          name: '', description: '', price: '', category: '', image: '', stock: ''
        })
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Demo: Product would be added in real implementation')
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Demo: Order status would be updated in real implementation')
    }
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>🔒 Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading Admin Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your e-commerce store</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          🛍️ Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-number">{stats.totalUsers || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <div className="stat-number">{stats.totalProducts || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <div className="stat-number">{stats.totalOrders || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <div className="stat-number">₹{stats.totalRevenue || 0}</div>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span>📦 New order #ORD001 placed</span>
                <span>2 hours ago</span>
              </div>
              <div className="activity-item">
                <span>👤 New user registered</span>
                <span>4 hours ago</span>
              </div>
              <div className="activity-item">
                <span>🛍️ Product stock updated</span>
                <span>6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Manage Products</h3>
            <button 
              className="btn-primary"
              onClick={() => document.getElementById('addProductModal').style.display = 'block'}
            >
              + Add New Product
            </button>
          </div>

          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-info">
                        <img src={product.image} alt={product.name} width="40" />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>
                      <span className={`stock-badge ${product.stock < 10 ? 'low' : 'good'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="tab-content">
          <h3>Order Management</h3>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id}</td>
                    <td>{order.user?.name || 'Customer'}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`status-select status-${order.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-view">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="tab-content">
          <h3>User Management</h3>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{Math.floor(Math.random() * 10)}</td>
                    <td>
                      <button className="btn-view">View</button>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <div id="addProductModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => document.getElementById('addProductModal').style.display = 'none'}>&times;</span>
          <h3>Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              required
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              <option value="Dresses">Dresses</option>
              <option value="Kurtas">Kurtas</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Footwear">Footwear</option>
              <option value="Traditional">Traditional</option>
            </select>
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              required
            />
            <button type="submit" className="btn-primary">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
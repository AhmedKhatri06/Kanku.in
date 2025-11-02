const API_BASE = 'http://localhost:5002';

export const adminAPI = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    console.log('🔐 Token being sent:', token);
    console.log('📤 Making request to:', `${API_BASE}${endpoint}`);
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/admin-login';
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ Response data:', data);

      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error at ${endpoint}:`, error);
      throw error;
    }
  },

  // Specific methods for admin endpoints
  getDashboard() {
    return this.request('/admin/dashboard');
  },

  getUsers() {
    return this.request('/admin/users');
  },

  getOrders() {
    return this.request('/admin/orders');
  },

  getProducts() {
    return this.request('/admin/products');
  },

  updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  },

  updateOrderStatus(orderId, orderStatus) {
    return this.request(`/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus })
    });
  },

  createProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct(productId) {
    return this.request(`/admin/products/${productId}`, {
      method: 'DELETE'
    });
  }
};
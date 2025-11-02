import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";
import { adminAPI } from "../../utils/adminAPI";
import './loading.css'
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validCategories=[
    { value:"Saree",label:"Saree"},
    { value:"kurta",label:"kurta"},
    { value:"jewelry",label:"Jewelry"},
    { value:"footwear",label:"Footwear"},
    {value:"accesory",label:"Accesory"}
  ]
  useEffect(() => {
    checkAdminAccess();
    fetchProducts();
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
 const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, use a placeholder since we don't have cloud storage
      const imageUrl = "pr" + (Math.floor(Math.random() * 12) + 1); // pr1 to pr12
      setImagePreview(`/images/${imageUrl}.jpg`);
      
      setFormData({
        ...formData,
        image: imageUrl // Store just the image identifier
      });
    }
  };


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5002/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await adminAPI.deleteProduct(productId);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const handleRetry = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products">
        <div className="admin-header">
          <h1>🛍️ Product Management</h1>
          <div className="header-actions">
            <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
              ← Back to Dashboard
            </button>
          </div>
        </div>
        
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Failed to Load Products</h2>
          <p className="error-message">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>🛍️ Product Management</h1>
        <div className="header-actions">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
          <button
            className="add-product-btn"
            onClick={() => navigate("/admin/products/new")}
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="products-container">
        <div className="products-stats">
          <div className="stat">Total Products: {products.length}</div>
          <div className="stat">
            In Stock: {products.filter((p) => p.stock > 0).length}
          </div>
          <div className="stat">
            Out of Stock: {products.filter((p) => p.stock === 0).length}
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="image-placeholder">🛍️</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>
                <p className="product-stock">Stock: {product.stock}</p>
              </div>
              <div className="product-actions">
                <button className="edit-btn">Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
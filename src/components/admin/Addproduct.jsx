import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/adminAPI";
import './loading.css';
import './Addproduct.css'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      // For now, we'll just show the local preview
      setFormData({
        ...formData,
        image: imageUrl
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Send product data to backend
      await adminAPI.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: ""
      });
      setImagePreview("");
      
      // Hide success message and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/admin/AdminProducts");
      }, 2000);
      
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData({
      ...formData,
      image: ""
    });
  };

  const closeSuccessPopup = () => {
    setShowSuccess(false);
    navigate("/admin/AdminProducts");
  };

  return (
    <div className="admin-products">
      {/* Success Popup */}
      {showSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✅</div>
            <h3>Product Added Successfully!</h3>
            <p>Your product has been added to the database.</p>
            <button onClick={closeSuccessPopup} className="success-ok-btn">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="admin-header">
        <h1>➕ Add New Product</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/admin/AdminProducts")} className="back-btn">
            ← Back to Products
          </button>
        </div>
      </div>

      <div className="add-product-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button type="button" onClick={removeImage} className="remove-image-btn">
                  Remove
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="image-upload-section">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="upload-btn">
                📁 Upload Image
              </label>
              <span className="upload-hint">Click to upload product image</span>
            </div>

            {/* Or use URL input */}
            <div className="image-url-section">
              <label>Or enter image URL:</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/admin/AdminProducts")}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
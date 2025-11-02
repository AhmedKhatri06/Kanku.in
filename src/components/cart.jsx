import React, { useContext, useState } from 'react'
import './cart.css'
import { CartContext } from './cartcontext.jsx'
import './Products.css'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useContext(CartContext)
  const [addedId, setAddedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  // Get user data from localStorage directly
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  })

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }
    
    // Check if user is logged in
    if (!user || !token) {
      alert('Please login to proceed with checkout.')
      // Optional: redirect to login
      // window.location.href = '/login'
      return
    }
    
    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || ''
    }))
    
    setShowForm(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare order data for backend
      const orderData = {
        items: cart.map(item => ({
          productId: item.id, // This should be the MongoDB _id
          quantity: item.quantity
        })),
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      }

      console.log('Sending order data:', orderData)

      const response = await fetch('http://localhost:5001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`Order placed successfully! Order ID: ${data.order._id}`)
        
        // Show success message
        alert(`Order placed successfully!\nOrder ID: ${data.order._id}\nTotal: ₹${getTotal()}`)
        
        // Clear cart and form
        clearCart()
        setFormData({
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          paymentMethod: 'cod'
        })
        setShowForm(false)
      } else {
        setError(data.message || 'Failed to place order')
        alert(`Order failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Order error:', error)
      setError('Network error. Please try again.')
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setMessage('')
    setError('')
  }

  // Calculate total items in cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="cart-container">
      <h2>Your Cart {getTotalItems() > 0 && `(${getTotalItems()} items)`}</h2>
      
      {!user && (
        <div className="login-warning">
          Please <a href="/login">login</a> to save your cart and checkout.
        </div>
      )}

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p className="item-price">Price: ₹{item.price}</p>
                <p className="item-total">Total: ₹{item.price * item.quantity}</p>
                <div className="cart-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ₹{getTotal()}</strong>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <button className="close-popup" onClick={handleClose}>×</button>
            
            {(message || error) && (
              <div className={`order-message ${error ? 'error' : 'success'}`}>
                {message || error}
              </div>
            )}

            <form className="checkout-form" onSubmit={handleSubmit}>
              <h3>Shipping Details</h3>
              
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <textarea
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
              />

              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="payment-method">
                <h4>Payment Method</h4>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  Cash on Delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  Credit/Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                  />
                  UPI
                </label>
              </div>

              <div className="order-summary">
                <h4>Order Summary</h4>
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: ₹{getTotal()}</strong>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${getTotal()}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
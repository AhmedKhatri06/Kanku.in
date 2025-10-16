import React, { useContext, useState } from 'react'
import './cart.css'
import { CartContext } from './cartcontext.jsx'
import './Products.css'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext)
  const [addedId, setAddedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  })
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }
    setShowForm(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(
      `Order placed!\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nEmail: ${formData.email}\nTotal: ₹${getTotal()}`
    )
    setShowForm(false)
    setFormData({ name: '', phone: '', address: '', email: '' })
    // Optionally clear cart here
  }

  const handleClose = () => {
    setShowForm(false)
  }
  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 800) // Animation duration
  }


  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ₹{getTotal()}</strong>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <button className="close-popup" onClick={handleClose}>×</button>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h3>Enter Your Details</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
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
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button type="submit" className="place-order-btn">Place Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
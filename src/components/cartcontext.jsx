import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [cartAnimation, setCartAnimation] = useState(false)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev =>
      prev.some(item => item.id === product.id)
        ? prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }]
    )
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 600)
  }
  
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}
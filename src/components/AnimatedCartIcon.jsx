import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from './cartcontext'
import './AnimatedCartIcon.css'

const AnimatedCartIcon = () => {
  const { getTotalItems, cartAnimation } = useContext(CartContext)
  const [itemCount, setItemCount] = useState(0)
  const [isBouncing, setIsBouncing] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  const totalItems = getTotalItems()

  useEffect(() => {
    if (totalItems > itemCount) {
      // Item was added
      setIsBouncing(true)
      setPulseEffect(true)
      
      setTimeout(() => {
        setIsBouncing(false)
      }, 600)
      
      setTimeout(() => {
        setPulseEffect(false)
      }, 1200)
    }
    
    setItemCount(totalItems)
  }, [totalItems, itemCount])

  return (
    <div className="cart-icon-wrapper">
      <div className={`cart-icon ${isBouncing ? 'bounce' : ''} ${cartAnimation ? 'add-animation' : ''}`}>
        <svg 
          className="cart-svg"
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        
        {totalItems > 0 && (
          <span className={`cart-badge ${pulseEffect ? 'pulse' : ''}`}>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
        
        {/* Flying items animation */}
        <div className="flying-items">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flying-item" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnimatedCartIcon
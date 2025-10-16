//---------------------------------------------------//
import React, { useState, useContext } from 'react'
import './Products.css'
import pr1 from '../assets/dress1.jpeg'
import pr2 from '../assets/dress2.jpeg'
import pr3 from '../assets/dress3.jpeg'
import pr4 from '../assets/dress4.jpeg'
import pr5 from '../assets/dress5.png'
import pr6 from '../assets/dress6.png'
import pr7 from '../assets/kurta1.png'
import pr8 from '../assets/kurta2.png'
import pr9 from '../assets/shoes1.png'

import { CartContext } from './cartcontext'

const products = [
   {
    id: 1,
    name: "Handloom Saree",
    description: "Elegant handwoven saree with traditional motifs.",
    price: 2499,
    image: pr1,
    category: 'saree'
    
  },
  {
    id: 2,
    name: "Kurta Set",
    description: "Comfortable cotton kurta set for everyday wear.",
    price: 1299,
    image: pr2,
    category: 'kurta'
  },
  {
    id: 3,
    name: "Handcrafted Earrings",
    description: "Artisan-made earrings to complete your look.",
    price: 499,
    image: pr3,
    category: 'saree'
  },
  {
    id: 4,
    name: "Ethnic Dupatta",
    description: "Vibrant dupatta with intricate embroidery.",
    price: 799,
    image: pr4,
    category: 'saree'
  },
  {
    id: 5,
    name: "Silk Saree",
    description: "Luxurious silk saree with rich colors and designs.",
    price: 3999,
    image: pr5,
    category: 'saree'
  },
  {
    id: 6,
    name: "Kutchs soulful threads",
    description:"A Celebration of Culture in Couture.",
    price: 699,
    image: pr6,
    category: 'saree'
  },
  {
    id: 7,
    name: "Men's Embroidered Kurta Dhoti Set",
    description: "Traditional yet trendy, perfect for festive occasions.",
    price: 1899,
    image: pr7,
    category: 'kurta'
  },
  {
    id: 8,
    name: "Casual Cotton Kurta",
    description: "Lightweight and breathable, ideal for daily wear.",
    price: 1099,
    image: pr8,
    category: 'kurta'
  },
  {
    id: 9,
    name: "Handloom Saree",
    description: "Elegant handwoven saree with traditional motifs.",
    price: 2499,
    image: pr9,
    category: 'accessory'
    
  },
  {
    id: 10,
    name: "Handloom Saree",
    description: "Elegant handwoven saree with traditional motifs.",
    price: 2499,
    image: pr9,
    category: 'accessory'
    
  },
  {
    id: 11,
    name: "Handloom Saree",
    description: "Elegant handwoven saree with traditional motifs.",
    price: 2499,
    image: pr9,
    category: 'accessory'
    
  }
]

const Products = () => {
  const { addToCart } = useContext(CartContext)
  const [addedId, setAddedId] = useState(null)

  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 700) // Animation duration
  }

  return (
    <div className="products-container">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div
            className={`product-card${addedId === product.id ? ' added-animation' : ''}`}
            key={product.id}
          >
            <img src={product.image} alt={product.name} className="product-img" />
            <h3>{product.name}</h3>
            <p className="product-desc">{product.description}</p>
            <div className="product-footer">
              <span className="product-price">{product.price}</span>
              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                {addedId === product.id ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
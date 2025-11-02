import React, { useState, useContext } from 'react'
import './Products.css'
import pr1 from '../assets/dress1.jpeg'
import pr2 from '../assets/dress2.jpeg'
import pr3 from '../assets/dress3.jpeg'
import pr4 from '../assets/dress4.jpeg'
import pr5 from '../assets/dress5.png'
import pr6 from '../assets/dress6.png'
import pr7 from '../assets/jew1.jpg'
import pr8 from '../assets/jewl2.jpg'
import pr9 from '../assets/shoes1.png'
import pr10 from '../assets/kurta1.png'
import pr11 from '../assets/kurta2.png'
import { CartContext } from './cartcontext'
import SearchBar from './SearchBar' // Import SearchBar

const imageMap = {
  'pr1': pr1,
  'pr2': pr2,
  'pr3': pr3,
  'pr4': pr4,
  'pr5': pr5,
  'pr6': pr6,
  'pr7': pr7,
  'pr8': pr8,
  'pr9': pr9,
  'pr10': pr10,
  'pr11': pr11
};

// Sample products
const allProducts = [
    {
      _id: '1',
      name: 'Elegant Evening Dress',
      description: 'Beautiful floor-length evening gown perfect for special occasions',
      price: 3499,
      category: 'Dresses',
      image: 'pr1',
      stock: 8,
      rating: 4.5
    },
    {
      _id: '2',
      name: 'Summer Floral Dress',
      description: 'Light and comfortable floral print dress for summer',
      price: 1999,
      category: 'Dresses',
      image: 'pr2',
      stock: 15,
      rating: 4.2
    },
    {
      _id: '3',
      name: 'Casual Day Dress',
      description: 'Perfect for everyday wear with comfortable fabric',
      price: 1599,
      category: 'Dresses',
      image: 'pr3',
      stock: 12,
      rating: 4.3
    },
    {
      _id: '4',
      name: 'Party Wear Gown',
      description: 'Stylish party gown with elegant design',
      price: 4299,
      category: 'Dresses',
      image: 'pr4',
      stock: 5,
      rating: 4.7
    },
    {
      _id: '5',
      name: 'Designer Kurta',
      description: 'Traditional kurti with modern design',
      price: 1299,
      category: 'Kurtas',
      image: 'pr10',
      stock: 20,
      rating: 4.4
    },
    {
      _id: '6',
      name: 'Embroidered Kurta',
      description: 'Hand-embroidered kurta with intricate patterns',
      price: 1899,
      category: 'Kurtas',
      image: 'pr11',
      stock: 10,
      rating: 4.6
    },
    {
      _id: '7',
      name: 'Diamond Necklace',
      description: 'Beautiful diamond necklace for special occasions',
      price: 5999,
      category: 'Jewelry',
      image: 'pr7',
      stock: 7,
      rating: 4.8
    },
    {
      _id: '8',
      name: 'Gold Earrings',
      description: 'Elegant gold earrings with precious stones',
      price: 2999,
      category: 'Jewelry',
      image: 'pr8',
      stock: 12,
      rating: 4.5
    },
    {
      _id: '9',
      name: 'Payal',
      description: 'Traditional Indian anklet made of silver',
      price: 2499,
      category: 'Jewelry',
      image: 'pr9',
      stock: 25,
      rating: 4.1
    },
    {
      _id: '10',
      name: 'Designer Saree',
      description: 'Traditional silk saree with modern touch',
      price: 4599,
      category: 'Traditional',
      image: 'pr5',
      stock: 6,
      rating: 4.7
    },
    {
      _id: '11',
      name: 'Lehenga Choli',
      description: 'Traditional lehenga for festivals and weddings',
      price: 6999,
      category: 'Traditional',
      image: 'pr6',
      stock: 4,
      rating: 3.5
    }
];

const Products = () => {
  const { addToCart } = useContext(CartContext)
  const [addedId, setAddedId] = useState(null)
  const [products, setProducts] = useState(allProducts) // Use filtered products
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'newest'
  })

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term)
    filterProducts(term, filters)
  }

  // Handle filters
  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    filterProducts(searchTerm, newFilters)
  }

  // Filter products based on search and filters
  const filterProducts = (term, filterOptions) => {
    let filtered = allProducts

    // Search filter
    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      )
    }

    // Category filter
    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(product => product.category === filterOptions.category)
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filterOptions.priceRange[0] && 
      product.price <= filterOptions.priceRange[1]
    )

    // Sort products
    filtered = sortProducts(filtered, filterOptions.sortBy)

    setProducts(filtered)
  }

  // Sort products
  const sortProducts = (productsToSort, sortBy) => {
    const sorted = [...productsToSort]
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'newest':
      default:
        return sorted
    }
  }

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      id: product._id
    });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 700);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">⭐</span>);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">⭐</span>);
    }
    
    return stars;
  };

  return (
    <div className="products-container">
      <h2>Our Products</h2>
      
      {/* Search and Filter Bar */}
      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
      
     
      {/* Products Count }
      <div className="products-info">
        <p>Showing {products.length} of {allProducts.length} products</p>
        {(searchTerm || filters.category !== 'all') && (
          <div className="active-filters">
            {searchTerm && <span className="filter-tag">Search: "{searchTerm}"</span>}
            {filters.category !== 'all' && <span className="filter-tag">Category: {filters.category}</span>}
            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('')
                setFilters({ category: 'all', priceRange: [0, 10000], sortBy: 'newest' })
                setProducts(allProducts)
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
        
      {/* Products Grid */}
    
      {products.length === 0 ? (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          <button 
            className="reset-search"
            onClick={() => {
              setSearchTerm('')
              setFilters({ category: 'all', priceRange: [0, 10000], sortBy: 'newest' })
              setProducts(allProducts)
            }}
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div
              className={`product-card${addedId === product._id ? ' added-animation' : ''}`}
              key={product._id}
            >
              <div className="product-image-container">
                <img 
                  src={imageMap[product.image]} 
                  alt={product.name} 
                  className="product-img" 
                  onError={(e) => {
                    e.target.src = pr9;
                  }}
                />
              </div>
              
              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category-badge">{product.category}</p>
                <p className="product-desc">{product.description}</p>
                
                {product.rating && (
                  <div className="product-rating">
                    {renderStars(product.rating)}
                    <span className="rating-text">({product.rating})</span>
                  </div>
                )}
                
                <div className="product-footer">
                  <div className="price-section">
                    <span className="product-price">₹{product.price}</span>
                  </div>
                  <button
                    className={`add-cart-btn ${product.stock === 0 ? 'out-of-stock' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedId === product._id || product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 
                     addedId === product._id ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
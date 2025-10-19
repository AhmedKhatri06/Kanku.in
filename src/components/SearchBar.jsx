import React, { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('newest')

  const categories = ['all', 'Dresses', 'Kurtas', 'Jewelry', 'Footwear', 'Traditional']

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    onFilter({ category: e.target.value, priceRange, sortBy })
  }

  const handlePriceChange = (e) => {
    const newPriceRange = [0, parseInt(e.target.value)]
    setPriceRange(newPriceRange)
    onFilter({ category: selectedCategory, priceRange: newPriceRange, sortBy })
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    onFilter({ category: selectedCategory, priceRange, sortBy: e.target.value })
  }

  return (
    <div className="search-filter-container">
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Price: Up to ₹{priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
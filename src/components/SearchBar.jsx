import React, { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('newest')

  const categories = ['all', 'Dresses', 'Kurtas', 'Jewelry', 'Traditional']

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
    <div className="search-filter-container single-line">
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

      <div className="filter-group">
        <select value={selectedCategory} onChange={handleCategoryChange} className="compact-select">
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group price-filter">
        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <span className="price-value">₹{priceRange[1]}</span>
      </div>

      <div className="filter-group">
        <select value={sortBy} onChange={handleSortChange} className="compact-select">
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low</option>
          <option value="price-high">Price: High</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  )
}

export default SearchBar;
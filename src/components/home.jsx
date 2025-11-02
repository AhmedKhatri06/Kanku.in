import React from 'react'
import './home.css'
import Products from './Products.jsx'
const Home = () => {
  return (
    <div className="home-container">
      <h1 className="brand-title">Welcome to <span className="highlight">Kanku.in</span></h1>
      <p className="brand-tagline">
        "Wear Your Roots"
      </p>

      <section className="why-kanku card">
        <h2>🌿 Why <span className="highlight+">Kanku.in</span>?</h2>
        <ul>
          <li>
            <span className="icon ethnic">🤝</span>
            <strong>Ethnic & Fair</strong> – Supporting artisans and local communities
          </li>
          <li>
            <span className="icon sustainable">🌱</span>
            <strong>Sustainable</strong> – Eco-friendly fabrics & mindful production
          </li>
          <li>
            <span className="icon authentic">🎨</span>
            <strong>Authentic</strong> – Inspired by India’s rich textile heritage
          </li>
        </ul>
      </section>

      <section className="explore-collections card">
        <h2>✨ Explore Our Collections</h2>
        <div className="collections-grid">
          <a href="/products">
          <div 
            className="collection-item clickable"
            onClick={() => navigate('/products/saree')}
            style={{ cursor: 'pointer' }}
            title="View Kurta "
            >
            <span className="icon">🥻</span>
            <strong>Sarees </strong>
            <p>Grace redefined</p>
          </div>
          </a>
          <a href="/products">
          <div
            className="collection-item clickable"
            onClick={() => navigate('/products/saree')}
            style={{ cursor: 'pointer' }}
            title="View Kurta "
          >
            <span className="icon">👕</span>
            <strong>Kurta </strong>
            <p>Everyday elegance</p>
          </div>
          </a>
          <a href="/products">
          <div
            className="collection-item clickable"
            onClick={() => navigate('/products/saree')}
            style={{ cursor: 'pointer' }}
            title="View Kurta "
          >
            <span className="icon">💍</span>
            <strong>Accessories </strong>
            <p>Complete your look</p>
          </div>
          </a>
        </div>
      </section>

      <section className="our-promise card">
        <h2>❤️ Our Promise</h2>
        <p>
          Every purchase supports artisans, empowers communities, and celebrates India’s textile legacy.
        </p>
      </section>

      <a href="/products" className="shop-now-btn">👉 Shop Now</a>
    </div>
  )
}

export default Home
import React from 'react'
import './Hero.css'
import hero from '../../assets/hero.jpg'
import insta from '../../assets/insta.png'
import home from '../home.jsx'
import { Link } from 'react-router-dom'
const Hero = () => {
  return (
    <div>
    <div className='hero'>
      <div className="hero-text">
      <h1> Kanku.in</h1>
        <p>“Kanku.in is your destination for curated ethnic style and 
          timeless elegance. On our Instagram, we bring together 
          vibrant colours, artisanal craftsmanship, and modern 
          designs that celebrate tradition. Follow us to 
          explore daily inspirations — from handcrafted 
          ensembles and statement accessories to 
          behind‑the‑scenes moments and style tips. 
          Whether you're dressing for a special occasion 
          or elevating everyday looks, Kanku.in is 
          here to make you feel beautiful and confident.”
          <br></br>
          <br></br>

          <Link to="/home">
            <button className='btn'>
              Explore More
            </button>
          </Link>
        </p>
        <home/>
      </div>
    </div>
  </div>
  )
}
export default Hero;
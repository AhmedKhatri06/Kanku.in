import { useState } from 'react'
import './App.css'
import Login from './components/Login/login.jsx'
import Navbar from './components/Navbar.jsx'
import './components/Navbar.css'
import Hero from './components/Hero/Hero.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/home.jsx' 
import Register from './components/Login/register.jsx'
import Products from './components/Products.jsx'
import Cart from './components/cart.jsx'
import { CartProvider } from './components/cartcontext.jsx'
import Account from './components/account.jsx'
import About from './components/about.jsx' 
import Contact from './components/contact.jsx'
import SearchBar from './components/SearchBar.jsx'
function App() {

  return (
    <CartProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Products" element={<Products/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchBar />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  )
}

export default App
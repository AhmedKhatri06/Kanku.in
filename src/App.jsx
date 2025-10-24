import { useState } from "react";
import "./App.css";
import "./index.css";
import Login from "./components/Login/login.jsx";
import Navbar from "./components/Navbar.jsx";
import "./components/Navbar.css";
import Hero from "./components/Hero/Hero.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home.jsx";
import Register from "./components/Login/register.jsx";
import Products from "./components/Products.jsx";
import Cart from "./components/cart.jsx";
import { CartProvider } from "./components/cartcontext.jsx";
import Account from "./components/account.jsx";
import About from "./components/about.jsx";
import Contact from "./components/contact.jsx";
import SearchBar from "./components/SearchBar.jsx";

// Admin Pages
import AdminLogin from "./components/adminlogin.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import AdminAnalytics from "./components/admin/AdminAnalytics.jsx";
import AddProduct from "./components/admin/Addproduct.jsx";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <Navbar />
                <Products />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
              </>
            }
          />
          <Route
            path="/account"
            element={
              <>
                <Navbar />
                <Account />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <Navbar />
                <SearchBar />
              </>
            }
          />

          {/* Admin Login (No Navbar) */}
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* Admin Routes (No Main Navbar - They have their own navigation) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminUsers"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminProducts"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminOrders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminAnalytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

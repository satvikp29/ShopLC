import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-shop">Shop</span>
          <span className="brand-lc">LC</span>
        </Link>

        <div className="navbar-search">
          <form onSubmit={(e) => { e.preventDefault(); const q = e.target.q.value.trim(); if (q) navigate(`/products?keyword=${q}`); }}>
            <input name="q" type="text" placeholder="Search products..." className="search-input" />
            <button type="submit" className="search-btn">&#128269;</button>
          </form>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <span>&#128722;</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-menu-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
                )}
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
        </div>
      </div>

      <div className={`navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/products" onClick={() => setMenuOpen(false)}>All Products</Link>
        <Link to="/products?category=Electronics" onClick={() => setMenuOpen(false)}>Electronics</Link>
        <Link to="/products?category=Clothing" onClick={() => setMenuOpen(false)}>Clothing</Link>
        <Link to="/products?category=Home & Kitchen" onClick={() => setMenuOpen(false)}>Home & Kitchen</Link>
        <Link to="/products?category=Sports" onClick={() => setMenuOpen(false)}>Sports</Link>
      </div>

      <div className="navbar-categories">
        <div className="categories-container">
          {['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Jewelry'].map((cat) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="category-link">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

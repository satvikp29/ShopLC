import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured } from '../redux/slices/productSlice';
import ProductGrid from '../components/products/ProductGrid';

const CATEGORY_ICONS = {
  Electronics: '💻',
  Clothing: '👗',
  Footwear: '👟',
  'Home & Kitchen': '🏠',
  Books: '📚',
  Sports: '⚽',
  Beauty: '💄',
  Jewelry: '💎',
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="brand-highlight">ShopLC</span></h1>
          <p>Discover thousands of products at unbeatable prices. Shop electronics, fashion, home essentials and more.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-hero-primary">Shop Now</Link>
            <Link to="/products?sort=popular" className="btn-hero-outline">Trending Products</Link>
          </div>
        </div>
        <div className="hero-badges">
          <div className="hero-badge">
            <span>🚚</span>
            <p>Free Shipping over $75</p>
          </div>
          <div className="hero-badge">
            <span>🔒</span>
            <p>Secure Payments</p>
          </div>
          <div className="hero-badge">
            <span>↩️</span>
            <p>Easy Returns</p>
          </div>
          <div className="hero-badge">
            <span>⭐</span>
            <p>Top Rated Products</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/products" className="view-all-link">View All</Link>
        </div>
        <div className="categories-grid">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="category-card">
              <span className="category-icon">{icon}</span>
              <span className="category-name">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products?sort=popular" className="view-all-link">View All</Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>Special Offer</h2>
          <p>Get up to 40% off on Electronics this week!</p>
          <Link to="/products?category=Electronics&sort=price-asc" className="btn-promo">Shop Electronics</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

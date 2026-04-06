import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="brand-shop">Shop</span>
              <span className="brand-lc">LC</span>
            </Link>
            <p>Your one-stop destination for quality products at great prices. Shop with confidence.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">t</a>
              <a href="#" aria-label="Instagram">in</a>
              <a href="#" aria-label="YouTube">yt</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Clothing">Clothing</Link></li>
              <li><Link to="/products?category=Footwear">Footwear</Link></li>
              <li><Link to="/products?category=Home & Kitchen">Home & Kitchen</Link></li>
              <li><Link to="/products?category=Sports">Sports</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Returns & Refunds</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopLC. All rights reserved.</p>
          <div className="payment-icons">
            <span className="payment-badge">Stripe</span>
            <span className="payment-badge">Razorpay</span>
            <span className="payment-badge">Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

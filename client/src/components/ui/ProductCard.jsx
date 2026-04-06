import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const effectivePrice = product.discountPrice || product.price;
  const discount = getDiscountPercent(product.price, product.discountPrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.slug || product._id}`} className="product-card-link">
        <div className="product-card-image">
          <img
            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.images?.[0]?.alt || product.name}
            loading="lazy"
          />
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
        </div>

        <div className="product-card-body">
          <p className="product-brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>

          <StarRating rating={product.rating} numReviews={product.numReviews} size="sm" />

          <div className="product-price">
            <span className="price-current">{formatPrice(effectivePrice)}</span>
            {discount > 0 && (
              <span className="price-original">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="low-stock">Only {product.stock} left!</p>
          )}
        </div>
      </Link>

      <button
        className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;

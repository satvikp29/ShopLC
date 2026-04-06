import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const effectivePrice = item.discountPrice || item.price;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.images?.[0]?.url || '/placeholder-product.jpg'} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <Link to={`/products/${item.slug || item._id}`} className="cart-item-name">{item.name}</Link>
        <p className="cart-item-brand">{item.brand}</p>
        <p className="cart-item-price">{formatPrice(effectivePrice)}</p>
      </div>

      <div className="cart-item-quantity">
        <button
          className="qty-btn"
          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>

      <div className="cart-item-subtotal">
        <p>{formatPrice(effectivePrice * item.quantity)}</p>
      </div>

      <button
        className="cart-item-remove"
        onClick={() => dispatch(removeFromCart(item._id))}
        aria-label="Remove item"
      >
        &#10005;
      </button>
    </div>
  );
};

export default CartItem;

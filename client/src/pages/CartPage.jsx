import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import CartItem from '../components/ui/CartItem';
import OrderSummary from '../components/checkout/OrderSummary';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totals } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="cart-actions">
            <Link to="/products" className="btn-outline">Continue Shopping</Link>
            <button className="btn-danger-outline" onClick={() => dispatch(clearCart())}>
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-summary-section">
          <OrderSummary items={items} totals={totals} />
          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

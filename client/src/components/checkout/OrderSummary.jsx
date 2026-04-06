import React from 'react';
import { formatPrice } from '../../utils/helpers';

const OrderSummary = ({ items, totals }) => {
  return (
    <div className="order-summary">
      <h3>Order Summary</h3>

      <div className="order-summary-items">
        {items.map((item) => (
          <div key={item._id} className="summary-item">
            <div className="summary-item-info">
              <img
                src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={item.name}
                className="summary-item-image"
              />
              <span className="summary-item-name">{item.name}</span>
            </div>
            <span className="summary-item-qty">x{item.quantity}</span>
            <span className="summary-item-price">
              {formatPrice((item.discountPrice || item.price) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="order-summary-totals">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(totals.itemsPrice)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>{totals.shippingPrice === 0 ? 'Free' : formatPrice(totals.shippingPrice)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (18% GST)</span>
          <span>{formatPrice(totals.taxPrice)}</span>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span>{formatPrice(totals.totalPrice)}</span>
        </div>
      </div>

      {totals.shippingPrice === 0 && (
        <p className="free-shipping-notice">&#10003; You qualify for free shipping!</p>
      )}
    </div>
  );
};

export default OrderSummary;

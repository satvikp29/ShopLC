import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder, cancelOrder } from '../redux/slices/orderSlice';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { currentOrder: order, loading, error } = useSelector((state) => state.orders);
  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);

  if (loading) return <Loader fullPage />;
  if (error) return <Alert type="error" message={error} />;
  if (!order) return null;

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder({ id: order._id, reason: 'Cancelled by customer' }));
    }
  };

  return (
    <div className="order-detail-page">
      {isSuccess && (
        <Alert type="success" message="Your order has been placed successfully! Thank you for shopping with ShopLC." />
      )}

      <div className="order-detail-header">
        <div>
          <h1>Order #{order.orderNumber}</h1>
          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="order-status-badge-lg" style={{ backgroundColor: getOrderStatusColor(order.status) }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-main">
          <div className="order-section">
            <h2>Items Ordered</h2>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <img src={item.image || '/placeholder-product.jpg'} alt={item.name} />
                <div className="order-item-info">
                  <p className="order-item-name">{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p className="order-item-price">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="order-section">
            <h2>Shipping Address</h2>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          {order.statusHistory?.length > 0 && (
            <div className="order-section">
              <h2>Order Timeline</h2>
              <div className="order-timeline">
                {order.statusHistory.map((entry, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot" style={{ backgroundColor: getOrderStatusColor(entry.status) }} />
                    <div className="timeline-content">
                      <p className="timeline-status">{entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</p>
                      {entry.note && <p className="timeline-note">{entry.note}</p>}
                      <p className="timeline-date">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="order-detail-sidebar">
          <div className="order-section">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span></div>
            <div className="summary-row"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
            <div className="summary-row total-row"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
          </div>

          <div className="order-section">
            <h2>Payment</h2>
            <p>Method: {order.paymentMethod}</p>
            <p>Status: <span className={order.isPaid ? 'paid-text' : 'unpaid-text'}>{order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not Paid'}</span></p>
          </div>

          {['pending', 'processing'].includes(order.status) && (
            <button className="btn-cancel-order" onClick={handleCancel}>Cancel Order</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

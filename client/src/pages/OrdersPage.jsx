import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <Loader fullPage />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="order-number">Order #{order.orderNumber}</p>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status-badge" style={{ backgroundColor: getOrderStatusColor(order.status) }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="order-item-preview">
                    <img src={item.image || '/placeholder-product.jpg'} alt={item.name} />
                    <span>{item.name} x{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="more-items">+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className="order-card-footer">
                <div className="order-totals">
                  <p>Total: <strong>{formatPrice(order.totalPrice)}</strong></p>
                  <p>Payment: <span className={order.isPaid ? 'paid-badge' : 'pending-badge'}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span></p>
                </div>
                <Link to={`/orders/${order._id}`} className="btn-view-order">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

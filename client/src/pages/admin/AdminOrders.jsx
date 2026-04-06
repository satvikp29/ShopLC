import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/ui/Loader';
import Alert from '../../components/ui/Alert';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, total, pages } = useSelector((state) => state.orders);
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders({ page: currentPage, limit: 20, status: filterStatus || undefined }));
  }, [dispatch, currentPage, filterStatus]);

  const handleStatusChange = async (orderId, status) => {
    const result = await dispatch(updateOrderStatus({ id: orderId, data: { status } }));
    if (updateOrderStatus.fulfilled.match(result)) setSuccess('Order status updated');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-page-header">
          <h1>Orders ({total})</h1>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="form-input filter-select-sm">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
        {error && <Alert type="error" message={error} />}

        {loading ? <Loader /> : (
          <table className="admin-table">
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Date</th><th>Total</th><th>Paid</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><Link to={`/orders/${order._id}`}>{order.orderNumber}</Link></td>
                  <td>{order.user?.name || 'N/A'}<br /><small>{order.user?.email}</small></td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatPrice(order.totalPrice)}</td>
                  <td>{order.isPaid ? <span className="paid-chip">Paid</span> : <span className="unpaid-chip">Unpaid</span>}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="status-select"
                      style={{ borderColor: getOrderStatusColor(order.status) }}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td><Link to={`/orders/${order._id}`} className="btn-view-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

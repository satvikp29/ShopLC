import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchAllOrders } from '../../redux/slices/orderSlice';
import { userAPI } from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/ui/Loader';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: products, total: totalProducts } = useSelector((state) => state.products);
  const { orders, total: totalOrders } = useSelector((state) => state.orders);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        dispatch(fetchProducts({ limit: 5 })),
        dispatch(fetchAllOrders({ limit: 5 })),
        userAPI.getAllUsers({ limit: 1 }).then((r) => setTotalUsers(r.data.total)).catch(() => {}),
      ]);
      setLoading(false);
    };
    load();
  }, [dispatch]);

  const totalRevenue = orders.reduce((acc, o) => (o.isPaid ? acc + o.totalPrice : acc), 0);

  if (loading) return <div className="admin-layout"><AdminSidebar /><Loader fullPage /></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{formatPrice(totalRevenue)}</h3>
              <p>Revenue</p>
            </div>
          </div>
        </div>

        <div className="admin-tables-grid">
          <div className="admin-table-section">
            <div className="table-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders">View All</Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Order #</th><th>Total</th><th>Status</th><th>Paid</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id}>
                    <td><Link to={`/orders/${order._id}`}>{order.orderNumber}</Link></td>
                    <td>{formatPrice(order.totalPrice)}</td>
                    <td><span className={`status-chip status-${order.status}`}>{order.status}</span></td>
                    <td>{order.isPaid ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-table-section">
            <div className="table-header">
              <h2>Recent Products</h2>
              <Link to="/admin/products">View All</Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th></tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product._id}>
                    <td>{product.name.slice(0, 30)}...</td>
                    <td>{formatPrice(product.price)}</td>
                    <td className={product.stock < 5 ? 'low-stock-cell' : ''}>{product.stock}</td>
                    <td>{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

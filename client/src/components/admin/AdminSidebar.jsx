import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h3>Admin Panel</h3>
      <nav className="admin-nav">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
          &#128202; Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
          &#128722; Products
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
          &#128203; Orders
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
          &#128101; Users
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

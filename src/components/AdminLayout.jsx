import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/investments">Investments</Link>
          <Link to="/admin/withdrawals">Withdrawals</Link>
          <Link to="/admin/packages">Packages</Link>
          <Link to="/admin/payments">Pending Payments</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
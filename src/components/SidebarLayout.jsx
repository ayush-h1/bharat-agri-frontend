import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function SidebarLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="mobile-logo">
          <h2>Bharat Agri Network</h2>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Bharat Agri Network</h2>
          <p className="sidebar-user">Welcome, {user?.name}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          <Link to="/invest" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-leaf"></i> Invest
          </Link>
          <Link to="/my-investments" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-chart-line"></i> My Investments
          </Link>
          <Link to="/transactions" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-exchange-alt"></i> Transactions
          </Link>
          <Link to="/referrals" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-users"></i> Referrals
          </Link>
          <Link to="/leaderboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-trophy"></i> Leaderboard
          </Link>
          <Link to="/withdraw" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-money-bill-wave"></i> Withdraw
          </Link>
          <Link to="/profile" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-user"></i> Profile
          </Link>
          <Link to="/settings" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-cog"></i> Settings
          </Link>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
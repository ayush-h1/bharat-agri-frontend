import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="global-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="header-logo">
            <h2>Bharat Agri Network</h2>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          {user ? (
            <button onClick={handleLogout} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
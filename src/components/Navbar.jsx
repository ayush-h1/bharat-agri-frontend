import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h1>Bharat Agri Network</h1>
          </Link>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          {!user && (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    pendingWithdrawals: 0,
    pendingPayments: 0,
    totalInvested: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => ({})),
      // if you have separate endpoints, adjust
    ])
      .then(([statsData]) => {
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Investments</h3>
          <p>{stats.totalInvestments}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Withdrawals</h3>
          <p>{stats.pendingWithdrawals}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p>{stats.pendingPayments}</p>
        </div>
        <div className="stat-card">
          <h3>Total Invested</h3>
          <p>₹{stats.totalInvested}</p>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import LiveInvestment from '../components/LiveInvestment';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: 'Mon', earnings: 2400 },
  { name: 'Tue', earnings: 1398 },
  { name: 'Wed', earnings: 9800 },
  { name: 'Thu', earnings: 3908 },
  { name: 'Fri', earnings: 4800 },
  { name: 'Sat', earnings: 3800 },
  { name: 'Sun', earnings: 4300 },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/investments/user')
      .then(data => {
        setInvestments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load investments');
        setLoading(false);
      });
  }, []);

  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalAccrued = activeInvestments.reduce((sum, inv) => sum + (inv.accruedReturns || 0), 0);
  const lockedBalance = activeInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  // Total earnings = realized (user.totalEarned) + unrealized (accrued)
  const totalEarnings = (user?.totalEarned || 0) + totalAccrued;

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-info">
          <h2>Welcome back, {user?.name}!</h2>
          <p className="text-muted">{user?.email}</p>
          <Link to="/profile" className="btn btn-outline">View Profile</Link>
        </div>
        <div className="welcome-stats">
          <div className="stat-item">
            <span className="stat-label">Member since</span>
            <span className="stat-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Available Balance</h3>
          <div className="stat-number">₹{user?.walletBalance?.toFixed(2) || 0}</div>
          <span className="stat-change neutral">Ready to invest</span>
        </div>
        <div className="stat-card">
          <h3>Locked Balance</h3>
          <div className="stat-number">₹{lockedBalance.toFixed(2)}</div>
          <span className="stat-change neutral">In active investments</span>
        </div>
        <div className="stat-card">
          <h3>Total Invested</h3>
          <div className="stat-number">₹{totalInvested.toFixed(2)}</div>
          <span className="stat-change positive">All time</span>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <div className="stat-number">₹{totalEarnings.toFixed(2)}</div>
          <span className="stat-change positive">Lifetime returns</span>
        </div>
      </div>

      {/* Chart and Recent Investments */}
      <div className="dashboard-row">
        <div className="chart-card">
          <h3>Earnings Overview (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#1b5e20" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="recent-card">
          <h3>Recent Investments</h3>
          {investments.length === 0 ? (
            <p>No investments yet. <Link to="/invest">Invest now</Link></p>
          ) : (
            <>
              <ul className="recent-list">
                {investments.slice(0, 5).map(inv => (
                  <li key={inv._id}>
                    <span className="recent-sector">{inv.sector}</span>
                    <span className="recent-amount">₹{inv.amount?.toFixed(2)}</span>
                    <span className={`badge ${inv.status}`}>{inv.status}</span>
                  </li>
                ))}
              </ul>
              <Link to="/my-investments" className="btn-link">View all investments →</Link>
            </>
          )}
        </div>
      </div>

      {/* Live Active Investments */}
      {activeInvestments.length > 0 && (
        <div className="live-section">
          <h3>Active Investments (Live Returns)</h3>
          <div className="investments-grid">
            {activeInvestments.map(inv => (
              <LiveInvestment key={inv._id} investment={inv} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/invest" className="action-card">
            <i className="fas fa-plus-circle"></i>
            <span>New Investment</span>
          </Link>
          <Link to="/topup" className="action-card">
            <i className="fas fa-wallet"></i>
            <span>Add Funds</span>
          </Link>
          <Link to="/referrals" className="action-card">
            <i className="fas fa-users"></i>
            <span>Refer a Friend</span>
          </Link>
          <Link to="/withdraw" className="action-card">
            <i className="fas fa-money-bill-wave"></i>
            <span>Withdraw</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

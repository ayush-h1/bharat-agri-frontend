import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [investments, setInvestments] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get('/investments/user'),
      api.get('/referrals/stats')
    ]).then(([investData, refData]) => {
      setInvestments(investData);
      setReferralStats(refData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user]);

  if (!user) return <div className="loading">Loading profile...</div>;
  if (loading) return <div className="loading">Loading your data...</div>;

  const activeInvestments = investments.filter(inv => inv.status === 'active').length;
  const completedInvestments = investments.filter(inv => inv.status === 'completed').length;
  const totalReferrals = referralStats?.totalReferrals || 0;
  const activeReferrals = referralStats?.activeReferrals || 0;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-meta">
            <span>📞 {user.phone || 'Not Provided'}</span>
            <span>📅 Member since: {new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Investment Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="card-label">Active Investments</span>
          <span className="card-value">{activeInvestments}</span>
        </div>
        <div className="summary-card">
          <span className="card-label">Completed Investments</span>
          <span className="card-value">{completedInvestments}</span>
        </div>
        <div className="summary-card">
          <span className="card-label">Total Referrals</span>
          <span className="card-value">{totalReferrals}</span>
        </div>
        <div className="summary-card">
          <span className="card-label">Active Referrals</span>
          <span className="card-value">{activeReferrals}</span>
        </div>
      </div>

      // ===== Bank Details Section =====
<div className="profile-section">
  <h3>Withdrawal Details</h3>
  <div className="bank-details-form">
    <div className="form-group">
      <label>UPI ID</label>
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="e.g., username@okhdfcbank"
      />
    </div>
    <div className="form-group">
      <label>Account Holder Name</label>
      <input
        type="text"
        value={accountHolder}
        onChange={(e) => setAccountHolder(e.target.value)}
        placeholder="As per bank records"
      />
    </div>
    <button className="btn btn-primary" onClick={saveBankDetails}>
      Save Withdrawal Details
    </button>
    {bankSaveMessage && <div className="success">{bankSaveMessage}</div>}
  </div>
</div>
      {/* Recent Investments Table */}
      <div className="recent-section">
        <h3>Recent Investments</h3>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {investments.slice(0, 5).map(inv => (
              <tr key={inv._id}>
                <td>{inv.sector}</td>
                <td>₹{inv.amount.toLocaleString('en-IN')}</td>
                <td><span className={`badge ${inv.status}`}>{inv.status}</span></td>
              </tr>
            ))}
            {investments.length === 0 && (
              <tr>
                <td colSpan="3" className="no-data">No investments yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <Link to="/invest" className="btn btn-primary">Make New Investment</Link>
        <Link to="/withdraw" className="btn btn-outline">Withdraw Funds</Link>
      </div>
    </div>
  );
}

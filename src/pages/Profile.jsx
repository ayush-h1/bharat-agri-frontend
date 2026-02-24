import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bank details state
  const [upiId, setUpiId] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankSaveMessage, setBankSaveMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch investments
    api.get('/investments/user')
      .then(data => {
        setInvestments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch existing bank details
    api.get('/user/bank-details')
      .then(data => {
        if (data) {
          setUpiId(data.upiId || '');
          setAccountHolder(data.accountHolder || '');
        }
      })
      .catch(console.error);
  }, [user]);

  const saveBankDetails = async () => {
    try {
      await api.post('/user/bank-details', { upiId, accountHolder });
      setBankSaveMessage('Withdrawal details saved successfully!');
      setTimeout(() => setBankSaveMessage(''), 3000);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;
  if (loading) return <div className="loading">Loading your data...</div>;

  const activeCount = investments.filter(inv => inv.status === 'active').length;
  const completedCount = investments.filter(inv => inv.status === 'completed').length;
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalEarned = investments.reduce((sum, inv) => sum + (inv.totalPaid || 0), 0);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{user.name.charAt(0)}</div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-meta">
            <span>📞 {user.phone || 'Not provided'}</span>
            <span>📅 Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="card-label">Active Investments</span>
          <span className="card-value">{activeCount}</span>
        </div>
        <div className="summary-card">
          <span className="card-label">Completed</span>
          <span className="card-value">{completedCount}</span>
        </div>
        <div className="summary-card">
          <span className="card-label">Total Invested</span>
          <span className="card-value">₹{totalInvested.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="card-label">Total Earned</span>
          <span className="card-value">₹{totalEarned.toFixed(2)}</span>
        </div>
      </div>

      {/* Bank Details Section */}
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
                <td>₹{inv.amount?.toFixed(2)}</td>
                <td><span className={`badge ${inv.status}`}>{inv.status}</span></td>
              </tr>
            ))}
            {investments.length === 0 && (
              <tr><td colSpan="3" className="no-data">No investments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="profile-actions">
        <Link to="/invest" className="btn btn-primary">Make New Investment</Link>
        <Link to="/withdraw" className="btn btn-outline">Withdraw Funds</Link>
      </div>
    </div>
  );
}

// src/pages/Wallet.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Wallet() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  useEffect(() => {
    api.get('/transactions/user')
      .then(data => {
        setTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const totalDeposited = transactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalWithdrawn = transactions
    .filter(tx => tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalEarned = transactions
    .filter(tx => tx.type === 'return' || tx.type === 'referral_bonus')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="wallet-container">
      {/* Header */}
      <div className="wallet-header">
        <h2>My Wallet</h2>
        <button className="btn-copy" onClick={() => navigator.clipboard.writeText(user?._id)}>
          <i className="fas fa-copy"></i> Copy Wallet ID
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="balance-card">
        <div className="balance-info">
          <span className="balance-label">Total Balance</span>
          <div className="balance-amount">
            <span className="currency">$</span>
            <span className="amount">{user?.walletBalance?.toFixed(2) || '0.00'}</span>
          </div>
          <span className="balance-sub">Available for withdrawal</span>
        </div>
        <div className="balance-actions">
          <button className="btn-deposit" onClick={() => setShowFundModal(true)}>
            <i className="fas fa-plus-circle"></i> Deposit
          </button>
          <Link to="/withdraw" className="btn-withdraw">
            <i className="fas fa-arrow-up"></i> Withdraw
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="wallet-stats">
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-label">Total Deposited</span>
            <span className="stat-value">${totalDeposited.toFixed(2)}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📤</span>
          <div className="stat-info">
            <span className="stat-label">Total Withdrawn</span>
            <span className="stat-value">${totalWithdrawn.toFixed(2)}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📈</span>
          <div className="stat-info">
            <span className="stat-label">Total Earned</span>
            <span className="stat-value">${totalEarned.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="transaction-section">
        <div className="section-header">
          <h3>Transaction History</h3>
          <div className="filter-tabs">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All
            </button>
            <button className={`filter-btn ${filter === 'deposit' ? 'active' : ''}`} onClick={() => setFilter('deposit')}>
              Deposits
            </button>
            <button className={`filter-btn ${filter === 'withdrawal' ? 'active' : ''}`} onClick={() => setFilter('withdrawal')}>
              Withdrawals
            </button>
            <button className={`filter-btn ${filter === 'return' ? 'active' : ''}`} onClick={() => setFilter('return')}>
              Earnings
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-receipt"></i>
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transaction-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 10).map(tx => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`tx-badge ${tx.type}`}>
                        {tx.type === 'deposit' ? 'Deposit' : 
                         tx.type === 'withdrawal' ? 'Withdrawal' : 
                         tx.type === 'return' ? 'Earnings' : 
                         tx.type === 'referral_bonus' ? 'Referral' : tx.type}
                      </span>
                    </td>
                    <td className={tx.type === 'deposit' || tx.type === 'return' ? 'positive' : 'negative'}>
                      {tx.type === 'deposit' || tx.type === 'return' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td><span className="status-badge completed">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showFundModal && (
        <div className="modal-overlay" onClick={() => setShowFundModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Funds</h3>
            <div className="form-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="Enter amount"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowFundModal(false)}>Cancel</button>
              <button 
                className="btn-confirm" 
                onClick={() => {
                  if (fundAmount && parseFloat(fundAmount) > 0) {
                    window.location.href = `/payment?amount=${fundAmount}`;
                  }
                }}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Wallet() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
    if (filter === 'deposit') return tx.type === 'deposit';
    if (filter === 'withdrawal') return tx.type === 'withdrawal';
    if (filter === 'earning') return tx.type === 'return' || tx.type === 'referral_bonus';
    return true;
  });

  const totalDeposited = transactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalWithdrawn = transactions
    .filter(tx => tx.type === 'withdrawal' && tx.status === 'approved')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalEarned = transactions
    .filter(tx => tx.type === 'return' || tx.type === 'referral_bonus')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      window.location.href = `/payment?amount=${depositAmount}`;
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount && parseFloat(withdrawAmount) > 0) {
      window.location.href = `/withdraw?amount=${withdrawAmount}`;
    }
  };

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
          <button className="btn-deposit" onClick={() => setShowDepositModal(true)}>
            <i className="fas fa-plus-circle"></i> Deposit
          </button>
          <button className="btn-withdraw" onClick={() => setShowWithdrawModal(true)}>
            <i className="fas fa-arrow-up"></i> Withdraw
          </button>
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
            <button className={`filter-btn ${filter === 'earning' ? 'active' : ''}`} onClick={() => setFilter('earning')}>
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
                {filteredTransactions.slice(0, 20).map(tx => (
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
      {showDepositModal && (
        <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Deposit Funds</h3>
            <div className="form-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                min="10"
                step="10"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDepositModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleDeposit}>Continue to Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Withdraw Funds</h3>
            <div className="form-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                min="50"
                step="10"
                autoFocus
              />
              <small>Minimum withdrawal: $50</small>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowWithdrawModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleWithdraw}>Proceed to Withdraw</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

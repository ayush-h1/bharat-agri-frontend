import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function MyInvestments() {
  const [investments, setInvestments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/investments/user')
      .then(data => {
        setInvestments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredInvestments = investments.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  if (loading) return <div className="loading">Loading your farms...</div>;

  return (
    <div className="my-investments-container">
      <div className="page-header">
        <h2>My Farms</h2>
        <p>Track all your deployed capital and returns</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs premium-tabs">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Farms
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {filteredInvestments.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-seedling"></i>
          <p>No farms found. Start your first investment!</p>
          <a href="/invest" className="btn btn-primary">Deploy Capital</a>
        </div>
      ) : (
        <div className="farms-grid">
          {filteredInvestments.map(inv => (
            <div key={inv._id} className="farm-card">
              <div className="farm-header">
                <div className="farm-icon">
                  {inv.sector === 'Fish' && <i className="fas fa-fish"></i>}
                  {inv.sector === 'Bee' && <i className="fas fa-bug"></i>}
                  {inv.sector === 'Poultry' && <i className="fas fa-drumstick-bite"></i>}
                  {inv.sector === 'Dairy' && <i className="fas fa-cow"></i>}
                </div>
                <div className="farm-title">
                  <h3>{inv.sector} Farm</h3>
                  <span className={`status-badge ${inv.status}`}>{inv.status}</span>
                </div>
              </div>

              <div className="farm-details">
                <div className="detail-item">
                  <span className="label">Invested Amount</span>
                  <span className="value">${inv.amount?.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Daily Return</span>
                  <span className="value">${inv.dailyReturn?.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Accrued Returns</span>
                  <span className="value highlight">${(inv.accruedReturns || 0).toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Start Date</span>
                  <span className="value">{new Date(inv.startDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">End Date</span>
                  <span className="value">{new Date(inv.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {inv.status === 'active' && (
                <div className="farm-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(100, (inv.accruedReturns / inv.amount) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span>{((inv.accruedReturns / inv.amount) * 100).toFixed(1)}% of principal</span>
                    <span>Target: ${inv.amount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

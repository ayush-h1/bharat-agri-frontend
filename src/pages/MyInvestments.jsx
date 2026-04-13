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

  // Helper to get icon based on sector
  const getIcon = (sector) => {
    switch(sector) {
      case 'Fish': return '🐟';
      case 'Bee': return '🐝';
      case 'Poultry': return '🐔';
      case 'Dairy': return '🐄';
      default: return '🌾';
    }
  };

  if (loading) return <div className="loading">Loading your farms...</div>;

  return (
    <div className="my-farms-container">
      <div className="farms-header">
        <h2>🌾 My Farms</h2>
        <div className="filter-chips">
          <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
          <button className={`chip ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </div>

      {filteredInvestments.length === 0 ? (
        <div className="empty-farms">
          <div className="empty-icon">🌱</div>
          <p>No farms yet</p>
          <a href="/invest" className="btn btn-primary">Start a farm</a>
        </div>
      ) : (
        <div className="farms-grid">
          {filteredInvestments.map(inv => {
            const progress = Math.min(100, (inv.accruedReturns / inv.amount) * 100);
            return (
              <div key={inv._id} className="farm-card">
                <div className="farm-card-inner">
                  <div className="farm-emoji">{getIcon(inv.sector)}</div>
                  <div className="farm-info">
                    <div className="farm-name">{inv.sector} Farm</div>
                    <div className="farm-amount">${inv.amount?.toFixed(2)}</div>
                  </div>
                  <div className="farm-status">
                    <span className={`status-dot ${inv.status}`}></span>
                  </div>
                </div>
                <div className="farm-stats">
                  <div className="stat">
                    <span className="stat-value">${inv.dailyReturn?.toFixed(2)}</span>
                    <span className="stat-label">/day</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">${(inv.accruedReturns || 0).toFixed(2)}</span>
                    <span className="stat-label">earned</span>
                  </div>
                </div>
                <div className="farm-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="progress-text">{Math.round(progress)}% to goal</div>
                </div>
                <div className="farm-footer">
                  <span className="farm-date">Started: {new Date(inv.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

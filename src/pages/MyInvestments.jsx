import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function MyInvestments() {
  const [investments, setInvestments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/investments/user')
      .then(data => {
        setInvestments(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredInvestments = investments.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  if (loading) return <div className="loading">Loading investments...</div>;

  return (
    <div className="investments-page">
      <h2>My Investments</h2>

      <div className="filter-tabs">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
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
        <p>No investments found. <Link to="/invest">Start investing now</Link></p>
      ) : (
        <div className="investments-table-container">
          <table className="investments-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Daily Return</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map(inv => (
                <tr key={inv._id}>
                  <td>{inv.sector}</td>
                  <td>{inv.packageId?.name || 'N/A'}</td>
                  <td>₹{inv.amount.toFixed(2)}</td>
                  <td>₹{inv.dailyReturn.toFixed(2)}</td>
                  <td>{new Date(inv.startDate).toLocaleDateString()}</td>
                  <td>{new Date(inv.endDate).toLocaleDateString()}</td>
                  <td>₹{inv.totalPaid.toFixed(2)}</td>
                  <td><span className={`badge ${inv.status}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
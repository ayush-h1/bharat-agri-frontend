import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/investments')
      .then(data => {
        setInvestments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading investments...</div>;

  return (
    <div>
      <h1>All Investments</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Package</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
            <th>Accrued</th>
          </tr>
        </thead>
        <tbody>
          {investments.map(inv => (
            <tr key={inv._id}>
              <td>{inv.userId?.name || inv.userId}</td>
              <td>{inv.packageId?.name || inv.packageId}</td>
              <td>₹{inv.amount?.toFixed(2)}</td>
              <td>{inv.status}</td>
              <td>{new Date(inv.startDate).toLocaleDateString()}</td>
              <td>{new Date(inv.endDate).toLocaleDateString()}</td>
              <td>₹{inv.accruedReturns?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
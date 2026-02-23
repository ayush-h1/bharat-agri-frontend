import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/withdrawals')
      .then(data => {
        setWithdrawals(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/withdrawals/${id}`, { status });
      setWithdrawals(withdrawals.map(w => w._id === id ? { ...w, status } : w));
    } catch (err) {
      alert(err.error || 'Failed to update');
    }
  };

  if (loading) return <div className="loading">Loading withdrawals...</div>;

  return (
    <div>
      <h1>Withdrawal Requests</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Net</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map(w => (
            <tr key={w._id}>
              <td>{w.userId?.name || w.userId}</td>
              <td>₹{w.amount?.toFixed(2)}</td>
              <td>₹{w.netAmount?.toFixed(2)}</td>
              <td>{w.status}</td>
              <td>{new Date(w.requestedAt).toLocaleDateString()}</td>
              <td>
                {w.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(w._id, 'approved')}>Approve</button>
                    <button onClick={() => updateStatus(w._id, 'rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Helper to safely convert any value to a string for rendering
const safeString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    // Log the object to help debugging
    console.error('Object being rendered directly:', value);
    return '[Object]'; // fallback to avoid crashing
  }
  return fallback;
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/payment-requests')
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const approvePayment = async (paymentId) => {
    try {
      await api.post(`/admin/payment-requests/${paymentId}/approve`);
      setPayments(payments.filter(p => p._id !== paymentId));
    } catch (err) {
      alert(err.error || 'Failed to approve');
    }
  };

  const rejectPayment = async (paymentId) => {
    try {
      await api.post(`/admin/payment-requests/${paymentId}/reject`);
      setPayments(payments.filter(p => p._id !== paymentId));
    } catch (err) {
      alert(err.error || 'Failed to reject');
    }
  };

  if (loading) return <div className="loading">Loading pending payments...</div>;

  return (
    <div>
      <h1>Pending Payments (Manual Verification)</h1>
      {payments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>UTR</th>
              <th>Screenshot</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                {/* Safely render user name */}
                <td>
                  {p.user && typeof p.user === 'object'
                    ? safeString(p.user.name) || safeString(p.user.email) || safeString(p.user._id) || 'Unknown'
                    : safeString(p.userId) || 'Unknown'}
                </td>
                <td>₹{safeString(p.amount)}</td>
                <td>{safeString(p.utr)}</td>
                <td>
                  {p.screenshot ? (
                    <a href={safeString(p.screenshot)} target="_blank" rel="noopener noreferrer">View</a>
                  ) : '—'}
                </td>
                <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                <td>
                  <button onClick={() => approvePayment(p._id)}>Approve</button>
                  <button onClick={() => rejectPayment(p._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

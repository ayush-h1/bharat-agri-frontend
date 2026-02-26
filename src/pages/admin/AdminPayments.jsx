import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/payment-requests')
      .then(data => {
        // Ensure data is an array
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
                {/* Safely render user name: if populated, use name; otherwise fallback to userId string */}
                <td>
                  {p.user && typeof p.user === 'object'
                    ? p.user.name || p.user.email || p.user._id
                    : p.userId || 'Unknown'}
                </td>
                <td>₹{p.amount}</td>
                <td>{p.utr}</td>
                <td>
                  {p.screenshot ? (
                    <a href={p.screenshot} target="_blank" rel="noopener noreferrer">View</a>
                  ) : '—'}
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
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

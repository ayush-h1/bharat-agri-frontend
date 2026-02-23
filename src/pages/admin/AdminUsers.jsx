import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addFunds = async (userId, amount) => {
    const newAmount = prompt('Enter amount to add:', '0');
    if (!newAmount) return;
    try {
      await api.post(`/admin/users/${userId}/add-funds`, { amount: parseFloat(newAmount) });
      // refresh list or update user
      const updated = users.map(u => u._id === userId ? { ...u, walletBalance: u.walletBalance + parseFloat(newAmount) } : u);
      setUsers(updated);
    } catch (err) {
      alert(err.error || 'Failed to add funds');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <h1>Manage Users</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Wallet</th>
            <th>Locked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>₹{user.walletBalance?.toFixed(2)}</td>
              <td>₹{user.lockedBalance?.toFixed(2)}</td>
              <td>
                <button onClick={() => addFunds(user._id)}>Add Funds</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
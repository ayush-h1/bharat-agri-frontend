import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api.get('/packages')
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const savePackage = async (pkg) => {
    try {
      if (pkg._id) {
        await api.put(`/admin/packages/${pkg._id}`, pkg);
      } else {
        await api.post('/admin/packages', pkg);
      }
      // refresh
      const updated = await api.get('/packages');
      setPackages(updated);
      setEditing(null);
    } catch (err) {
      alert(err.error || 'Failed to save');
    }
  };

  const deletePackage = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/packages/${id}`);
      setPackages(packages.filter(p => p._id !== id));
    } catch (err) {
      alert(err.error || 'Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading packages...</div>;

  return (
    <div>
      <h1>Manage Investment Packages</h1>
      <button onClick={() => setEditing({ name: '', minInvestment: 0, dailyReturnPercent: 0, durationDays: 30, isActive: true })}>
        Add New
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Min Investment</th>
            <th>Daily %</th>
            <th>Duration</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹{p.minInvestment}</td>
              <td>{p.dailyReturnPercent}%</td>
              <td>{p.durationDays} days</td>
              <td>{p.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button onClick={() => deletePackage(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="modal">
          <h3>{editing._id ? 'Edit Package' : 'New Package'}</h3>
          <form onSubmit={(e) => { e.preventDefault(); savePackage(editing); }}>
            <input
              type="text"
              placeholder="Name"
              value={editing.name}
              onChange={e => setEditing({ ...editing, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Min Investment"
              value={editing.minInvestment}
              onChange={e => setEditing({ ...editing, minInvestment: parseFloat(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Daily Return %"
              value={editing.dailyReturnPercent}
              onChange={e => setEditing({ ...editing, dailyReturnPercent: parseFloat(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Duration (days)"
              value={editing.durationDays}
              onChange={e => setEditing({ ...editing, durationDays: parseInt(e.target.value) })}
              required
            />
            <label>
              Active:
              <input
                type="checkbox"
                checked={editing.isActive}
                onChange={e => setEditing({ ...editing, isActive: e.target.checked })}
              />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
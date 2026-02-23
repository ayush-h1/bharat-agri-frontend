import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';

export default function Referrals() {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    referrals: [],
    referralLink: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/referrals/stats'),
      api.get('/auth/profile')
    ])
      .then(([statsData, user]) => {
        const baseUrl = window.location.origin + '/register';
        setStats({
          ...statsData,
          referralLink: `${baseUrl}?ref=${user.referralCode}`
        });
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(stats.referralLink);
    alert('Referral link copied!');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h2>Referral Program</h2>

      {/* Disclaimer Card */}
      <div className="referral-disclaimer">
        <h3>🎁 25% Referral Bonus</h3>
        <p>You earn <strong>25% of the first investment</strong> from every friend you refer. This bonus is instantly credited to your wallet and can be withdrawn immediately – no waiting period!</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Referrals" value={stats.totalReferrals} />
        <StatCard title="Active Referrals" value={stats.activeReferrals} />
        <StatCard title="Total Earnings" value={`₹${stats.totalEarned.toFixed(2)}`} />
      </div>

      <div className="referral-link-box">
        <input type="text" readOnly value={stats.referralLink} />
        <button className="btn" onClick={copyLink}>Copy Link</button>
      </div>

      <h3>Your Referrals</h3>
      {stats.referrals.length === 0 ? (
        <p>You haven't referred anyone yet. Share your link to start earning!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Joined</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats.referrals.map((ref, i) => (
                <tr key={i}>
                  <td>{ref.name}</td>
                  <td>{ref.email}</td>
                  <td>{new Date(ref.joined).toLocaleDateString()}</td>
                  <td><span className={`badge ${ref.active ? 'active' : 'inactive'}`}>
                    {ref.active ? 'Active' : 'Inactive'}
                  </span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

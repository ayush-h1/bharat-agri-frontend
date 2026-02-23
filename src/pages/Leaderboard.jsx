import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Mock data for demonstration – replace with real API data later
const mockLeaders = [
  {
    _id: '1',
    name: 'Henrietta O\'Connell',
    email: 'henrietta@example.com',
    referralCount: 1241,
    totalReferralEarnings: 2114424,
    followers: 12241
  },
  {
    _id: '2',
    name: 'Darrel Bins',
    email: 'darrel@example.com',
    referralCount: 985,
    totalReferralEarnings: 1850000,
    followers: 9800
  },
  {
    _id: '3',
    name: 'Jolie Joie',
    email: 'jolie@example.com',
    referralCount: 752,
    totalReferralEarnings: 1200000,
    followers: 7500
  },
  {
    _id: '4',
    name: 'Brian Ngo',
    email: 'brian@example.com',
    referralCount: 600,
    totalReferralEarnings: 950000,
    followers: 6000
  },
  {
    _id: '5',
    name: 'David Do',
    email: 'david@example.com',
    referralCount: 450,
    totalReferralEarnings: 720000,
    followers: 4500
  }
];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    // Try to fetch real data, fallback to mock if empty/error
    fetch('http://localhost:5000/api/referrals/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setLeaders(data);
          setTotalUsers(data.length);
        } else {
          // Use mock data
          setLeaders(mockLeaders);
          setTotalUsers(23141); // example total
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Using mock leaderboard data');
        setLeaders(mockLeaders);
        setTotalUsers(23141);
        setLoading(false);
      });

    // Fetch current user's profile (optional)
    api.get('/auth/profile')
      .then(user => setCurrentUser(user))
      .catch(() => {});
  }, []);

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  // Mock data for today's earnings – replace with real API if available
  const todayEarned = 5;

  return (
    <div className="leaderboard-modern">
      {/* Header with tabs */}
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="leaderboard-tabs">
          <button
            className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </button>
          <button
            className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Top 3 Winners */}
      <div className="top-winners">
        {leaders.slice(0, 3).map((user, index) => (
          <div key={user._id || index} className={`winner-card rank-${index + 1}`}>
            <div className="winner-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="winner-info">
              <h4>{user.name}</h4>
              <p>@{user.email?.split('@')[0]}</p>
            </div>
            <div className="winner-prize">
              <span className="prize-label">Earn</span>
              <span className="prize-amount">₹{(user.totalReferralEarnings || 0).toFixed(0)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Prize Pool / Countdown */}
      <div className="prize-pool">
        <div className="prize-item">
          <span className="prize-value">100,000</span>
          <span className="prize-label">Prize</span>
        </div>
        <div className="prize-item">
          <span className="prize-value">50,000</span>
          <span className="prize-label">Prize</span>
        </div>
        <div className="prize-item">
          <span className="prize-value">20,000</span>
          <span className="prize-label">Prize</span>
        </div>
        <div className="countdown">
          <span className="countdown-label">Ends in</span>
          <span className="countdown-time">10d 23h 59m 29s</span>
        </div>
      </div>

      {/* User Stats Line */}
      <div className="user-stats">
        You earned <strong>{todayEarned}</strong> today and we ranked out of <strong>{totalUsers}</strong> users
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table-container">
        <table className="leaderboard-table-modern">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User name</th>
              <th>Followers</th>
              <th>Point</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, idx) => (
              <tr key={user._id || idx} className={currentUser?._id === user._id ? 'current-user' : ''}>
                <td>{idx + 1}</td>
                <td>
                  <div className="user-cell">
                    <span className="user-avatar">{user.name?.charAt(0)}</span>
                    <span className="user-name">{user.name}</span>
                    <span className="user-handle">@{user.email?.split('@')[0]}</span>
                  </div>
                </td>
                <td>{user.followers || Math.floor(Math.random() * 15000)}</td>
                <td>{user.referralCount || 0}</td>
                <td>₹{(user.totalReferralEarnings || 0).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
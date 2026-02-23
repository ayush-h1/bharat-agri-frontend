import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function UserProfileCard() {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <div className="profile-card">
      <h3>Profile</h3>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Referral Code:</strong> <code>{user.referralCode}</code></p>
        <div className="referral-link">
          <input type="text" readOnly value={referralLink} />
          <button onClick={copyReferral} className="btn small">Copy</button>
        </div>
      </div>
    </div>
  );
}
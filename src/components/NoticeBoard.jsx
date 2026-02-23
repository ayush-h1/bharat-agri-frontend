import React from 'react';

export default function NoticeBoard() {
  // Static notices – could be fetched from backend later
  const notices = [
    { id: 1, title: 'New Investment Packages', content: 'Check out our new Gold and Diamond packages with higher returns!', date: '2025-02-19' },
    { id: 2, title: 'Referral Bonus Increased', content: 'Earn 25% on your first referral – now even more rewarding!', date: '2025-02-18' },
    { id: 3, title: 'Maintenance Update', content: 'Site will be down for maintenance on Feb 20th, 2:00 AM IST.', date: '2025-02-17' },
  ];

  return (
    <div className="notice-board">
      <h3>Announcements</h3>
      <div className="notice-list">
        {notices.map(notice => (
          <div key={notice.id} className="notice-item">
            <h4>{notice.title}</h4>
            <p>{notice.content}</p>
            <span className="notice-date">{notice.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
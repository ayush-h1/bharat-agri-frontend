import React, { useState, useEffect } from 'react';

export default function LiveInvestment({ investment }) {
  const { amount, dailyReturn, totalPaid, lastPayoutDate, startDate, status } = investment;
  const [earned, setEarned] = useState(totalPaid || 0);

  useEffect(() => {
    if (status !== 'active') return;

    // Reference date for accrual: last payout date, or start date if never paid
    const refDate = lastPayoutDate ? new Date(lastPayoutDate) : new Date(startDate);
    const perSecond = dailyReturn / 86400; // daily return divided by seconds in a day

    // Calculate initial accrued since refDate
    const now = new Date();
    const elapsedSeconds = (now - refDate) / 1000;
    const initialAccrued = elapsedSeconds * perSecond;
    setEarned(totalPaid + initialAccrued);

    // Update every second
    const interval = setInterval(() => {
      setEarned(prev => prev + perSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, dailyReturn, totalPaid, lastPayoutDate, startDate]);

  return (
    <div className="live-investment">
      <div className="investment-details">
        <span className="sector">{investment.sector}</span>
        <span className="amount">₹{amount.toFixed(2)}</span>
      </div>
      <div className="live-earnings">
        <span className="label">Earned so far:</span>
        <span className="value">₹{earned.toFixed(2)}</span>
        <span className="rate">(+₹{dailyReturn.toFixed(2)}/day)</span>
      </div>
    </div>
  );
}
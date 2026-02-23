import React, { useState, useEffect } from 'react';

export default function LiveInvestment({ investment }) {
  const { amount, dailyReturn, accruedReturns, startDate, status } = investment;
  const [displayAccrued, setDisplayAccrued] = useState(accruedReturns || 0);

  useEffect(() => {
    if (status !== 'active') return;

    const perSecond = dailyReturn / 86400; // daily return / seconds in a day

    // Calculate seconds since last cron run (simplified: assume last cron at midnight)
    const now = new Date();
    const lastCron = new Date(now);
    lastCron.setHours(0, 0, 0, 0);
    const secondsToday = (now - lastCron) / 1000;
    const initialAccrued = (accruedReturns || 0) + (secondsToday > 0 ? perSecond * secondsToday : 0);
    setDisplayAccrued(initialAccrued);

    const interval = setInterval(() => {
      setDisplayAccrued(prev => prev + perSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, dailyReturn, accruedReturns]);

  return (
    <div className="live-investment">
      <div className="investment-details">
        <span className="sector">{investment.sector}</span>
        <span className="amount">₹{amount.toFixed(2)}</span>
      </div>
      <div className="live-earnings">
        <span className="label">Earned so far:</span>
        <span className="value">₹{displayAccrued.toFixed(2)}</span>
        <span className="rate">(+₹{dailyReturn.toFixed(2)}/day)</span>
      </div>
    </div>
  );
}
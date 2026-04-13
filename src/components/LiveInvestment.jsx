import React, { useState, useEffect } from 'react';

export default function LiveInvestment({ investment }) {
  const { amount, dailyReturn, accruedReturns, status } = investment;
  const [displayAccrued, setDisplayAccrued] = useState(accruedReturns || 0);

  useEffect(() => {
    if (status !== 'active') return;
    const perSecond = dailyReturn / 86400;
    const interval = setInterval(() => {
      setDisplayAccrued(prev => prev + perSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [status, dailyReturn, accruedReturns]);

  return (
    <div className="live-investment">
      <div className="investment-details">
        <span className="sector">{investment.sector}</span>
        <span className="amount">${amount.toFixed(2)}</span>
      </div>
      <div className="live-earnings">
        <span className="label">Earned so far:</span>
        <span className="value">${displayAccrued.toFixed(2)}</span>
        <span className="rate">(+${dailyReturn.toFixed(2)}/day)</span>
      </div>
    </div>
  );
}

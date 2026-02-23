import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopUp() {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      navigate(`/payment?amount=${amount}&redirect=dashboard`);
    }
  };

  return (
    <div className="topup-container">
      <h2>Add Funds to Wallet</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            min="1"
            step="any"   // ← allows any number, not just multiples
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Enter amount"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
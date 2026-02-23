import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const MIN_WITHDRAWAL = 3000;
  const WC_FEE = 0.05;
  const SERVICE_FEE = 0.05;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.get('/withdrawals/user');
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (amt < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal is ₹${MIN_WITHDRAWAL}`);
      return;
    }
    try {
      await api.post('/withdrawals', { amount: amt });
      alert('Withdrawal request submitted successfully!');
      setAmount('');
      loadHistory();
    } catch (err) {
      setError(err.error || 'Request failed');
    }
  };

  const wcFee = amount ? (parseFloat(amount) * WC_FEE).toFixed(2) : '0.00';
  const serviceFee = amount ? (parseFloat(amount) * SERVICE_FEE).toFixed(2) : '0.00';
  const net = amount ? (parseFloat(amount) - parseFloat(wcFee) - parseFloat(serviceFee)).toFixed(2) : '0.00';

  return (
    <div className="container">
      <h2>Withdraw Funds</h2>
      <div className="withdraw-layout">
        <div className="card">
          <h3>Request Withdrawal</h3>
          <div className="fee-info">
            <p><strong>Minimum withdrawal:</strong> ₹{MIN_WITHDRAWAL}</p>
            <p><strong>Fees:</strong> 5% WC + 5% Service Tax</p>
            <p className="net-amount">You will receive: ₹{net}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min={MIN_WITHDRAWAL}
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div id="feeCalculation" style={{ marginBottom: '1rem' }}>
              <p><strong>WC Fee (5%):</strong> ₹{wcFee}</p>
              <p><strong>Service Tax (5%):</strong> ₹{serviceFee}</p>
              <p className="net-amount">You will receive: ₹{net}</p>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn">Request Withdrawal</button>
          </form>
        </div>

        <div className="card">
          <h3>Withdrawal History</h3>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : history.length === 0 ? (
            <p>No withdrawal requests yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Date</th><th>Amount</th><th>Net</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {history.map(w => (
                    <tr key={w._id}>
                      <td>{new Date(w.requestedAt).toLocaleDateString()}</td>
                      <td>₹{w.amount}</td>
                      <td>₹{w.netAmount}</td>
                      <td><span className={`badge ${w.status}`}>{w.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
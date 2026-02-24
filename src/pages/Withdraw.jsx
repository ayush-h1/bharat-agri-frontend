import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedUpi, setSavedUpi] = useState(null); // single UPI object { upiId, accountHolder }
  const [selectedUpi, setSelectedUpi] = useState('');
  const [upiLoading, setUpiLoading] = useState(true);

  const MIN_WITHDRAWAL = 3000;
  const WC_FEE = 0.05;
  const SERVICE_FEE = 0.05;

  useEffect(() => {
    loadHistory();
    loadUpiDetails();
  }, []);

  const loadUpiDetails = async () => {
    try {
      const data = await api.get('/user/bank-details');
      if (data && data.upiId) {
        setSavedUpi(data);
        setSelectedUpi(data.upiId);
      }
    } catch (err) {
      console.error('Failed to load UPI details', err);
    } finally {
      setUpiLoading(false);
    }
  };

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
    if (!selectedUpi) {
      setError('Please select a UPI ID to withdraw to.');
      return;
    }
    try {
      // Include upiId in the request body
      await api.post('/withdrawals', { amount: amt, upiId: selectedUpi });
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

          {/* UPI Selection */}
          <div className="form-group">
            <label>Withdraw to UPI ID</label>
            {upiLoading ? (
              <p>Loading your UPI details...</p>
            ) : savedUpi ? (
              <div className="upi-selection">
                <select
                  value={selectedUpi}
                  onChange={(e) => setSelectedUpi(e.target.value)}
                  required
                >
                  <option value="">Select UPI ID</option>
                  <option value={savedUpi.upiId}>
                    {savedUpi.upiId} ({savedUpi.accountHolder})
                  </option>
                </select>
                <Link to="/profile" className="btn-link">Edit</Link>
              </div>
            ) : (
              <p className="warning">
                No UPI ID saved. Please add one in <Link to="/profile">Profile</Link> first.
              </p>
            )}
          </div>

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
            <button
              type="submit"
              className="btn"
              disabled={!selectedUpi}
            >
              Request Withdrawal
            </button>
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

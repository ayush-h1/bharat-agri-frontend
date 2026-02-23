import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// List of UPI IDs – one will be chosen randomly
const upiOptions = [
  { id: 'bharatagri@okhdfcbank', name: 'HDFC Bank' },
  { id: 'bharatagri@axisbank', name: 'Axis Bank' },
  { id: 'bharatagri@icici', name: 'ICICI Bank' },
  { id: 'bharatagri@paytm', name: 'Paytm' },
];

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState(0);
  const [packageInfo, setPackageInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [upi, setUpi] = useState(null);
  const [copied, setCopied] = useState(false);
  const [utrError, setUtrError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amt = params.get('amount');
    const pkg = params.get('package');
    if (amt) setAmount(parseInt(amt));
    if (pkg) setPackageInfo(pkg);

    // Pick a random UPI
    const randomIndex = Math.floor(Math.random() * upiOptions.length);
    setUpi(upiOptions[randomIndex]);
  }, [location]);

  const copyUpiId = () => {
    if (upi) {
      navigator.clipboard.writeText(upi.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const validateUtr = (value) => {
    const utrRegex = /^\d{12}$/;
    if (!value) return 'UTR number is required';
    if (!utrRegex.test(value)) return 'UTR must be a 12-digit number';
    return '';
  };

  const handleUtrChange = (e) => {
    const value = e.target.value;
    setUtr(value);
    setUtrError(validateUtr(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateUtr(utr);
    if (error) {
      setUtrError(error);
      return;
    }

    setProcessing(true);
    // Simulate submission (manual verification)
    setTimeout(() => {
      alert('Your payment request has been submitted and is under verification. You will be notified once confirmed.');
      navigate(packageInfo ? '/invest' : '/dashboard');
    }, 1500);
  };

  if (!upi) return <div className="loading">Loading payment details...</div>;

  return (
    <div className="payment-container">
      <h2>{packageInfo ? `Complete Payment for ${packageInfo}` : 'Add Funds to Wallet'}</h2>
      <div className="payment-card">
        <h3>Payment Details</h3>
        <div className="payment-amount">
          <span className="label">Amount to add:</span>
          <span className="value">₹{amount}</span>
        </div>
        {packageInfo && (
          <div className="payment-package">
            <span className="label">For package:</span>
            <span className="value">{packageInfo}</span>
          </div>
        )}

        {/* UPI Details - directly shown */}
        <div className="upi-details">
          <h4>Pay via UPI</h4>
          <div className="qr-code">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upi.id}&pn=BharatAgri&am=${amount}`}
              alt={`QR for ${upi.name}`}
            />
          </div>
          <div className="upi-id">
            <span><strong>UPI ID:</strong> {upi.id}</span>
            <button className="btn-copy" onClick={copyUpiId}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="note">After payment, enter the UTR number below and upload screenshot (optional).</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>UTR Number</label>
            <input
              type="text"
              value={utr}
              onChange={handleUtrChange}
              placeholder="12-digit UTR number"
              required
            />
            {utrError && <div className="error-text">{utrError}</div>}
          </div>
          <div className="form-group">
            <label>Payment Screenshot (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            className="btn btn-primary pay-btn"
            disabled={processing || !!utrError}
          >
            {processing ? 'Submitting...' : 'Submit Payment'}
          </button>
        </form>
        <button className="btn btn-outline cancel-btn" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'USDT', 'USDC'];

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [amountUSD, setAmountUSD] = useState(0);
  const [packageInfo, setPackageInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [utr, setUtr] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [exchangeRateINR, setExchangeRateINR] = useState(null);
  const [amountINR, setAmountINR] = useState(0);
  const [loadingRate, setLoadingRate] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amt = params.get('amount');
    const pkg = params.get('package');
    if (amt) setAmountUSD(parseInt(amt));
    if (pkg) setPackageInfo(pkg);
  }, [location]);

  // Fetch USD to INR exchange rate
  useEffect(() => {
    if (amountUSD > 0) {
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(res => res.json())
        .then(data => {
          const rate = data.rates.INR;
          setExchangeRateINR(rate);
          setAmountINR(amountUSD * rate);
          setLoadingRate(false);
        })
        .catch(err => {
          console.error('Failed to fetch exchange rate', err);
          setLoadingRate(false);
        });
    }
  }, [amountUSD]);

  // Fetch crypto exchange rate for crypto payments
  useEffect(() => {
    if (paymentMethod === 'crypto' && amountUSD > 0) {
      const cryptoId = selectedCrypto === 'USDT' || selectedCrypto === 'USDC' ? 'tether' : selectedCrypto.toLowerCase();
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`)
        .then(res => res.json())
        .then(data => {
          let rate;
          if (selectedCrypto === 'USDT') rate = data.tether?.usd || 1;
          else if (selectedCrypto === 'USDC') rate = data['usd-coin']?.usd || 1;
          else rate = data[selectedCrypto.toLowerCase()]?.usd || 1;
          setCryptoAmount((amountUSD / rate).toFixed(8));
        })
        .catch(() => setCryptoAmount(null));
    }
  }, [selectedCrypto, amountUSD, paymentMethod]);

  const generateCryptoAddress = async () => {
    try {
      const response = await api.post('/crypto/generate-address', {
        cryptoCurrency: selectedCrypto,
        amountUSD: amountUSD
      });
      setCryptoAddress(response.address);
    } catch (err) {
      alert('Failed to generate payment address');
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    if (!utr) {
      alert('UTR number is required');
      return;
    }
    setProcessing(true);
    try {
      await api.post('/payment-requests', {
        amountUSD,
        amountLocal: amountINR,
        currency: 'INR',
        paymentMethod: 'bank',
        utr,
        packageInfo
      });
      alert(`Payment request submitted! You will receive $${amountUSD} USD in your wallet after verification.`);
      navigate(packageInfo ? '/invest' : '/dashboard');
    } catch (err) {
      alert('Submission failed');
      setProcessing(false);
    }
  };

  const handleCryptoSubmit = async () => {
    if (!cryptoAddress) {
      await generateCryptoAddress();
      return;
    }
    setProcessing(true);
    try {
      await api.post('/payment-requests', {
        amountUSD,
        amountLocal: amountUSD,
        currency: 'USD',
        paymentMethod: 'crypto',
        cryptoCurrency: selectedCrypto,
        walletAddress: cryptoAddress,
        packageInfo
      });
      alert(`Please send exactly ${cryptoAmount} ${selectedCrypto} to the provided address. You will receive $${amountUSD} USD in your wallet.`);
      navigate(packageInfo ? '/invest' : '/dashboard');
    } catch (err) {
      alert('Submission failed');
      setProcessing(false);
    }
  };

  if (loadingRate && amountUSD > 0) {
    return <div className="loading">Loading exchange rates...</div>;
  }

  return (
    <div className="payment-container">
      <h2>{packageInfo ? `Complete Payment for ${packageInfo}` : 'Add Funds to Wallet'}</h2>
      <div className="payment-card">
        <h3>Payment Details</h3>
        <div className="payment-amount">
          <span className="label">You will receive:</span>
          <span className="value">${amountUSD} USD</span>
        </div>

        {/* Payment Method Toggle */}
        <div className="payment-method-toggle">
          <button 
            className={`toggle-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('bank')}
          >
            🏦 Bank Transfer (INR)
          </button>
          <button 
            className={`toggle-btn ${paymentMethod === 'crypto' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('crypto')}
          >
            ₿ Cryptocurrency
          </button>
        </div>

        {/* Bank Transfer Section - Shows INR amount to pay */}
        {paymentMethod === 'bank' && (
          <form onSubmit={handleBankSubmit}>
            <div className="form-group">
              <label>Amount to Deposit (INR)</label>
              <div className="amount-highlight">
                <span className="inr-amount">₹{amountINR.toFixed(2)}</span>
                <small>(Based on current exchange rate: 1 USD = ₹{exchangeRateINR?.toFixed(2)})</small>
              </div>
            </div>
            <div className="form-group">
              <label>Bank Details</label>
              <div className="bank-details">
                <p><strong>Bank:</strong> HDFC Bank</p>
                <p><strong>Account Name:</strong> AgriWealth Pvt Ltd</p>
                <p><strong>Account Number:</strong> 50200012345678</p>
                <p><strong>IFSC Code:</strong> HDFC0001234</p>
                <p><strong>UPI ID:</strong> agriwealth@hdfcbank</p>
              </div>
            </div>
            <div className="form-group">
              <label>UTR / Reference Number</label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="Enter UTR number after payment"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={processing}>
              {processing ? 'Submitting...' : `Confirm Payment of ₹${amountINR.toFixed(2)}`}
            </button>
          </form>
        )}

        {/* Crypto Section */}
        {paymentMethod === 'crypto' && (
          <div>
            <div className="form-group">
              <label>Select Cryptocurrency</label>
              <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)}>
                {CRYPTO_CURRENCIES.map(crypto => (
                  <option key={crypto} value={crypto}>{crypto}</option>
                ))}
              </select>
            </div>

            <div className="exchange-rate">
              <p>You will receive: <strong>${amountUSD} USD</strong></p>
              {cryptoAmount && (
                <p>Pay: <strong>{cryptoAmount} {selectedCrypto}</strong></p>
              )}
            </div>

            {cryptoAddress ? (
              <div className="crypto-address">
                <p><strong>Send to this address:</strong></p>
                <code>{cryptoAddress}</code>
                <button onClick={() => navigator.clipboard.writeText(cryptoAddress)}>
                  Copy Address
                </button>
                <p className="note">Payment will be auto-approved once confirmed on blockchain.</p>
              </div>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={handleCryptoSubmit}
                disabled={processing}
              >
                Generate Payment Address
              </button>
            )}
          </div>
        )}

        <button className="btn btn-outline cancel-btn" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}


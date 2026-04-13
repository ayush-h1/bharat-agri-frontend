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
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amt = params.get('amount');
    const pkg = params.get('package');
    if (amt) setAmountUSD(parseFloat(amt));
    if (pkg) setPackageInfo(pkg);
  }, [location]);

  // Fetch USD to INR exchange rate (live)
  useEffect(() => {
    if (amountUSD > 0) {
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(res => res.json())
        .then(data => {
          const rate = data.rates.INR;
          if (rate && typeof rate === 'number') {
            setExchangeRateINR(rate);
            setAmountINR(amountUSD * rate);
            setLoadingRate(false);
            setRateError(false);
          } else {
            throw new Error('Invalid rate');
          }
        })
        .catch(err => {
          console.error('Exchange rate fetch failed', err);
          setRateError(true);
          setLoadingRate(false);
          // Fallback approximate rate
          const fallbackRate = 85;
          setExchangeRateINR(fallbackRate);
          setAmountINR(amountUSD * fallbackRate);
        });
    } else {
      setLoadingRate(false);
    }
  }, [amountUSD]);

  // Fetch crypto exchange rate
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
      alert(`✅ Payment request submitted! You will receive $${amountUSD} USD after verification.`);
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
      alert(`Please send exactly ${cryptoAmount} ${selectedCrypto} to the provided address.`);
      navigate(packageInfo ? '/invest' : '/dashboard');
    } catch (err) {
      alert('Submission failed');
      setProcessing(false);
    }
  };

  if (loadingRate && amountUSD > 0) {
    return <div className="loading premium-loading">Fetching live exchange rate...</div>;
  }

  return (
    <div className="premium-payment-container">
      <div className="premium-payment-card">
        <div className="payment-header">
          <h2>{packageInfo ? `Complete Payment for ${packageInfo}` : 'Add Funds to Wallet'}</h2>
          <p className="payment-subtitle">Secure payment gateway</p>
        </div>

        <div className="payment-amount-card">
          <span className="label">You will receive</span>
          <div className="amount-value">${amountUSD.toFixed(2)} USD</div>
          {paymentMethod === 'bank' && exchangeRateINR && (
            <div className="inr-equivalent">
              ≈ ₹{amountINR.toFixed(2)} INR
              <span className="rate-info">(1 USD = ₹{exchangeRateINR.toFixed(2)})</span>
            </div>
          )}
        </div>

        {/* Premium Toggle */}
        <div className="premium-tabs">
          <button
            className={`tab-btn-premium ${paymentMethod === 'bank' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('bank')}
          >
            <i className="fas fa-university"></i> Bank Transfer (INR)
          </button>
          <button
            className={`tab-btn-premium ${paymentMethod === 'crypto' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('crypto')}
          >
            <i className="fab fa-bitcoin"></i> Cryptocurrency
          </button>
        </div>

        {/* Bank Transfer Section */}
        {paymentMethod === 'bank' && (
          <div className="premium-bank-details">
            <div className="details-card">
              <h4><i className="fas fa-building"></i> Bank Account Details</h4>
              <div className="detail-row">
                <span>Bank</span>
                <strong>HDFC Bank</strong>
              </div>
              <div className="detail-row">
                <span>Account Name</span>
                <strong>AgriWealth Pvt Ltd</strong>
              </div>
              <div className="detail-row">
                <span>Account Number</span>
                <strong>50200012345678</strong>
              </div>
              <div className="detail-row">
                <span>IFSC Code</span>
                <strong>HDFC0001234</strong>
              </div>
              <div className="detail-row">
                <span>UPI ID</span>
                <strong className="copyable" onClick={() => navigator.clipboard.writeText('agriwealth@hdfcbank')}>
                  agriwealth@hdfcbank <i className="fas fa-copy"></i>
                </strong>
              </div>
            </div>

            <form onSubmit={handleBankSubmit}>
              <div className="form-group premium-form-group">
                <label>UTR / Reference Number</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Enter UTR number after payment"
                  required
                />
              </div>
              <button type="submit" className="btn-premium-submit" disabled={processing}>
                {processing ? 'Submitting...' : `Confirm Payment of ₹${amountINR.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}

        {/* Crypto Section */}
        {paymentMethod === 'crypto' && (
          <div className="premium-crypto-section">
            <div className="form-group premium-form-group">
              <label>Select Cryptocurrency</label>
              <select value={selectedCrypto} onChange={(e) => setSelectedCrypto(e.target.value)}>
                {CRYPTO_CURRENCIES.map(crypto => (
                  <option key={crypto} value={crypto}>{crypto}</option>
                ))}
              </select>
            </div>

            <div className="crypto-exchange-card">
              <p>You will receive: <strong>${amountUSD} USD</strong></p>
              {cryptoAmount && (
                <p>Pay: <strong>{cryptoAmount} {selectedCrypto}</strong></p>
              )}
            </div>

            {cryptoAddress ? (
              <div className="crypto-address-card">
                <p><i className="fas fa-qrcode"></i> Send to this address:</p>
                <code>{cryptoAddress}</code>
                <button onClick={() => navigator.clipboard.writeText(cryptoAddress)}>
                  Copy Address
                </button>
                <p className="note">Payment will be auto-approved once confirmed on blockchain.</p>
              </div>
            ) : (
              <button className="btn-premium-submit" onClick={handleCryptoSubmit} disabled={processing}>
                Generate Payment Address
              </button>
            )}
          </div>
        )}

        <button className="btn-premium-cancel" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}


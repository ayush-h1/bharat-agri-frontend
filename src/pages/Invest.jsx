import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PackageCard from '../components/PackageCard';

export default function Invest() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ define loading
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [form, setForm] = useState({ sector: 'Fish', amount: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/packages')
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
    setForm({ ...form, amount: pkg.minInvestment });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const amount = parseFloat(form.amount);
    if (amount < selectedPackage.min) {
      alert(`Minimum investment for this package is ₹${selectedPackage.min}`);
      return;
    }
    console.log('Wallet:', user.walletBalance, 'Amount:', amount, 'Shortfall:', amount - user.walletBalance);
    // Check if user has enough balance
    if (user.walletBalance < amount) {
      // Redirect to payment page with amount and package name
      navigate(`/payment?amount=${amount - user.walletBalance}&package=${selectedPackage.name}`);
      return;
    }

    // Proceed with investment
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      const response = await api.post('/investments', {
        packageId: selectedPackage._id,
        sector: form.sector,
        amount: amount
      });
      // ✅ Update context with new user data
      login(localStorage.getItem('token'), response.user);
      alert('Investment successful! You will start earning daily returns.');
      setSelectedPackage(null);
      setForm({ sector: 'Fish', amount: '' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Investment failed');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Invest Now';
    }
  };

  if (loading) return <div className="loading">Loading packages...</div>;

  return (
    <div className="container">
      <h2>Choose an Investment Package</h2>
      <div className="package-grid">
        {packages.map(pkg => (
          <PackageCard key={pkg._id} pkg={pkg} onSelect={handleSelect} />
        ))}
      </div>

      {selectedPackage && (
        <div className="card invest-form">
          <h3>Invest in {selectedPackage.name}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Sector</label>
              <select
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
              >
                <option value="Fish">Fish Farming</option>
                <option value="Bee">Bee Keeping</option>
                <option value="Poultry">Poultry Farming</option>
                <option value="Dairy">Dairy Farming</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min={selectedPackage.min}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              <small>Minimum: ₹{selectedPackage.min}</small>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn">Invest Now</button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSelectedPackage(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Invest() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly');
  const [faqOpen, setFaqOpen] = useState({});

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

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Map backend packages to new design (Classic, Premium, Professional)
  const packageMap = {
    Billers: { displayName: 'Silver', percent: 3, features: [
      'Minimum Deposit ₹100)',
      'Maximum Deposit ₹10,000',
      'Enhanced security',
      'Access to fish farming only',
      '24/7 Support'
    ]},
    Gold: { displayName: 'Gold', percent: 6, features: [
      'Minimum Deposit ₹3,000',
      'Maximum Deposit ₹30,000',
      'Enhanced security',
      'Access to all sectors',
      '24/7 Support'
    ]},
    Diamond: { displayName: 'Diamomd', percent: 9, features: [
      'Minimum Deposit ₹7,000',
      'Maximum Deposit ₹70,000',
      'Enhanced security',
      'Access to all sectors + analytics',
      '24/7 Support'
    ]}
  };

  const faqList = [
    {
      question: 'How does investing in digital farming work?',
      answer: 'You choose an investment package and sector (Fish, Bee, Poultry, or Dairy). Your funds are used to support real farming operations. You earn daily returns, and at the end of the 30‑day term, your principal plus all accrued returns are released to your wallet.'
    },
    {
      question: 'What are the risks involved?',
      answer: 'As with any investment, there are risks. We partner with experienced farmers and use modern technology to minimise them. Factors like weather, market prices, or operational issues can affect returns. We recommend starting with smaller amounts to understand the process.'
    },
    {
      question: 'How do I withdraw my earnings?',
      answer: 'Once your investment matures, the principal and returns are credited to your wallet. You can request a withdrawal anytime (minimum ₹3000). Withdrawals are processed within 24‑48 hours and sent to your registered bank account via NEFT/UPI.'
    }
  ];

  const handleBuy = async (pkg) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const display = packageMap[pkg.name] || { displayName: pkg.name, percent: pkg.dailyReturnPercent, features: [] };
    const amount = pkg.minInvestment;
    if (user.walletBalance >= amount) {
      try {
        await api.post('/investments', {
          packageId: pkg._id,
          sector: 'Fish',
          amount
        });
        alert('Investment successful!');
        navigate('/dashboard');
      } catch (err) {
        alert(err.error || 'Investment failed');
      }
    } else {
      const shortfall = amount - user.walletBalance;
      navigate(`/payment?amount=${shortfall}&package=${display.displayName}`);
    }
  };

  if (loading) return <div className="loading">Loading packages...</div>;

  return (
    <div className="invest-modern">
      <h2 className="page-title">Investment Plans</h2>

      <div className="plan-tabs">
        <button className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`} onClick={() => setActiveTab('monthly')}>Monthly</button>
        <button className={`tab-btn ${activeTab === 'yearly' ? 'active' : ''}`} onClick={() => setActiveTab('yearly')}>Yearly</button>
      </div>

      <div className="package-grid-modern">
        {packages.map(pkg => {
          const display = packageMap[pkg.name] || { displayName: pkg.name, percent: pkg.dailyReturnPercent, features: [] };
          return (
            <div key={pkg._id} className="package-card-modern">
              <h3>{display.displayName}</h3>
              <div className="percentage">{display.percent}%</div>
              <div className="duration">Daily for 30 Days</div>
              <ul className="features-list">
                {display.features.map((feat, i) => <li key={i}>{feat}</li>)}
              </ul>
              <button className="btn-buy" onClick={() => handleBuy(pkg)}>Buy Now</button>
            </div>
          );
        })}
      </div>

      <div className="faq-section">
        <h2>Questions you often ask</h2>
        <div className="faq-list">
          {faqList.map((item, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{item.question}</span>
                <span className="faq-icon">{faqOpen[index] ? '−' : '+'}</span>
              </div>
              {faqOpen[index] && <div className="faq-answer">{item.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

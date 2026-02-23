import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const testimonials = [
    {
      id: 1,
      name: 'Ramesh Patel',
      role: 'Farmer, Maharashtra',
      content: 'Bharat Agri Network helped me expand my dairy farm. The returns are timely and the platform is very transparent.',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Investor, Delhi',
      content: 'I started with a small investment in poultry and now I’m earning steady daily returns. Highly recommended!',
      rating: 5
    },
    {
      id: 3,
      name: 'Amit Singh',
      role: 'Agripreneur, Punjab',
      content: 'The referral program is amazing. I’ve already referred 5 friends and earning passive income.',
      rating: 5
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Grow Your Wealth with <span className="highlight">Digital Farming</span></h1>
            <p className="hero-subtitle">
              Invest in sustainable agriculture projects – Fish, Bee, Poultry, and Dairy – and earn daily returns with full transparency.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Start Investing</Link>
              <a href="#how-it-works" className="btn btn-outline">Learn More</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Active Investors</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Partner Farms</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹5Cr+</span>
                <span className="stat-label">Returns Paid</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Farming" />
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌾</div>
              <div className="stat-number">
                {statsInView ? <CountUp end={150} duration={2} /> : '0'}+
              </div>
              <div className="stat-label">Projects Funded</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🌾</div>
              <div className="stat-number">
                {statsInView ? <CountUp end={2500} duration={2} /> : '0'}+
              </div>
              <div className="stat-label">Farmers Supported</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-number">
                ₹{statsInView ? <CountUp end={5} decimals={1} suffix="Cr" duration={2} /> : '0'}
              </div>
              <div className="stat-label">Total Investment</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-number">
                {statsInView ? <CountUp end={12} duration={2} suffix="%" /> : '0'}
              </div>
              <div className="stat-label">Avg. Annual Return</div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Sectors */}
      <section className="farming-options">
        <div className="container">
          <div className="section-title">
            <h3>Investment Sectors</h3>
            <p>Choose from four high‑potential agricultural sectors</p>
          </div>
          <div className="cards">
            <div className="card">
              <i className="fas fa-fish"></i>
              <h4>Fish Farming</h4>
              <p>High‑yield aquaculture with modern techniques. Sustainable and profitable.</p>
            </div>
            <div className="card">
              <i className="fas fa-bug"></i>
              <h4>Bee Keeping</h4>
              <p>Earn from honey, beeswax, and pollination services. Low maintenance.</p>
            </div>
            <div className="card">
              <i className="fas fa-drumstick-bite"></i>
              <h4>Poultry Farming</h4>
              <p>Modern poultry farms with healthy breeds. Steady income from eggs and meat.</p>
            </div>
            <div className="card">
              <i className="fas fa-cow"></i>
              <h4>Dairy Farming</h4>
              <p>Invest in cattle and milk production. Regular payouts and growing demand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h3>How It Works</h3>
            <p>Start earning in four simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="number">1</div>
              <h5>Create Account</h5>
              <p>Sign up for free and get your unique referral code.</p>
            </div>
            <div className="step">
              <div className="number">2</div>
              <h5>Choose Package</h5>
              <p>Select from Billers, Gold, or Diamond based on your budget.</p>
            </div>
            <div className="step">
              <div className="number">3</div>
              <h5>Pick a Sector</h5>
              <p>Invest in Fish, Bee, Poultry, or Dairy farming.</p>
            </div>
            <div className="step">
              <div className="number">4</div>
              <h5>Earn Daily Returns</h5>
              <p>Watch your money grow with daily payouts to your wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages">
        <div className="container">
          <div className="section-title">
            <h3>Investment Packages</h3>
            <p>Choose a plan that fits your goals</p>
          </div>
          <div className="package-grid">
            <div className="package-card">
              <h4>Silver</h4>
              <div className="price">₹1000</div>
              <div className="daily">3% Daily</div>
              <p className="package-desc">Perfect for beginners to test the waters.</p>
              <Link to="/register" className="btn btn-outline">Get Started</Link>
            </div>
            <div className="package-card popular">
              <div className="badge">Most Popular</div>
              <h4>Gold</h4>
              <div className="price">₹3000</div>
              <div className="daily">5% Daily</div>
              <p className="package-desc">Best for serious investors seeking higher returns.</p>
              <Link to="/register" className="btn btn-primary">Invest Now</Link>
            </div>
            <div className="package-card">
              <h4>Diamond</h4>
              <div className="price">₹7000</div>
              <div className="daily">10% Daily</div>
              <p className="package-desc">Maximum returns for premium investors.</p>
              <Link to="/register" className="btn btn-outline">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h3>What Our Investors Say</h3>
            <p>Real stories from real people</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testimonial-content">"{t.content}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h3>Ready to grow your wealth?</h3>
          <p>Join thousands of investors and start earning daily returns today.</p>
          <Link to="/register" className="btn btn-light">Create Free Account</Link>
        </div>
      </section>
    </main>
  );
}

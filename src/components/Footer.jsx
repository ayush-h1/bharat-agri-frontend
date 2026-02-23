export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h6>Bharat Agri Network</h6>
            <p>Empowering farmers and investors through technology.</p>
          </div>
          <div className="footer-section">
            <h6>Quick Links</h6>
            <p><a href="/">Home</a></p>
            <p><a href="/invest">Invest</a></p>
            <p><a href="/leaderboard">Leaderboard</a></p>
          </div>
          <div className="footer-section">
            <h6>Contact</h6>
            <p>Pune, India</p>
            <p>invest@bharatagri.in</p>
          </div>
        </div>
        <div className="copyright">
          &copy; 2025 Bharat Agri Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
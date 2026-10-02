import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer dark-theme">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-mark h3">AUREMONT</Link>
            <p>Exceptional places, clearly discovered.</p>
          </div>
          <div className="footer-links">
            <span className="footer-heading">Marketplace</span>
            <Link to="/search?mode=buy">Buy</Link>
            <Link to="/search?mode=rent">Rent</Link>
            <Link to="/search?mode=lease">Lease</Link>
            <Link to="/search?mode=cars">Cars</Link>
          </div>
          <div className="footer-links">
            <span className="footer-heading">Company</span>
            <Link to="/about">About Auremont</Link>
            <Link to="/trust">Trust & Safety</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-links">
            <span className="footer-heading">Support</span>
            <Link to="/help">Help Center</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="text-meta">© {new Date().getFullYear()} Auremont. All rights reserved.</p>
          <div className="language-selector">
            <span>EN</span> · <span>FR</span> · <span>ES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

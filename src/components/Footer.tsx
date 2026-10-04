import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import type { Language } from '../context/I18nContext';
import './Footer.css';

export default function Footer() {
  const { t, language, setLanguage } = useI18n();

  return (
    <footer className="footer dark-theme">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-mark h3">AUREMONT</Link>
            <p>{t.footer.tagline}</p>
          </div>
          <div className="footer-links">
            <span className="footer-heading">{t.footer.marketplace}</span>
            <Link to="/buy">{t.nav.buy}</Link>
            <Link to="/rent">{t.nav.rent}</Link>
            <Link to="/lease">{t.nav.lease}</Link>
            <Link to="/cars">{t.nav.cars}</Link>
          </div>
          <div className="footer-links">
            <span className="footer-heading">{t.footer.company}</span>
            <Link to="/about">{t.footer.about}</Link>
            <Link to="/about#trust">{t.footer.trust}</Link>
            <Link to="/about#contact">{t.footer.contact}</Link>
          </div>
          <div className="footer-links">
            <span className="footer-heading">{t.footer.support}</span>
            <Link to="/about#contact">{t.footer.help}</Link>
            <Link to="/terms">{t.footer.terms}</Link>
            <Link to="/privacy">{t.footer.privacy}</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="text-meta">© {new Date().getFullYear()} Auremont. {t.footer.rightsReserved}</p>
          <div className="language-selector" aria-label="Select Language">
            <button 
              className={`footer-lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en' as Language)}
            >
              EN
            </button>
            <span className="lang-sep">·</span>
            <button 
              className={`footer-lang-btn ${language === 'fr' ? 'active' : ''}`}
              onClick={() => setLanguage('fr' as Language)}
            >
              FR
            </button>
            <span className="lang-sep">·</span>
            <button 
              className={`footer-lang-btn ${language === 'es' ? 'active' : ''}`}
              onClick={() => setLanguage('es' as Language)}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

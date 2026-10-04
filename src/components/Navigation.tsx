import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Settings, CreditCard, Heart, MessageSquare, Briefcase, PlusCircle, Shield, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import type { Language } from '../context/I18nContext';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const isHome = location.pathname === '/';

  // Automatically close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleOpenConcierge = () => {
    const trigger = document.getElementById('concierge-trigger-btn');
    if (trigger) trigger.click();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`navigation ${isHome ? 'nav-transparent' : 'nav-solid'}`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand-mark" aria-label="Auremont Home">AUREMONT</Link>
          <nav className="nav-links desktop-only" aria-label="Primary Marketplace">
            <Link to="/buy">{t.nav.buy}</Link>
            <Link to="/rent">{t.nav.rent}</Link>
            <Link to="/lease">{t.nav.lease}</Link>
            <Link to="/cars">{t.nav.cars}</Link>
          </nav>
        </div>
        
        <div className="nav-right desktop-only">
          <Link to="/explore">{t.nav.explore}</Link>
          <Link to="/search" className="icon-btn touch-target" aria-label="Search Marketplace">
            <Search size={20} strokeWidth={1.5} />
          </Link>

          {/* Quick Concierge Trigger */}
          <button 
            className="icon-btn touch-target nav-concierge-quick-btn" 
            onClick={handleOpenConcierge}
            title={t.nav.concierge}
            aria-label={t.nav.concierge}
          >
            <Sparkles size={18} strokeWidth={1.8} style={{ color: '#C5A880' }} />
          </button>

          {/* Language Switcher Dropdown */}
          <div className="nav-lang-dropdown">
            <button 
              className="nav-lang-btn touch-target" 
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label="Change Language"
            >
              <Globe size={16} />
              <span>{language.toUpperCase()}</span>
            </button>
            {isLangOpen && (
              <div className="nav-lang-menu" onMouseLeave={() => setIsLangOpen(false)}>
                {(['en', 'fr', 'es'] as const).map(langCode => (
                  <button
                    key={langCode}
                    className={`nav-lang-item ${language === langCode ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(langCode as Language);
                      setIsLangOpen(false);
                    }}
                  >
                    {langCode === 'en' && 'English'}
                    {langCode === 'fr' && 'Français'}
                    {langCode === 'es' && 'Español'}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="nav-account dropdown-trigger">
              <Link to="/account" className="icon-btn nav-avatar-btn touch-target" aria-label="User Account">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="nav-avatar-img" />
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </Link>
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-name">{user?.firstName} {user?.lastName}</span>
                  <span className="dropdown-email">{user?.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/account" className="dropdown-item"><User size={16} /> {t.nav.consumerDashboard}</Link>
                <Link to="/provider" className="dropdown-item" style={{ color: 'var(--color-primary-navy)', fontWeight: 600 }}>
                  <Briefcase size={16} /> {t.nav.providerWorkspace}
                </Link>
                <Link to="/admin" className="dropdown-item" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                  <Shield size={16} /> {t.nav.operationsConsole}
                </Link>
                <Link to="/account/favorites" className="dropdown-item"><Heart size={16} /> {t.nav.favorites}</Link>
                <Link to="/account/messages" className="dropdown-item"><MessageSquare size={16} /> {t.nav.messages}</Link>
                <Link to="/account/transactions" className="dropdown-item"><CreditCard size={16} /> {t.nav.transactions}</Link>
                <Link to="/account/settings" className="dropdown-item"><Settings size={16} /> {t.nav.settings}</Link>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item text-error"><LogOut size={16} /> {t.nav.signOut}</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary">{t.nav.signIn}</Link>
          )}

          <Link to="/provider/properties/new" className="btn btn-primary nav-list-btn">{t.nav.listProperty}</Link>
        </div>

        <button 
          className="mobile-menu-trigger mobile-only touch-target" 
          aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Purpose-Built Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="mobile-drawer-header">
              <Link to="/" className="brand-mark" onClick={() => setIsMobileMenuOpen(false)}>AUREMONT</Link>
              <button 
                className="icon-btn touch-target" 
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Navigation Menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Language Switcher in Mobile Drawer */}
              <div className="mobile-drawer-lang-selector">
                <span className="mobile-section-label">Language / Langue</span>
                <div className="mobile-lang-pills">
                  {(['en', 'fr', 'es'] as const).map(langCode => (
                    <button
                      key={langCode}
                      className={`mobile-lang-pill ${language === langCode ? 'active' : ''}`}
                      onClick={() => setLanguage(langCode as Language)}
                    >
                      {langCode === 'en' && 'English'}
                      {langCode === 'fr' && 'Français'}
                      {langCode === 'es' && 'Español'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mobile-drawer-divider"></div>

              {/* AI Concierge Trigger in Mobile Drawer */}
              <button 
                className="mobile-concierge-banner-btn"
                onClick={handleOpenConcierge}
              >
                <div className="mobile-concierge-icon-wrap">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="mobile-concierge-title">{t.concierge.title}</div>
                  <div className="mobile-concierge-sub">{t.concierge.status}</div>
                </div>
              </button>

              <div className="mobile-drawer-divider"></div>

              <div className="mobile-drawer-section">
                <span className="mobile-section-label">{t.footer.marketplace}</span>
                <Link to="/buy" className="mobile-nav-link">{t.nav.buy}</Link>
                <Link to="/rent" className="mobile-nav-link">{t.nav.rent}</Link>
                <Link to="/lease" className="mobile-nav-link">{t.nav.lease}</Link>
                <Link to="/cars" className="mobile-nav-link">{t.nav.cars}</Link>
                <Link to="/explore" className="mobile-nav-link">{t.nav.explore}</Link>
              </div>

              <div className="mobile-drawer-divider"></div>

              <div className="mobile-drawer-section">
                <span className="mobile-section-label">Providers & Governance</span>
                <Link to="/provider/properties/new" className="mobile-nav-link highlight">
                  <PlusCircle size={18} /> {t.nav.listProperty}
                </Link>
                <Link to="/provider" className="mobile-nav-link">
                  <Briefcase size={18} /> {t.nav.providerWorkspace}
                </Link>
                <Link to="/admin" className="mobile-nav-link" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                  <Shield size={18} /> {t.nav.operationsConsole}
                </Link>
              </div>

              <div className="mobile-drawer-divider"></div>

              <div className="mobile-drawer-section">
                <span className="mobile-section-label">Account & Security</span>
                {isAuthenticated ? (
                  <>
                    <div className="mobile-user-card">
                      <div className="mobile-user-avatar">
                        {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <User size={20} />}
                      </div>
                      <div className="mobile-user-info">
                        <span className="mobile-user-name">{user?.firstName} {user?.lastName}</span>
                        <span className="mobile-user-email">{user?.email}</span>
                      </div>
                    </div>
                    <Link to="/account" className="mobile-nav-link"><User size={16} /> {t.nav.consumerDashboard}</Link>
                    <Link to="/account/favorites" className="mobile-nav-link"><Heart size={16} /> {t.nav.favorites}</Link>
                    <Link to="/account/messages" className="mobile-nav-link"><MessageSquare size={16} /> {t.nav.messages}</Link>
                    <Link to="/account/transactions" className="mobile-nav-link"><CreditCard size={16} /> {t.nav.transactions}</Link>
                    <Link to="/account/settings" className="mobile-nav-link"><Settings size={16} /> {t.nav.settings}</Link>
                    <button onClick={logout} className="mobile-nav-link text-error">
                      <LogOut size={16} /> {t.nav.signOut}
                    </button>
                  </>
                ) : (
                  <div className="mobile-auth-actions">
                    <Link to="/login" className="btn btn-primary w-full">{t.nav.signIn}</Link>
                    <Link to="/register" className="btn btn-secondary w-full" style={{ marginTop: 'var(--space-2)' }}>
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

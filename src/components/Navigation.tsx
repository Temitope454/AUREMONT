import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Settings, Heart, MessageSquare, Briefcase, PlusCircle, Sparkles, Globe } from 'lucide-react';
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
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === '/';

  // Automatically close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);

  // Click outside and Escape key to close account dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            <div className="nav-account dropdown-trigger" ref={accountRef}>
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="icon-btn nav-avatar-btn touch-target" 
                aria-label="User Account Menu"
                aria-expanded={isAccountOpen}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="nav-avatar-img" />
                ) : (
                  <span className="nav-avatar-initial">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
              </button>
              {isAccountOpen && (
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.firstName} {user?.lastName}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/account" className="dropdown-item" onClick={() => setIsAccountOpen(false)} role="menuitem">
                    <User size={16} /> <span>Account</span>
                  </Link>
                  <Link to="/account/favorites" className="dropdown-item" onClick={() => setIsAccountOpen(false)} role="menuitem">
                    <Heart size={16} /> <span>Favorites</span>
                  </Link>
                  <Link to="/account/messages" className="dropdown-item" onClick={() => setIsAccountOpen(false)} role="menuitem">
                    <MessageSquare size={16} /> <span>Messages</span>
                  </Link>
                  <Link to="/account/settings" className="dropdown-item" onClick={() => setIsAccountOpen(false)} role="menuitem">
                    <Settings size={16} /> <span>Settings</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  {user?.providerRole ? (
                    <Link to="/provider" className="dropdown-item" onClick={() => setIsAccountOpen(false)} role="menuitem">
                      <Briefcase size={16} /> <span>Provider Workspace</span>
                    </Link>
                  ) : (
                    <Link to="/provider/properties/new" className="dropdown-item" onClick={() => setIsAccountOpen(false)} role="menuitem">
                      <PlusCircle size={16} /> <span>List a property</span>
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={() => { logout(); setIsAccountOpen(false); }} 
                    className="dropdown-item text-error"
                    role="menuitem"
                  >
                    <LogOut size={16} /> <span>Sign out</span>
                  </button>
                </div>
              )}
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
                <span className="mobile-section-label">Partners & Listing</span>
                <Link to="/provider/properties/new" className="mobile-nav-link highlight">
                  <PlusCircle size={18} /> {t.nav.listProperty}
                </Link>
                {user?.providerRole && (
                  <Link to="/provider" className="mobile-nav-link">
                    <Briefcase size={18} /> {t.nav.providerWorkspace}
                  </Link>
                )}
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
                    <Link to="/account" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}><User size={16} /> {t.nav.consumerDashboard}</Link>
                    <Link to="/account/favorites" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}><Heart size={16} /> {t.nav.favorites}</Link>
                    <Link to="/account/messages" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}><MessageSquare size={16} /> {t.nav.messages}</Link>
                    <Link to="/account/settings" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}><Settings size={16} /> {t.nav.settings}</Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mobile-nav-link text-error">
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

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Settings, CreditCard, Heart, MessageSquare, Briefcase, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  return (
    <header className={`navigation ${isHome ? 'nav-transparent' : 'nav-solid'}`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand-mark" aria-label="Auremont Home">AUREMONT</Link>
          <nav className="nav-links desktop-only" aria-label="Primary Marketplace">
            <Link to="/search?mode=buy">Buy</Link>
            <Link to="/search?mode=rent">Rent</Link>
            <Link to="/search?mode=lease">Lease</Link>
            <Link to="/cars">Cars</Link>
          </nav>
        </div>
        
        <div className="nav-right desktop-only">
          <Link to="/search">Explore</Link>
          <Link to="/search" className="icon-btn touch-target" aria-label="Search Marketplace">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          
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
                <Link to="/account" className="dropdown-item"><User size={16} /> Consumer Dashboard</Link>
                <Link to="/provider" className="dropdown-item" style={{ color: 'var(--color-primary-navy)', fontWeight: 600 }}>
                  <Briefcase size={16} /> Provider Workspace
                </Link>
                <Link to="/account/favorites" className="dropdown-item"><Heart size={16} /> Favorites</Link>
                <Link to="/account/messages" className="dropdown-item"><MessageSquare size={16} /> Messages</Link>
                <Link to="/account/transactions" className="dropdown-item"><CreditCard size={16} /> Transactions</Link>
                <Link to="/account/settings" className="dropdown-item"><Settings size={16} /> Settings</Link>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item text-error"><LogOut size={16} /> Sign out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary">Sign in</Link>
          )}

          <Link to="/provider/properties/new" className="btn btn-primary nav-list-btn">List Property</Link>
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
              <div className="mobile-drawer-section">
                <span className="mobile-section-label">Marketplace</span>
                <Link to="/search?mode=buy" className="mobile-nav-link">Buy Property</Link>
                <Link to="/search?mode=rent" className="mobile-nav-link">Rent Property</Link>
                <Link to="/search?mode=lease" className="mobile-nav-link">Commercial Lease</Link>
                <Link to="/cars" className="mobile-nav-link">Auremont Mobility (Cars)</Link>
                <Link to="/search" className="mobile-nav-link">Explore All Listings</Link>
              </div>

              <div className="mobile-drawer-divider"></div>

              <div className="mobile-drawer-section">
                <span className="mobile-section-label">Providers</span>
                <Link to="/provider/properties/new" className="mobile-nav-link highlight">
                  <PlusCircle size={18} /> List Your Property
                </Link>
                <Link to="/provider" className="mobile-nav-link">
                  <Briefcase size={18} /> Provider Workspace
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
                    <Link to="/account" className="mobile-nav-link"><User size={16} /> Consumer Dashboard</Link>
                    <Link to="/account/favorites" className="mobile-nav-link"><Heart size={16} /> Saved Favorites</Link>
                    <Link to="/account/transactions" className="mobile-nav-link"><CreditCard size={16} /> Transactions</Link>
                    <Link to="/account/settings" className="mobile-nav-link"><Settings size={16} /> Account Settings</Link>
                    <button onClick={logout} className="mobile-nav-link text-error">
                      <LogOut size={16} /> Sign out
                    </button>
                  </>
                ) : (
                  <div className="mobile-auth-actions">
                    <Link to="/login" className="btn btn-primary w-full">Sign in</Link>
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


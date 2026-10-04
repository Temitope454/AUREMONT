import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, LogOut, Settings, CreditCard, Heart, MessageSquare, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isHome = location.pathname === '/';

  return (
    <header className={`navigation ${isHome ? 'nav-transparent' : 'nav-solid'}`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand-mark">AUREMONT</Link>
          <nav className="nav-links desktop-only">
            <Link to="/search?mode=buy">Buy</Link>
            <Link to="/search?mode=rent">Rent</Link>
            <Link to="/search?mode=lease">Lease</Link>
            <Link to="/search?mode=cars">Cars</Link>
          </nav>
        </div>
        
        <div className="nav-right desktop-only">
          <Link to="/explore">Explore</Link>
          <Link to="/about">About</Link>
          <button className="icon-btn" aria-label="Search">
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          {isAuthenticated ? (
            <div className="nav-account dropdown-trigger">
              <Link to="/account" className="icon-btn nav-avatar-btn" aria-label="Account">
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

          <Link to="/provider/properties/new" className="btn btn-primary" style={{ marginLeft: '8px' }}>List Property</Link>
        </div>

        <button className="mobile-menu-trigger mobile-only" aria-label="Menu">
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

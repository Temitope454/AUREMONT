import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Heart, Search, Clock, MessageSquare, Calendar, CreditCard, Bell, User, Settings, LogOut } from 'lucide-react';
import './AccountLayout.css';

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/account', label: 'Overview', icon: Home, exact: true },
    { to: '/account/favorites', label: 'Favorites', icon: Heart },
    { to: '/account/saved-searches', label: 'Saved searches', icon: Search },
    { to: '/account/recent', label: 'Recently viewed', icon: Clock },
    { to: '/account/messages', label: 'Messages', icon: MessageSquare },
    { to: '/account/bookings', label: 'Bookings & Viewings', icon: Calendar },
    { to: '/account/transactions', label: 'Transactions', icon: CreditCard },
    { to: '/account/notifications', label: 'Notifications', icon: Bell },
  ];

  const settingsItems = [
    { to: '/account/profile', label: 'Profile', icon: User },
    { to: '/account/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="account-page">
      <div className="account-container container">
        
        {/* Desktop Sidebar Rail */}
        <aside className="account-sidebar desktop-only">
          <div className="account-user-card">
            <div className="account-avatar">{user?.firstName.charAt(0)}</div>
            <div>
              <div className="account-name">{user?.firstName} {user?.lastName}</div>
              <div className="account-email">{user?.email}</div>
            </div>
          </div>
          
          <nav className="account-nav">
            <div className="nav-group">
              {navItems.map(item => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  end={item.exact}
                  className={({isActive}) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="nav-divider"></div>
            
            <div className="nav-group">
              {settingsItems.map(item => (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  className={({isActive}) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button className="account-nav-item text-error" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Horizontal Navigation (Purpose Built) */}
        <nav className="mobile-account-nav mobile-only" aria-label="Account Subnavigation">
          <div className="mobile-nav-scroll">
            {navItems.map(item => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.exact}
                className={({isActive}) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            {settingsItems.map(item => (
              <NavLink 
                key={item.to} 
                to={item.to}
                className={({isActive}) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <button className="mobile-nav-item text-error" onClick={handleLogout} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              Sign out
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="account-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


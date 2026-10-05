import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  Heart, 
  Search, 
  Clock, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Bell, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import './AccountLayout.css';

interface AccountNavItem {
  to: string;
  label: string;
  icon: any;
  exact?: boolean;
}

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const primaryItems: AccountNavItem[] = [
    { to: '/account', label: 'Overview', icon: Compass, exact: true },
    { to: '/account/favorites', label: 'Favorites', icon: Heart },
    { to: '/account/saved-searches', label: 'Saved searches', icon: Search },
    { to: '/account/recent', label: 'Recently viewed', icon: Clock },
  ];

  const activityItems: AccountNavItem[] = [
    { to: '/account/messages', label: 'Messages', icon: MessageSquare },
    { to: '/account/bookings', label: 'Viewings', icon: Calendar },
    { to: '/account/transactions', label: 'Transactions', icon: CreditCard },
    { to: '/account/notifications', label: 'Notifications', icon: Bell },
  ];

  const personalItems: AccountNavItem[] = [
    { to: '/account/profile', label: 'Profile', icon: User },
    { to: '/account/settings', label: 'Settings', icon: Settings },
  ];

  const allItems: AccountNavItem[] = [...primaryItems, ...activityItems, ...personalItems];

  return (
    <div className="account-page">
      <div className="account-shell">
        {/* Desktop Sidebar (>=1024px) */}
        <aside className="account-sidebar" aria-label="Account Navigation">
          <div className="account-user-card">
            <div className="account-avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="account-user-meta">
              <span className="account-name">{user?.firstName} {user?.lastName}</span>
              <span className="account-email">{user?.email}</span>
            </div>
          </div>

          <nav className="account-nav">
            <div className="nav-section">
              <span className="nav-section-title">Primary</span>
              {primaryItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="nav-section">
              <span className="nav-section-title">Activity</span>
              {activityItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="nav-section">
              <span className="nav-section-title">Personal</span>
              {personalItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `account-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="nav-section-bottom">
              <button className="account-nav-item text-error" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Dedicated Account Navigation (<1024px) */}
        <nav className="mobile-account-subnav" aria-label="Mobile Account Subnavigation">
          <div className="mobile-subnav-scroll">
            {allItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `mobile-subnav-pill ${isActive ? 'active' : ''}`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button 
              className="mobile-subnav-pill text-error" 
              onClick={handleLogout}
              style={{ border: '1px solid var(--color-border-limestone)', background: 'var(--color-surface-white)', cursor: 'pointer' }}
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="account-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

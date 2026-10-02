import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProviderLayout.css';
import { 
  Home, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut, 
  Plus, 
  Users, 
  CalendarCheck,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { ProviderProvider } from '../../context/ProviderContext';

function ProviderLayoutInner() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAgent = user?.providerRole === 'agent';
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/provider', icon: <LayoutDashboard size={20} /> },
    { label: 'Properties', path: '/provider/properties', icon: <Home size={20} /> },
    
    // Agent-specific
    ...(isAgent ? [
      { label: 'Leads', path: '/provider/leads', icon: <Users size={20} /> },
    ] : [
      // Landlord-specific
      { label: 'Requests', path: '/provider/requests', icon: <Users size={20} /> },
    ]),
    
    { label: 'Viewings', path: '/provider/viewings', icon: <CalendarCheck size={20} /> },
    { label: 'Messages', path: '/provider/messages', icon: <MessageSquare size={20} /> },
    { label: 'Transactions', path: '/provider/transactions', icon: <CreditCard size={20} /> },
    { label: 'Earnings', path: '/provider/earnings', icon: <Briefcase size={20} /> },
    { label: 'Profile', path: '/provider/profile', icon: <User size={20} /> },
    { label: 'Settings', path: '/provider/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="provider-layout">
      
      {/* Desktop Sidebar */}
      <aside className="provider-sidebar desktop-only">
        <div className="sidebar-header">
          <Link to="/" className="brand-mark">AUREMONT</Link>
          <div className="provider-badge">{isAgent ? 'Agent Workspace' : 'Landlord Workspace'}</div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/provider/properties/new" className="btn btn-primary w-full" style={{marginBottom: 'var(--space-6)'}}>
            <Plus size={16} /> Add property
          </Link>

          {navItems.map(item => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/provider' && location.pathname.startsWith(item.path));
              
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="link-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="provider-identity">
            <div className="identity-avatar">
              <User size={16} />
            </div>
            <div className="identity-details">
              <div className="identity-name">{user?.firstName} {user?.lastName}</div>
              <div className="identity-role">{isAgent ? 'Agent' : 'Landlord'}</div>
            </div>
          </div>
          <button className="sidebar-link text-error w-full" onClick={handleLogout} style={{marginTop: 'var(--space-4)'}}>
            <span className="link-icon"><LogOut size={20} /></span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Nav (simplified) */}
      <nav className="provider-mobile-nav mobile-only">
        <div className="mobile-header">
           <Link to="/" className="brand-mark text-small">AUREMONT</Link>
           <div className="provider-badge text-meta">{isAgent ? 'Agent' : 'Landlord'}</div>
        </div>
        <div className="mobile-nav-scroll">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/provider' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="provider-main">
        <Outlet />
      </main>

    </div>
  );
}

export default function ProviderLayout() {
  return (
    <ProviderProvider>
      <ProviderLayoutInner />
    </ProviderProvider>
  );
}

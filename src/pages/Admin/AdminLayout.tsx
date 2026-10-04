import { NavLink, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ShieldCheck, 
  Percent, 
  Users, 
  FileText, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { metrics } = useAdmin();

  return (
    <div className="admin-layout">
      {/* Top Operations Header Strip */}
      <div className="admin-topbar">
        <div className="admin-container admin-topbar-inner">
          <div className="admin-topbar-left">
            <span className="admin-tag">GOVERNANCE & OPERATIONS</span>
            <span className="admin-topbar-divider">/</span>
            <span className="admin-status-indicator">
              <span className="pulse-dot"></span>
              Live Sync Active
            </span>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-officer-pill">
              <span className="officer-initials">ER</span>
              <span className="officer-label">Elena Rostova</span>
              <span className="officer-badge">Compliance Director</span>
            </div>
            <Link to="/provider" className="admin-switch-link">
              Provider Mode <ExternalLink size={12} />
            </Link>
            <Link to="/" className="admin-switch-link">
              Public Site <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Admin Work Area */}
      <div className="admin-container admin-main-shell">
        <aside className="admin-sidebar" aria-label="Operations Navigation">
          <div className="admin-sidebar-header">
            <h2 className="admin-sidebar-title">Operations Console</h2>
            <p className="admin-sidebar-subtitle">Supervisory & Editorial Oversight</p>
          </div>

          <nav className="admin-nav-list">
            <NavLink 
              to="/admin" 
              end 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span className="nav-label">Executive Overview</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>

            <NavLink 
              to="/admin/listings" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <CheckSquare size={18} />
              <span className="nav-label">Listing Moderation</span>
              {metrics.pendingListingsCount > 0 && (
                <span className="admin-counter-badge">{metrics.pendingListingsCount}</span>
              )}
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>

            <NavLink 
              to="/admin/verifications" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <ShieldCheck size={18} />
              <span className="nav-label">Provider KYC</span>
              {metrics.pendingKYCCount > 0 && (
                <span className="admin-counter-badge">{metrics.pendingKYCCount}</span>
              )}
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>

            <NavLink 
              to="/admin/commissions" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Percent size={18} />
              <span className="nav-label">Commission Policy</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>

            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={18} />
              <span className="nav-label">User Governance</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>

            <NavLink 
              to="/admin/audit" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span className="nav-label">Regulatory Audit Log</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>
          </nav>

          <div className="admin-sidebar-footer">
            <div className="compliance-stamp">
              <span className="stamp-title">REGULATORY JURISDICTION</span>
              <span className="stamp-desc">EU Real Estate Directive & UK RICS Compliance Standard 2026</span>
            </div>
          </div>
        </aside>

        {/* Content Outlet */}
        <section className="admin-content-pane">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

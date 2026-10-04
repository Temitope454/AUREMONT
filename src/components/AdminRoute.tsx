import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, ArrowRight, UserCheck } from 'lucide-react';
import './AdminRoute.css';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isAdminDemoMode, setIsAdminDemoMode] = useState(false);

  // Check if current user is an admin or in admin session mode
  const isAdmin = isAdminDemoMode || (isAuthenticated && (user?.email?.toLowerCase().includes('admin') || user?.providerRole === null && user?.firstName === 'Elena'));

  const handleEnterAdminMode = () => {
    // Elevate current user session or establish Elena Rostova admin persona
    if (!isAuthenticated) {
      updateUser({
        id: 'usr_admin_elena',
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'admin@auremont.com',
        language: 'en'
      });
    }
    setIsAdminDemoMode(true);
  };

  if (!isAdmin) {
    return (
      <div className="admin-gate-page">
        <div className="admin-gate-card">
          <div className="admin-gate-badge">
            <Lock size={16} /> Restricted Portal
          </div>
          <h1 className="h2 admin-gate-title">Operations & Governance</h1>
          <p className="admin-gate-desc">
            This administrative workspace is reserved for Auremont Compliance Directors, Listing Curators, and Financial Controllers.
          </p>

          <div className="admin-gate-credentials-box">
            <div className="compliance-officer-info">
              <ShieldCheck size={28} className="shield-icon" />
              <div>
                <div className="officer-name">Elena Rostova</div>
                <div className="officer-title">Director of Compliance & Editorial Review</div>
                <div className="officer-meta">Auremont Global Holdings · Geneva & Paris</div>
              </div>
            </div>
          </div>

          <div className="admin-gate-actions">
            <button 
              onClick={handleEnterAdminMode} 
              className="btn btn-primary w-full"
              style={{ height: '52px', fontSize: '15px' }}
            >
              <UserCheck size={18} /> Enter Admin Workspace as Elena Rostova <ArrowRight size={16} />
            </button>
            <a href="/" className="btn btn-secondary w-full text-center">
              Return to Public Marketplace
            </a>
          </div>

          <p className="admin-gate-footer-note">
            All administrative actions, listing approvals, and commission changes are immutably logged for regulatory audit compliance.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

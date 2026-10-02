import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProviderEntry.css';
import { ArrowRight, Key, Home as HomeIcon } from 'lucide-react';

export default function ProviderEntry() {
  const { loginAsProvider } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<'agent' | 'landlord' | null>(null);

  const handleLogin = async (role: 'agent' | 'landlord') => {
    setLoadingRole(role);
    await loginAsProvider(role);
    navigate('/provider/onboarding', { replace: true });
  };

  return (
    <div className="provider-entry-page">
      <div className="provider-entry-container">
        
        <div className="entry-header">
          <h1 className="h2">Auremont Provider Platform</h1>
          <p className="large">The operational workspace for verified agents and landlords.</p>
        </div>

        <div className="role-selection-grid">
          
          <div className="role-card">
            <div className="role-icon">
              <Key size={24} strokeWidth={1.5} />
            </div>
            <h3 className="h4">Agent</h3>
            <p className="text-meta">Manage listings, viewings, leads, and sales commissions.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => handleLogin('agent')}
              disabled={loadingRole !== null}
            >
              {loadingRole === 'agent' ? 'Entering...' : 'Enter as Agent'} <ArrowRight size={16} />
            </button>
          </div>

          <div className="role-card">
            <div className="role-icon">
              <HomeIcon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="h4">Landlord</h3>
            <p className="text-meta">Manage rental properties, availability, and rental requests.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => handleLogin('landlord')}
              disabled={loadingRole !== null}
            >
              {loadingRole === 'landlord' ? 'Entering...' : 'Enter as Landlord'} <ArrowRight size={16} />
            </button>
          </div>

        </div>

        <div className="entry-footer">
          <p className="text-small text-meta" style={{color: 'var(--color-text-ash)'}}>
            Demo mode: This grants immediate access to the mock provider environment without completing the multi-step verification process.
          </p>
        </div>

      </div>
    </div>
  );
}

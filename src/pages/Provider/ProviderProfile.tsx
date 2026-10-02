import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

export default function ProviderProfile() {
  const { user } = useAuth();
  const isAgent = user?.providerRole === 'agent';

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Profile</h1>
        <p className="text-meta">Manage your public presence and professional biography.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ padding: 'var(--space-8)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--color-bg-sand)', margin: '0 auto var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={48} color="var(--color-primary-navy)" />
            </div>
            <h2 className="h4" style={{ marginBottom: '4px' }}>{user?.firstName} {user?.lastName}</h2>
            <p className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-4)' }}>{isAgent ? 'Licensed Agent' : 'Verified Landlord'}</p>
            <button className="btn btn-secondary w-full">Change Photo</button>
          </div>
        </div>
        
        <div style={{ flex: '2 1 400px' }}>
          <div className="form-grid">
            <div className="input-group">
              <label>First Name</label>
              <input type="text" className="input-field" defaultValue={user?.firstName} />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" className="input-field" defaultValue={user?.lastName} />
            </div>
            <div className="input-group form-full">
              <label>Professional Biography</label>
              <textarea className="input-field" style={{ height: '120px' }} defaultValue="Specializing in luxury apartments and heritage properties." />
            </div>
            <div className="input-group form-full">
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

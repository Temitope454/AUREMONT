import { useState } from 'react';
import { Crown, CheckCircle2 } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import './Profile.css';

export default function Profile() {
  const { profile, updateProfile } = useConsumerState();
  const [formData, setFormData] = useState({ ...profile });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setToastMessage('VIP Client dossier updated successfully.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3">Client Profile & Investment Dossier</h1>
        <p className="text-meta">Manage your accredited investor profile, wealth entity structures, and private concierge preferences.</p>
      </div>

      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) var(--space-6) 0' }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="panel-body">
        {/* VIP Membership Card */}
        <div className="vip-membership-banner">
          <div className="vip-crest-wrap">
            <Crown size={24} className="vip-crown-icon" />
          </div>
          <div className="vip-meta">
            <span className="vip-tier-tag">{profile.membershipTier}</span>
            <h2 className="vip-client-name">{profile.firstName} {profile.lastName}</h2>
            <span className="vip-member-id">Accreditation ID: {profile.memberId} · Geneva Clearing Approved</span>
          </div>
          <div className="vip-status-badge">
            <span className="dot-active"></span> Verified HNW Investor
          </div>
        </div>

        {/* Profile Editor Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <h3 className="section-title">Identity & Private Communications</h3>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Confidential Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Encrypted Mobile / WhatsApp</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Legal Nationality</label>
              <input 
                type="text" 
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Primary Residence Metropolis</label>
              <select 
                value={formData.preferredCity}
                onChange={e => setFormData({ ...formData, preferredCity: e.target.value })}
              >
                <option value="Paris & Geneva">Paris & Geneva Corridor</option>
                <option value="London Mayfair">London Mayfair / Prime Central</option>
                <option value="Madrid Salamanca">Madrid Salamanca</option>
                <option value="Milan Quadrilatero">Milan Quadrilatero</option>
                <option value="Dubai Palm Jumeirah">Dubai Palm Jumeirah / DIFC</option>
                <option value="Monaco Carré d'Or">Monaco Carré d'Or</option>
                <option value="New York Manhattan">New York Manhattan</option>
              </select>
            </div>
          </div>

          <div className="form-divider"></div>

          <h3 className="section-title">Institutional Acquisition Profile</h3>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Acquisition Entity Structure</label>
              <select 
                value={formData.buyerType}
                onChange={e => setFormData({ ...formData, buyerType: e.target.value as any })}
              >
                <option value="Individual HNW">Individual High-Net-Worth</option>
                <option value="Family Office">Single / Multi-Family Office</option>
                <option value="SPV Corporate">Special Purpose Vehicle (SPV / SCI)</option>
                <option value="Trust Foundation">Discretionary Trust / Private Foundation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Capital Allocation (Acquisition Budget)</label>
              <select 
                value={formData.acquisitionBudget}
                onChange={e => setFormData({ ...formData, acquisitionBudget: e.target.value })}
              >
                <option value="€2,000,000 – €5,000,000">€2,000,000 – €5,000,000</option>
                <option value="€5,000,000 – €15,000,000">€5,000,000 – €15,000,000</option>
                <option value="€15,000,000 – €50,000,000">€15,000,000 – €50,000,000 (Trophy Assets)</option>
                <option value="Sovereign > €50,000,000">Sovereign Tier &gt; €50,000,000</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Investment Horizon & Strategic Mandate</label>
            <textarea 
              rows={3}
              value={formData.investmentHorizon}
              onChange={e => setFormData({ ...formData, investmentHorizon: e.target.value })}
              placeholder="e.g. Capital preservation, prime residential tenancy yield (5-10 years), heritage generational transfer..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Private Dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

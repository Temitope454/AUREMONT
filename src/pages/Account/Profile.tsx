import { useState } from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import './Profile.css';

export default function Profile() {
  const { profile, updateProfile } = useConsumerState();
  const [formData, setFormData] = useState({ ...profile });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setToastMessage('Profile details updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3">Account Profile</h1>
        <p className="text-meta">Manage your personal contact details and marketplace preferences.</p>
      </div>

      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="panel-body">
        {/* Profile Card Header */}
        <div className="profile-identity-card">
          <div className="profile-avatar-wrap">
            <User size={24} />
          </div>
          <div className="profile-identity-meta">
            <h2 className="profile-user-name">{formData.firstName} {formData.lastName}</h2>
            <span className="profile-user-email">{formData.email}</span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <h3 className="section-title">Contact Information</h3>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="profile-first-name">First Name</label>
              <input 
                id="profile-first-name"
                type="text" 
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-last-name">Last Name</label>
              <input 
                id="profile-last-name"
                type="text" 
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="profile-email">Email Address</label>
              <input 
                id="profile-email"
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-phone">Phone Number</label>
              <input 
                id="profile-phone"
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-divider"></div>

          <h3 className="section-title">Discovery Preferences</h3>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="profile-nationality">Nationality / Country of Residence</label>
              <input 
                id="profile-nationality"
                type="text" 
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="e.g. French, British, American"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-city">Primary City of Interest</label>
              <select 
                id="profile-city"
                value={formData.preferredCity}
                onChange={e => setFormData({ ...formData, preferredCity: e.target.value })}
              >
                <option value="Paris">Paris, France</option>
                <option value="London">London, United Kingdom</option>
                <option value="Madrid">Madrid, Spain</option>
                <option value="Lisbon">Lisbon, Portugal</option>
                <option value="Milan">Milan, Italy</option>
                <option value="Dubai">Dubai, UAE</option>
                <option value="New York">New York, USA</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="profile-buyer-type">Preferred Category</label>
              <select 
                id="profile-buyer-type"
                value={formData.buyerType}
                onChange={e => setFormData({ ...formData, buyerType: e.target.value as any })}
              >
                <option value="Residential Buyer">Residential Acquisition</option>
                <option value="Tenant">Long-Term Tenancy / Rental</option>
                <option value="Commercial">Commercial / Mixed-Use Lease</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="profile-budget">Estimated Budget</label>
              <select 
                id="profile-budget"
                value={formData.acquisitionBudget}
                onChange={e => setFormData({ ...formData, acquisitionBudget: e.target.value })}
              >
                <option value="Up to €2,000,000">Up to €2,000,000</option>
                <option value="€2,000,000 – €5,000,000">€2,000,000 – €5,000,000</option>
                <option value="€5,000,000 – €10,000,000">€5,000,000 – €10,000,000</option>
                <option value="Over €10,000,000">Over €10,000,000</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="profile-horizon">Property Requirements & Notes</label>
            <textarea 
              id="profile-horizon"
              rows={3}
              value={formData.investmentHorizon}
              onChange={e => setFormData({ ...formData, investmentHorizon: e.target.value })}
              placeholder="Specify preferred neighborhoods, architectural styles, minimum bedrooms, or requirements..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

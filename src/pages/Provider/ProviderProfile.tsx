import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProviderState } from '../../context/ProviderContext';
import { User, ShieldCheck, Eye, Save, Check, Mail, Phone, MapPin, Lock } from 'lucide-react';

export default function ProviderProfile() {
  const { user, updateUser } = useAuth();
  const { properties } = useProviderState();
  const isAgent = user?.providerRole === 'agent';

  const [firstName, setFirstName] = useState(user?.firstName || 'Sarah');
  const [lastName, setLastName] = useState(user?.lastName || 'Jenkins');
  const [agencyName, setAgencyName] = useState(isAgent ? 'Jenkins Architectural Properties' : 'Alvarez Heritage Holdings');
  const [bio, setBio] = useState('Specializing in high-end European historic estates, modernist residences, and prime central urban apartments.');
  const [publicPhone, setPublicPhone] = useState('+33 1 42 68 55 00');
  const [publicEmail, setPublicEmail] = useState(user?.email || 'contact@auremont.demo');
  const [isSaved, setIsSaved] = useState(false);
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      firstName,
      lastName
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const publishedProperties = properties.filter(p => p.status === 'published');

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Provider Profile</h1>
          <p className="text-meta">Manage your public representation, credentials, and customer contact information.</p>
        </div>
        <button 
          onClick={() => setShowPublicPreview(!showPublicPreview)} 
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Eye size={16} /> {showPublicPreview ? 'Return to Editor' : 'Preview Public Profile'}
        </button>
      </div>

      {showPublicPreview ? (
        /* Public Profile Preview Mode */
        <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* Header Banner */}
          <div style={{ backgroundColor: 'var(--color-primary-navy)', padding: 'var(--space-8) var(--space-6)', color: '#fff', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--color-bg-sand)', margin: '0 auto var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff' }}>
              <User size={40} color="var(--color-primary-navy)" />
            </div>
            <h2 className="h3" style={{ margin: '0 0 4px 0', color: '#fff' }}>{firstName} {lastName}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '3px 12px', borderRadius: '14px', marginTop: '6px' }}>
              <ShieldCheck size={14} color="var(--color-success-forest)" />
              {isAgent ? 'Licensed Auremont Agent' : 'Verified Auremont Landlord'}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>{agencyName}</div>
          </div>

          {/* Privacy Note */}
          <div style={{ padding: 'var(--space-3) var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', borderBottom: '1px solid var(--color-border-limestone)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Lock size={14} color="var(--color-success-forest)" />
            <span className="text-meta" style={{ fontSize: '12px', color: 'var(--color-text-slate)' }}>
              Public Profile Privacy Enforced: Internal earnings, fee commissions, KYC documents, and private passwords are never exposed.
            </span>
          </div>

          <div style={{ padding: 'var(--space-8)' }}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h3 className="h5" style={{ marginBottom: 'var(--space-2)' }}>Professional Biography</h3>
              <p className="large" style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>{bio}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-sand)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Phone size={16} color="var(--color-primary-navy)" />
                <span className="text-small">{publicPhone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Mail size={16} color="var(--color-primary-navy)" />
                <span className="text-small">{publicEmail}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={16} color="var(--color-primary-navy)" />
                <span className="text-small">European Prime Markets</span>
              </div>
            </div>

            {/* Published Listings Showcase */}
            <div>
              <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Represented Properties ({publishedProperties.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                {publishedProperties.map(prop => (
                  <div key={prop.id} style={{ border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={prop.mainImage} alt={prop.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: 'var(--space-3)' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{prop.title}</div>
                      <div className="text-meta" style={{ fontSize: '12px', marginTop: '2px' }}>{prop.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Profile Mode */
        <form onSubmit={handleSave} style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-bg-sand)', margin: '0 auto var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={44} color="var(--color-primary-navy)" />
              </div>
              <h2 className="h4" style={{ marginBottom: '4px' }}>{firstName} {lastName}</h2>
              <p className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-4)' }}>
                {isAgent ? 'Licensed Agent' : 'Verified Landlord'}
              </p>
              <button type="button" onClick={() => alert('Photo upload simulation.')} className="btn btn-secondary w-full text-small">
                Change Profile Photo
              </button>
            </div>
          </div>
          
          <div style={{ flex: '2 1 450px' }}>
            <div style={{ backgroundColor: 'var(--color-surface-white)', padding: 'var(--space-6)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
              <h2 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Professional Details</h2>
              <div className="form-grid">
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
                <div className="input-group form-full">
                  <label>Business / Agency Name</label>
                  <input type="text" className="input-field" value={agencyName} onChange={e => setAgencyName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Public Inquiry Phone</label>
                  <input type="tel" className="input-field" value={publicPhone} onChange={e => setPublicPhone(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Public Inquiries Email</label>
                  <input type="email" className="input-field" value={publicEmail} onChange={e => setPublicEmail(e.target.value)} />
                </div>
                <div className="input-group form-full">
                  <label>Professional Editorial Biography</label>
                  <textarea 
                    className="input-field" 
                    style={{ height: '110px' }} 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                  />
                </div>
                <div className="input-group form-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={16} /> Save Profile
                  </button>
                  {isSaved && (
                    <span style={{ color: 'var(--color-success-forest)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} /> Profile changes saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

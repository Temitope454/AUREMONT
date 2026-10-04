import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, FileText } from 'lucide-react';

export default function ProviderOnboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isAgent = user?.providerRole === 'agent';
  
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'not_started' | 'submitted'>('not_started');
  const [docUploaded, setDocUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    businessName: isAgent ? 'Jenkins Real Estate' : '',
    email: user?.email || '',
    phone: '+33 1 42 68 55 00',
    markets: isAgent ? 'Paris, London, Milan' : 'Madrid, Spain',
    bio: 'Professional prime property provider specializing in luxury European inventory.'
  });

  const handleStep1Continue = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setErrorMsg('Please complete required profile fields.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleSubmit = () => {
    if (!docUploaded) {
      setErrorMsg('Please upload a copy of your identification document to proceed.');
      return;
    }
    setErrorMsg('');
    setStatus('submitted');
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      providerVerificationStatus: 'under_review' // Explicitly "under_review", NOT "verified"
    });

    setTimeout(() => {
      navigate('/provider');
    }, 2200);
  };

  if (status === 'submitted') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 'var(--space-6)' }}>
        <CheckCircle2 size={52} color="var(--color-success-forest)" style={{ marginBottom: 'var(--space-4)' }} />
        <h1 className="h2" style={{ marginBottom: 'var(--space-2)' }}>Onboarding Documentation Submitted</h1>
        <p className="large" style={{ color: 'var(--color-text-slate)', maxWidth: '520px', lineHeight: 1.6 }}>
          Your profile and credentials have entered the compliance queue. Status: <strong>Under Review</strong>. You are being redirected to your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="provider-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">{isAgent ? 'Agent Onboarding' : 'Landlord Onboarding'}</h1>
        <p className="text-meta">Step {step} of 2: {step === 1 ? 'Professional Profile' : 'Identity Verification'}</p>
      </div>

      {errorMsg && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'rgba(217, 83, 79, 0.1)', border: '1px solid var(--color-error-brick)', borderRadius: 'var(--radius-md)', color: 'var(--color-error-brick)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-6)' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {step === 1 && (
        <div className="onboarding-step">
          <h2 className="h4" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>1. Profile Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">First Name *</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.firstName} 
                onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">Last Name *</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.lastName} 
                onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))} 
              />
            </div>

            {isAgent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
                <label className="text-meta">Professional Agency / Business Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.businessName}
                  onChange={e => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g. Jenkins Real Estate Partners" 
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">Email *</label>
              <input 
                type="email" 
                className="input-field" 
                value={formData.email} 
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">Phone</label>
              <input 
                type="tel" 
                className="input-field" 
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
              <label className="text-meta">{isAgent ? 'Primary Operating Markets' : 'Primary Property Location'}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.markets}
                onChange={e => setFormData(prev => ({ ...prev, markets: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
              <label className="text-meta">Professional Biography</label>
              <textarea 
                className="input-field" 
                style={{ height: '100px', padding: 'var(--space-3)' }} 
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
            <button className="btn btn-primary" onClick={handleStep1Continue} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Continue to Verification <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <h2 className="h4" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>2. Verification Documents</h2>
          
          <p className="text-meta" style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-slate)' }}>
            Verification documents required for compliance. File contents are encrypted and never stored insecurely in local browser storage.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Government ID *</h3>
              <p className="text-meta" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-slate)' }}>Passport, National Identity Card, or Commercial Registration.</p>
              
              {docUploaded ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', backgroundColor: 'rgba(52, 112, 87, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <FileText size={20} color="var(--color-success-forest)" />
                  <span className="text-small" style={{ fontWeight: 600, flex: 1, color: 'var(--color-success-forest)' }}>
                    government_id_passport_scan.pdf (Attached)
                  </span>
                  <button onClick={() => setDocUploaded(false)} className="btn btn-secondary text-small">Remove</button>
                </div>
              ) : (
                <div 
                  onClick={() => setDocUploaded(true)}
                  style={{ border: '2px dashed var(--color-border-limestone)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', cursor: 'pointer' }}
                >
                  <UploadCloud size={32} color="var(--color-primary-navy)" style={{ marginBottom: 'var(--space-2)' }} />
                  <div className="text-small" style={{ fontWeight: 500 }}>Click to attach mock Government ID</div>
                  <div className="text-meta" style={{ fontSize: '11px', color: 'var(--color-text-ash)', marginTop: '4px' }}>Simulated upload • Privacy preserved</div>
                </div>
              )}
            </div>

            {isAgent && (
              <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
                <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Professional Brokerage License</h3>
                <p className="text-meta" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-slate)' }}>Valid real estate licensing credential.</p>
                <div style={{ border: '2px dashed var(--color-border-limestone)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)' }}>
                  <div className="text-small">Optional at initial onboarding. Can be completed in Verification tab.</div>
                </div>
              </div>
            )}

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit for Verification
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

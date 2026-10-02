import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function ProviderOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAgent = user?.providerRole === 'agent';
  
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'not_started' | 'submitted'>('not_started');

  const handleSubmit = () => {
    setStatus('submitted');
    setTimeout(() => {
      navigate('/provider');
    }, 2000);
  };

  if (status === 'submitted') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <CheckCircle2 size={48} color="var(--color-success-forest)" style={{ marginBottom: 'var(--space-6)' }} />
        <h1 className="h2">Verification Submitted</h1>
        <p className="large" style={{ color: 'var(--color-text-slate)', maxWidth: '500px' }}>
          Your documents and profile are now under review. We will notify you once your {isAgent ? 'Agent' : 'Landlord'} account is fully verified.
        </p>
      </div>
    );
  }

  return (
    <div className="provider-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">{isAgent ? 'Agent Onboarding' : 'Landlord Onboarding'}</h1>
        <p className="text-meta">Complete your profile and provide verification documents for your market.</p>
      </div>

      {step === 1 && (
        <div className="onboarding-step">
          <h2 className="h4" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>1. Profile Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">First Name</label>
              <input type="text" className="input-field" defaultValue={user?.firstName} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">Last Name</label>
              <input type="text" className="input-field" defaultValue={user?.lastName} />
            </div>

            {isAgent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
                <label className="text-meta">Professional / Business Name</label>
                <input type="text" className="input-field" placeholder="e.g. Jenkins Real Estate" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">Email</label>
              <input type="email" className="input-field" defaultValue={user?.email} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="text-meta">Phone</label>
              <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
              <label className="text-meta">{isAgent ? 'Operating Markets' : 'Operating Location'}</label>
              <input type="text" className="input-field" placeholder={isAgent ? "e.g. Paris, London, Milan" : "e.g. Madrid, Spain"} />
            </div>

            {isAgent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
                <label className="text-meta">Languages Spoken</label>
                <input type="text" className="input-field" placeholder="e.g. English, French, Spanish" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
              <label className="text-meta">Professional Biography</label>
              <textarea className="input-field" style={{ height: '120px', padding: 'var(--space-3)' }} placeholder="Describe your experience and approach..."></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Verification</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <h2 className="h4" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>2. Verification Documents</h2>
          
          <p className="text-meta" style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-slate)' }}>
            Verification documents required for your market. These will not be shared publicly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Government ID</h3>
              <p className="text-meta" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-slate)' }}>Passport, National ID, or Driver's License.</p>
              <div style={{ border: '2px dashed var(--color-border-limestone)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', cursor: 'pointer' }}>
                <UploadCloud size={32} color="var(--color-text-slate)" style={{ marginBottom: 'var(--space-2)' }} />
                <div className="text-small">Click to upload or drag and drop</div>
              </div>
            </div>

            {isAgent && (
              <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
                <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Professional License</h3>
                <p className="text-meta" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-slate)' }}>Real estate brokerage or agent license valid in your primary operating market.</p>
                <div style={{ border: '2px dashed var(--color-border-limestone)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', cursor: 'pointer' }}>
                  <UploadCloud size={32} color="var(--color-text-slate)" style={{ marginBottom: 'var(--space-2)' }} />
                  <div className="text-small">Click to upload or drag and drop</div>
                </div>
              </div>
            )}

            {!isAgent && (
              <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
                <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Proof of Ownership (Optional for setup)</h3>
                <p className="text-meta" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-slate)' }}>You can provide this later when listing specific properties.</p>
                <div style={{ border: '2px dashed var(--color-border-limestone)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', cursor: 'pointer' }}>
                  <UploadCloud size={32} color="var(--color-text-slate)" style={{ marginBottom: 'var(--space-2)' }} />
                  <div className="text-small">Click to upload or drag and drop</div>
                </div>
              </div>
            )}

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit for Verification</button>
          </div>
        </div>
      )}

    </div>
  );
}

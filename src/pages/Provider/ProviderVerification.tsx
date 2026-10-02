import { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function ProviderVerification() {
  const [status, setStatus] = useState<'info_required' | 'submitted' | 'verified'>('info_required');

  if (status === 'verified') {
    return (
      <div className="provider-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <CheckCircle2 size={48} color="var(--color-success-forest)" style={{ marginBottom: 'var(--space-6)' }} />
        <h1 className="h2">Identity Verified</h1>
        <p className="large" style={{ color: 'var(--color-text-slate)', maxWidth: '500px' }}>
          Your identity and professional credentials have been successfully verified.
        </p>
      </div>
    );
  }

  return (
    <div className="provider-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Verification</h1>
        <p className="text-meta">Verification documents required for your market.</p>
      </div>
      
      {status === 'info_required' ? (
        <div className="onboarding-step">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Government ID</h3>
              <p className="text-meta" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-slate)' }}>Passport, National ID, or Driver's License.</p>
              <div style={{ border: '2px dashed var(--color-border-limestone)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', cursor: 'pointer' }}>
                <UploadCloud size={32} color="var(--color-text-slate)" style={{ marginBottom: 'var(--space-2)' }} />
                <div className="text-small">Click to upload or drag and drop</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
            <button className="btn btn-primary" onClick={() => setStatus('submitted')}>Submit for Verification</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Under review</h3>
          <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>Your documents are currently being reviewed. We will notify you once your account is fully verified.</p>
        </div>
      )}
    </div>
  );
}

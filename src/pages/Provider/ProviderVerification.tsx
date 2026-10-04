import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Info,
  ShieldAlert
} from 'lucide-react';

type VerificationStatus = 
  | 'not_started' 
  | 'information_required' 
  | 'submitted' 
  | 'under_review' 
  | 'verified' 
  | 'needs_attention' 
  | 'rejected';

export default function ProviderVerification() {
  const { user, updateUser } = useAuth();
  const currentStatus = (user?.providerVerificationStatus || 'under_review') as VerificationStatus;

  const [documentName, setDocumentName] = useState<string>('eu_passport_scan_front_back.pdf');
  const [licenseName, setLicenseName] = useState<string>('real_estate_brokerage_license.pdf');

  const setStatus = (st: VerificationStatus) => {
    updateUser({ providerVerificationStatus: st });
  };

  const renderStatusBanner = () => {
    switch (currentStatus) {
      case 'verified':
        return (
          <div style={{ padding: 'var(--space-6)', backgroundColor: 'rgba(52, 112, 87, 0.08)', border: '1px solid var(--color-success-forest)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <CheckCircle2 size={40} color="var(--color-success-forest)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 className="h4" style={{ margin: '0 0 6px 0', color: 'var(--color-success-forest)' }}>Identity & Credentials Verified</h2>
            <p className="text-small" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
              Your government identity documentation and certified professional license have been reviewed and approved.
            </p>
          </div>
        );
      case 'under_review':
        return (
          <div style={{ padding: 'var(--space-6)', backgroundColor: 'rgba(165, 108, 39, 0.08)', border: '1px solid var(--color-warning-ochre)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <Clock size={40} color="var(--color-warning-ochre)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 className="h4" style={{ margin: '0 0 6px 0', color: 'var(--color-warning-ochre)' }}>Documentation Under Review</h2>
            <p className="text-small" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
              Auremont Compliance is currently reviewing your submitted identification. Standard review turnaround is 24 business hours.
            </p>
          </div>
        );
      case 'needs_attention':
        return (
          <div style={{ padding: 'var(--space-6)', backgroundColor: 'rgba(217, 83, 79, 0.08)', border: '1px solid var(--color-error-brick)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <AlertCircle size={40} color="var(--color-error-brick)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 className="h4" style={{ margin: '0 0 6px 0', color: 'var(--color-error-brick)' }}>Action Required on Submitted Documents</h2>
            <p className="text-small" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
              The government ID image provided was partially obscured. Please upload a clear, uncropped copy with all four corners visible.
            </p>
          </div>
        );
      case 'rejected':
        return (
          <div style={{ padding: 'var(--space-6)', backgroundColor: 'rgba(217, 83, 79, 0.1)', border: '1px solid var(--color-error-brick)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <XCircle size={40} color="var(--color-error-brick)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 className="h4" style={{ margin: '0 0 6px 0', color: 'var(--color-error-brick)' }}>Verification Declined</h2>
            <p className="text-small" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
              Your credentials could not be validated against jurisdictional registries. Please reach out to provider-support@auremont.com.
            </p>
          </div>
        );
      case 'submitted':
        return (
          <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-sand)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <CheckCircle2 size={40} color="var(--color-primary-navy)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 className="h4" style={{ margin: '0 0 6px 0' }}>Submission Received</h2>
            <p className="text-small" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
              Your documents have been encrypted and queued for manual compliance vetting.
            </p>
          </div>
        );
      case 'not_started':
      case 'information_required':
      default:
        return (
          <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <ShieldAlert size={40} color="var(--color-primary-navy)" style={{ margin: '0 auto var(--space-3)' }} />
            <h2 className="h4" style={{ margin: '0 0 6px 0' }}>Verification Documentation Required</h2>
            <p className="text-small" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
              To list properties and receive client leads, Auremont requires proof of identity and professional credentials.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="provider-panel" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Provider Identity Verification</h1>
          <p className="text-meta">KYC and professional credential validation for the Auremont marketplace.</p>
        </div>

        {/* Demo State Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-bg-sand)', padding: '4px 10px', borderRadius: 'var(--radius-md)' }}>
          <span className="text-meta" style={{ fontSize: '11px', fontWeight: 600 }}>Demo State:</span>
          <select 
            value={currentStatus} 
            onChange={e => setStatus(e.target.value as VerificationStatus)}
            style={{ fontSize: '12px', padding: '2px 6px', border: '1px solid var(--color-border-limestone)', borderRadius: '4px' }}
          >
            <option value="not_started">Not started</option>
            <option value="information_required">Information required</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under review</option>
            <option value="verified">Verified</option>
            <option value="needs_attention">Needs attention</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Critical Clarification: Identity Verification vs Listing Review */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4)', backgroundColor: 'rgba(30, 41, 59, 0.04)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', alignItems: 'center' }}>
        <Info size={18} color="var(--color-primary-navy)" style={{ flexShrink: 0 }} />
        <span className="text-meta" style={{ fontSize: '12px', color: 'var(--color-text-slate)' }}>
          <strong>Policy Note:</strong> Provider Identity Verification confirms your legal right to transact in your jurisdiction. It is administered independently from individual <em>Listing Editorial Reviews</em>.
        </span>
      </div>

      {/* Status Hero */}
      {renderStatusBanner()}

      {/* Document Submissions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Document 1: Government ID */}
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 className="h4" style={{ margin: '0 0 4px 0' }}>1. Government Issued Photo ID</h3>
              <p className="text-meta" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
                Valid Passport, National Identity Card, or Commercial Registration.
              </p>
            </div>
            <span style={{ 
              fontSize: '11px', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontWeight: 600,
              backgroundColor: currentStatus === 'verified' ? 'rgba(52, 112, 87, 0.1)' : 'var(--color-bg-sand)',
              color: currentStatus === 'verified' ? 'var(--color-success-forest)' : 'var(--color-text-slate)'
            }}>
              {currentStatus === 'verified' ? 'VALIDATED' : 'REQUIRED'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-ivory)' }}>
            <FileText size={20} color="var(--color-primary-navy)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{documentName}</div>
              <div className="text-meta" style={{ fontSize: '11px', color: 'var(--color-text-ash)' }}>Encrypted SHA-256 • Verified format</div>
            </div>
            {currentStatus !== 'verified' && (
              <button 
                onClick={() => {
                  setDocumentName('passport_scan_updated.pdf');
                  setStatus('submitted');
                }} 
                className="btn btn-secondary text-small"
              >
                Upload New
              </button>
            )}
          </div>
        </div>

        {/* Document 2: Broker / Landlord Credential */}
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 className="h4" style={{ margin: '0 0 4px 0' }}>2. Professional License or Title Deed</h3>
              <p className="text-meta" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
                Certified agent license number or registered property deed proving ownership.
              </p>
            </div>
            <span style={{ 
              fontSize: '11px', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontWeight: 600,
              backgroundColor: currentStatus === 'verified' ? 'rgba(52, 112, 87, 0.1)' : 'var(--color-bg-sand)',
              color: currentStatus === 'verified' ? 'var(--color-success-forest)' : 'var(--color-text-slate)'
            }}>
              {currentStatus === 'verified' ? 'VALIDATED' : 'REQUIRED'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-ivory)' }}>
            <FileText size={20} color="var(--color-primary-navy)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{licenseName}</div>
              <div className="text-meta" style={{ fontSize: '11px', color: 'var(--color-text-ash)' }}>Official Registry Link Validated</div>
            </div>
            {currentStatus !== 'verified' && (
              <button 
                onClick={() => {
                  setLicenseName('broker_license_certified.pdf');
                  setStatus('submitted');
                }} 
                className="btn btn-secondary text-small"
              >
                Upload New
              </button>
            )}
          </div>
        </div>

        {currentStatus !== 'verified' && currentStatus !== 'under_review' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button 
              onClick={() => setStatus('under_review')} 
              className="btn btn-primary"
            >
              Submit All Documents for Compliance Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

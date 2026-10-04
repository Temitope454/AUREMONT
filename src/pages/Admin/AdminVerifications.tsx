import { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Check, 
  X, 
  FileText, 
  Award 
} from 'lucide-react';
import { useAdmin, type ProviderKYCDossier } from '../../context/AdminContext';
import './AdminVerifications.css';

export default function AdminVerifications() {
  const { kycDossiers, approveKYC, requestKYCInformation, rejectKYC } = useAdmin();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingDossier, setInspectingDossier] = useState<ProviderKYCDossier | null>(null);

  // Sub-actions in modal
  const [isRequestingInfo, setIsRequestingInfo] = useState(false);
  const [infoRequestNotes, setInfoRequestNotes] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredDossiers = kycDossiers.filter(d => {
    if (activeTab === 'under_review' && d.status !== 'under_review') return false;
    if (activeTab === 'verified' && d.status !== 'verified') return false;
    if (activeTab === 'needs_attention' && d.status !== 'needs_attention') return false;
    if (activeTab === 'rejected' && d.status !== 'rejected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.providerName.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.jurisdiction.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        (d.agency && d.agency.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openDossier = (dossier: ProviderKYCDossier) => {
    setInspectingDossier(dossier);
    setInfoRequestNotes(dossier.reviewNotes || '');
    setIsRequestingInfo(false);
    setIsRejecting(false);
  };

  const closeDossier = () => {
    setInspectingDossier(null);
    setIsRequestingInfo(false);
    setIsRejecting(false);
  };

  const handleApprove = () => {
    if (inspectingDossier) {
      approveKYC(inspectingDossier.id);
      closeDossier();
    }
  };

  const handleRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inspectingDossier && infoRequestNotes.trim()) {
      requestKYCInformation(inspectingDossier.id, infoRequestNotes.trim());
      closeDossier();
    }
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (inspectingDossier && rejectReason.trim()) {
      rejectKYC(inspectingDossier.id, rejectReason.trim());
      closeDossier();
    }
  };

  return (
    <div className="admin-verifications-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-breadcrumb">OPERATIONS CONSOLE &gt; PROVIDER KYC & COMPLIANCE</span>
          <h1 className="admin-page-title">Provider Identity & Licensure Oversight</h1>
          <p className="admin-page-subtitle">
            Under international AML and real-estate directives, all Auremont Agents and Landlords must verify government identities, professional broker certifications, and jurisdiction authorizations before transacting.
          </p>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="kyc-metrics-row">
        <div className="kyc-metric-pill">
          <span className="k-val">{kycDossiers.filter(k => k.status === 'verified').length}</span>
          <span className="k-lbl">Verified Providers</span>
        </div>
        <div className="kyc-metric-pill kyc-pill-warn">
          <span className="k-val">{kycDossiers.filter(k => k.status === 'under_review').length}</span>
          <span className="k-lbl">Dossiers In Review</span>
        </div>
        <div className="kyc-metric-pill kyc-pill-amber">
          <span className="k-val">{kycDossiers.filter(k => k.status === 'needs_attention').length}</span>
          <span className="k-lbl">Information Requested</span>
        </div>
        <div className="kyc-metric-pill">
          <span className="k-val">100%</span>
          <span className="k-lbl">AML & Sanctions Cleared</span>
        </div>
      </div>

      {/* Controls Card */}
      <div className="admin-controls-card">
        <div className="admin-status-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Submissions ({kycDossiers.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'under_review' ? 'active' : ''}`}
            onClick={() => setActiveTab('under_review')}
          >
            Under Review ({kycDossiers.filter(k => k.status === 'under_review').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'verified' ? 'active' : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            Verified ({kycDossiers.filter(k => k.status === 'verified').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'needs_attention' ? 'active' : ''}`}
            onClick={() => setActiveTab('needs_attention')}
          >
            Needs Attention ({kycDossiers.filter(k => k.status === 'needs_attention').length})
          </button>
        </div>

        <div className="admin-filter-bar">
          <div className="search-field-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by provider, agency, license or jurisdiction..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="admin-input-search"
            />
          </div>
        </div>
      </div>

      {/* Verifications Table */}
      <div className="admin-panel">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Provider Profile</th>
                <th>Role & Agency</th>
                <th>Jurisdiction</th>
                <th>Submitted Licensure</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center" style={{ padding: 'var(--space-10) 0' }}>
                    <p className="text-secondary">No provider verification dossiers matched your active filter.</p>
                  </td>
                </tr>
              ) : (
                filteredDossiers.map(dossier => (
                  <tr key={dossier.id}>
                    <td>
                      <div className="provider-cell-flex">
                        <div className="provider-avatar-circle">
                          {dossier.providerName.charAt(0)}
                        </div>
                        <div>
                          <div className="provider-name-main">{dossier.providerName}</div>
                          <div className="text-meta">{dossier.email} · {dossier.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="role-cell">
                        <span className="role-tag">{dossier.role.toUpperCase()}</span>
                        <span className="text-secondary">{dossier.agency || 'Private Asset Owner'}</span>
                      </div>
                    </td>

                    <td>
                      <span className="jurisdiction-text">{dossier.jurisdiction}</span>
                    </td>

                    <td>
                      <div className="doc-cell">
                        <span className="doc-type">{dossier.documentType}</span>
                        <span className="doc-num text-meta">{dossier.licenseNumber}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`risk-pill risk-${dossier.riskRating.toLowerCase()}`}>
                        {dossier.riskRating}
                      </span>
                    </td>

                    <td>
                      <span className={`status-pill status-${dossier.status}`}>
                        {dossier.status === 'under_review' ? 'Under Review' :
                         dossier.status === 'verified' ? 'Verified' :
                         dossier.status === 'needs_attention' ? 'Needs Attention' : dossier.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell">
                        <button 
                          onClick={() => openDossier(dossier)}
                          className="btn btn-secondary btn-sm"
                        >
                          <FileText size={14} /> Dossier
                        </button>
                        {dossier.status === 'under_review' && (
                          <button 
                            onClick={() => approveKYC(dossier.id)}
                            className="btn btn-primary btn-sm btn-icon-only"
                            title="Verify Provider"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Inspection Modal */}
      {inspectingDossier && (
        <div className="admin-modal-overlay" onClick={closeDossier}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">LEGAL COMPLIANCE &amp; LICENSURE DOSSIER</span>
                <h2 className="modal-title">{inspectingDossier.providerName}</h2>
                <p className="modal-location">
                  <Award size={14} /> {inspectingDossier.role === 'agent' ? 'Licensed Real Estate Broker' : 'Verified Private Landlord'} · {inspectingDossier.agency || 'Private Principal'}
                </p>
              </div>
              <button onClick={closeDossier} className="icon-btn-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Simulated Certificate Credential Card */}
              <div className="certificate-preview-card">
                <div className="cert-header">
                  <span className="cert-jurisdiction">{inspectingDossier.jurisdiction.toUpperCase()}</span>
                  <span className="cert-status-badge">AUTHENTICATED CREDENTIAL</span>
                </div>
                <div className="cert-body">
                  <div className="cert-field">
                    <span className="cert-k">DOCUMENT TYPE</span>
                    <span className="cert-v">{inspectingDossier.documentType}</span>
                  </div>
                  <div className="cert-field">
                    <span className="cert-k">REGISTRATION / LICENSE NO.</span>
                    <span className="cert-v font-mono">{inspectingDossier.licenseNumber}</span>
                  </div>
                  <div className="cert-field">
                    <span className="cert-k">VALID UNTIL</span>
                    <span className="cert-v">{inspectingDossier.documentExpiry}</span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="modal-details-grid">
                <div>
                  <h3 className="section-label">Provider Operational Vitals</h3>
                  <div className="spec-item-row">
                    <span className="spec-k">Auremont ID:</span>
                    <span className="spec-v font-mono">{inspectingDossier.providerId}</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-k">Active Listings:</span>
                    <span className="spec-v">{inspectingDossier.activeListingsCount} Managed Properties</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-k">Transacted Volume:</span>
                    <span className="spec-v font-serif">€{inspectingDossier.totalTransactedValue.toLocaleString()}</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-k">Submission Date:</span>
                    <span className="spec-v">{new Date(inspectingDossier.submittedDate).toLocaleDateString()}</span>
                  </div>

                  {inspectingDossier.reviewNotes && (
                    <div className="compliance-note-box">
                      <strong>Prior Auditor Notes:</strong>
                      <p className="text-secondary">{inspectingDossier.reviewNotes}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="section-label">Automated Screening Status</h3>
                  <div className="checklist-box">
                    <div className="checklist-item">
                      <div className="chk-indicator chk-pass"><Check size={14} /></div>
                      <div>
                        <strong>Interpol & Financial Sanctions Check</strong>
                        <p className="chk-desc">Clear. No adverse PEP or sanctions flags recorded.</p>
                      </div>
                    </div>

                    <div className="checklist-item">
                      <div className="chk-indicator chk-pass"><Check size={14} /></div>
                      <div>
                        <strong>National Chamber of Commerce Registry</strong>
                        <p className="chk-desc">Active corporate registration verified with regulatory body.</p>
                      </div>
                    </div>

                    <div className="checklist-item">
                      <div className="chk-indicator chk-pass"><Check size={14} /></div>
                      <div>
                        <strong>Government Photo ID Biometric Match</strong>
                        <p className="chk-desc">Facial biometric score 99.4% confidence match against passport.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-form: Request Information */}
              {isRequestingInfo && (
                <form onSubmit={handleRequestInfo} className="modal-action-subform">
                  <h4 className="subform-title">Request Additional Verification Proof</h4>
                  <p className="subform-desc">Provide clear guidance on what documents the provider must resubmit (e.g. proof of corporate insurance or notarial power of attorney):</p>
                  <textarea 
                    value={infoRequestNotes}
                    onChange={e => setInfoRequestNotes(e.target.value)}
                    placeholder="Specify requested documentation..."
                    rows={3}
                    className="admin-textarea"
                    required
                  />
                  <div className="subform-buttons">
                    <button type="submit" className="btn btn-primary btn-sm">
                      Dispatch Request
                    </button>
                    <button type="button" onClick={() => setIsRequestingInfo(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-form: Reject KYC */}
              {isRejecting && (
                <form onSubmit={handleReject} className="modal-action-subform reject-subform">
                  <h4 className="subform-title text-error">Reject Provider Licensure</h4>
                  <p className="subform-desc">State regulatory cause for KYC rejection (provider will be suspended from listing):</p>
                  <textarea 
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Provide mandatory compliance reason..."
                    rows={3}
                    className="admin-textarea"
                    required
                  />
                  <div className="subform-buttons">
                    <button type="submit" className="btn btn-error btn-sm">
                      Confirm Rejection
                    </button>
                    <button type="button" onClick={() => setIsRejecting(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <div className="footer-left">
                <span className="text-meta">Reviewer: Elena Rostova</span>
              </div>

              <div className="footer-right">
                {!isRequestingInfo && !isRejecting && (
                  <>
                    <button 
                      onClick={() => setIsRejecting(true)} 
                      className="btn btn-text-error btn-sm"
                    >
                      Reject Application
                    </button>
                    <button 
                      onClick={() => setIsRequestingInfo(true)} 
                      className="btn btn-secondary btn-sm"
                    >
                      Request Info
                    </button>
                    <button 
                      onClick={handleApprove} 
                      className="btn btn-primary btn-sm"
                    >
                      <ShieldCheck size={16} /> Grant Verified Status
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

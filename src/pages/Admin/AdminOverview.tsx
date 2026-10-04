import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import './AdminOverview.css';

export default function AdminOverview() {
  const { metrics, listings, kycDossiers, auditLogs, approveListing, approveKYC } = useAdmin();

  const pendingListings = listings.filter(l => l.status === 'under_review').slice(0, 3);
  const pendingKyc = kycDossiers.filter(k => k.status === 'under_review').slice(0, 3);
  const recentAudit = auditLogs.slice(0, 5);

  const formatPrice = (val: number, cur: string = '€') => {
    return `${cur}${val.toLocaleString('en-US')}`;
  };

  return (
    <div className="admin-overview">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-breadcrumb">OPERATIONS CONSOLE &gt; EXECUTIVE OVERVIEW</span>
          <h1 className="admin-page-title">Platform Governance & Vitals</h1>
          <p className="admin-page-subtitle">
            Executive oversight of multi-jurisdiction inventory, provider credentials, and commission accrued across Europe & the Middle East.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/listings" className="btn btn-primary">
            Review Queue ({metrics.pendingListingsCount + metrics.pendingKYCCount})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap kpi-blue">
            <Building2 size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Marketplace Inventory</span>
            <div className="kpi-metric-row">
              <span className="kpi-value">{metrics.publishedListingsCount}</span>
              <span className="kpi-badge kpi-badge-gold">
                {metrics.pendingListingsCount} Pending Review
              </span>
            </div>
            <span className="kpi-meta">Across 6 Prime Metropolises</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap kpi-gold">
            <ShieldCheck size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Provider Network</span>
            <div className="kpi-metric-row">
              <span className="kpi-value">{metrics.verifiedProvidersCount}</span>
              <span className="kpi-badge kpi-badge-amber">
                {metrics.pendingKYCCount} KYC In Review
              </span>
            </div>
            <span className="kpi-meta">RICS & Carte T Verified</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap kpi-forest">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Catalog GMV Value</span>
            <div className="kpi-metric-row">
              <span className="kpi-value">{formatPrice(metrics.totalPlatformGMV)}</span>
            </div>
            <span className="kpi-meta">High-Net-Worth Residential & Villas</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap kpi-navy">
            <Clock size={20} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Projected Commission</span>
            <div className="kpi-metric-row">
              <span className="kpi-value">{formatPrice(metrics.totalAccruedCommission)}</span>
              <span className="kpi-badge kpi-badge-forest">10% Sale / 5% Rent</span>
            </div>
            <span className="kpi-meta">Automated Financial Calculation</span>
          </div>
        </div>
      </div>

      {/* Action Center Split */}
      <div className="admin-split-grid">
        {/* Pending Listings Panel */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="panel-title-group">
              <h2 className="admin-panel-title">Pending Listing Approvals</h2>
              <span className="admin-badge-count">{metrics.pendingListingsCount}</span>
            </div>
            <Link to="/admin/listings" className="panel-more-link">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="admin-panel-body">
            {pendingListings.length === 0 ? (
              <div className="admin-empty-state">
                <CheckCircle2 size={32} className="empty-icon-success" />
                <p>All submitted listings have been reviewed and published.</p>
              </div>
            ) : (
              <div className="admin-queue-list">
                {pendingListings.map(listing => (
                  <div key={listing.id} className="admin-queue-item">
                    <img src={listing.mainImage} alt={listing.title} className="queue-thumb" />
                    <div className="queue-details">
                      <div className="queue-title-row">
                        <span className="queue-title">{listing.title}</span>
                        <span className="queue-price">{formatPrice(listing.price, listing.currency)}</span>
                      </div>
                      <div className="queue-meta-row">
                        <span>{listing.city}, {listing.country}</span>
                        <span className="meta-dot">·</span>
                        <span>Provider: {listing.providerName} ({listing.providerRole})</span>
                      </div>
                      <div className="queue-compliance-pills">
                        <span className={`compliance-pill ${listing.complianceChecks.deedVerification ? 'passed' : 'warn'}`}>
                          Deed: {listing.complianceChecks.deedVerification ? 'Verified' : 'Pending'}
                        </span>
                        <span className={`compliance-pill ${listing.complianceChecks.energyPerformanceCert ? 'passed' : 'warn'}`}>
                          EPC: {listing.complianceChecks.energyPerformanceCert ? 'Verified' : 'Missing'}
                        </span>
                      </div>
                    </div>
                    <div className="queue-actions">
                      <button 
                        onClick={() => approveListing(listing.id)}
                        className="btn btn-secondary btn-sm"
                        title="Fast-track approval"
                      >
                        Approve
                      </button>
                      <Link to={`/admin/listings`} className="btn btn-outline btn-sm">
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending KYC Panel */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="panel-title-group">
              <h2 className="admin-panel-title">Provider KYC Submissions</h2>
              <span className="admin-badge-count">{metrics.pendingKYCCount}</span>
            </div>
            <Link to="/admin/verifications" className="panel-more-link">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="admin-panel-body">
            {pendingKyc.length === 0 ? (
              <div className="admin-empty-state">
                <CheckCircle2 size={32} className="empty-icon-success" />
                <p>All provider identity verification dossiers are up to date.</p>
              </div>
            ) : (
              <div className="admin-queue-list">
                {pendingKyc.map(kyc => (
                  <div key={kyc.id} className="admin-queue-item">
                    <div className="kyc-avatar-box">
                      <FileCheck size={20} />
                    </div>
                    <div className="queue-details">
                      <div className="queue-title-row">
                        <span className="queue-title">{kyc.providerName}</span>
                        <span className="kyc-role-tag">{kyc.role.toUpperCase()}</span>
                      </div>
                      <div className="queue-meta-row">
                        <span>{kyc.agency || 'Private Landlord'}</span>
                        <span className="meta-dot">·</span>
                        <span>{kyc.jurisdiction}</span>
                      </div>
                      <div className="queue-compliance-pills">
                        <span className="compliance-pill passed">
                          {kyc.documentType}: {kyc.licenseNumber}
                        </span>
                        <span className="compliance-pill risk-low">
                          Risk: {kyc.riskRating}
                        </span>
                      </div>
                    </div>
                    <div className="queue-actions">
                      <button 
                        onClick={() => approveKYC(kyc.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        Verify
                      </button>
                      <Link to="/admin/verifications" className="btn btn-outline btn-sm">
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Audit Feed */}
      <div className="admin-panel admin-audit-widget">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Recent Regulatory Audit Events</h2>
            <p className="admin-panel-subtitle">Permanent cryptographic tracking of compliance officer operations</p>
          </div>
          <Link to="/admin/audit" className="panel-more-link">
            Full Audit Trail <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="admin-audit-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Compliance Officer</th>
                <th>Operation</th>
                <th>Target Resource</th>
                <th>Operational Note</th>
              </tr>
            </thead>
            <tbody>
              {recentAudit.map(entry => (
                <tr key={entry.id}>
                  <td className="text-meta">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td><strong>{entry.operator}</strong></td>
                  <td>
                    <span className="audit-action-chip">
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="text-emphasis">{entry.targetSummary}</span>
                  </td>
                  <td className="text-secondary">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

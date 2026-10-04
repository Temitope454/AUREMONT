import { useState } from 'react';
import { 
  Download, 
  Search 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import './AdminAuditLog.css';

export default function AdminAuditLog() {
  const { auditLogs, exportAuditLogCsv } = useAdmin();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (categoryFilter !== 'all' && log.targetType !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.operator.toLowerCase().includes(q) ||
        log.targetSummary.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadCsv = () => {
    const csvContent = exportAuditLogCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `auremont_compliance_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-audit-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-breadcrumb">OPERATIONS CONSOLE &gt; REGULATORY AUDIT LOG</span>
          <h1 className="admin-page-title">Compliance &amp; Operations Audit Trail</h1>
          <p className="admin-page-subtitle">
            Immutable chronological logging of all compliance reviews, listing publications, broker credential evaluations, and financial overrides.
          </p>
        </div>

        <div className="admin-header-actions">
          <button onClick={handleDownloadCsv} className="btn btn-secondary">
            <Download size={16} /> Export Audit Log (CSV)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-controls-card">
        <div className="admin-status-tabs">
          <button 
            className={`tab-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Audit Records ({auditLogs.length})
          </button>
          <button 
            className={`tab-btn ${categoryFilter === 'listing' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('listing')}
          >
            Listing Actions ({auditLogs.filter(l => l.targetType === 'listing').length})
          </button>
          <button 
            className={`tab-btn ${categoryFilter === 'provider_kyc' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('provider_kyc')}
          >
            KYC Decisions ({auditLogs.filter(l => l.targetType === 'provider_kyc').length})
          </button>
          <button 
            className={`tab-btn ${categoryFilter === 'commission_policy' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('commission_policy')}
          >
            Policy Changes ({auditLogs.filter(l => l.targetType === 'commission_policy').length})
          </button>
          <button 
            className={`tab-btn ${categoryFilter === 'user' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('user')}
          >
            User Controls ({auditLogs.filter(l => l.targetType === 'user').length})
          </button>
        </div>

        <div className="admin-filter-bar">
          <div className="search-field-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by operator, target entity, or event details..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="admin-input-search"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="admin-panel">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Compliance Officer</th>
                <th>Event Action</th>
                <th>Target Category</th>
                <th>Target Resource</th>
                <th>Audit Justification / Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center" style={{ padding: 'var(--space-10) 0' }}>
                    <p className="text-secondary">No audit entries matched your query.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(entry => (
                  <tr key={entry.id}>
                    <td>
                      <div className="timestamp-cell">
                        <span className="time-date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                        <span className="time-time text-meta">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong>{entry.operator}</strong>
                    </td>

                    <td>
                      <span className="audit-action-chip">
                        {entry.action.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td>
                      <span className="audit-cat-chip">{entry.targetType.toUpperCase()}</span>
                    </td>

                    <td>
                      <span className="target-summary">{entry.targetSummary}</span>
                    </td>

                    <td>
                      <span className="details-text">{entry.details}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

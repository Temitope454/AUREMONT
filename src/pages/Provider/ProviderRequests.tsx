import { useProviderState } from '../../context/ProviderContext';

export default function ProviderRequests() {
  const { requests } = useProviderState();

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="h3">Rental Requests</h1>
        <p className="text-meta">Review and approve tenant requests for your properties.</p>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Customer</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Requested Dates</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={req.id} style={{ borderBottom: i === requests.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)', fontWeight: 500 }}>{req.customerName}</td>
                <td style={{ padding: 'var(--space-4)' }} className="text-small">{req.propertyTitle}</td>
                <td style={{ padding: 'var(--space-4)' }} className="text-meta">{req.dates}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: req.status === 'pending' ? 'rgba(165, 108, 39, 0.1)' : 'var(--color-bg-sand)',
                    color: req.status === 'pending' ? 'var(--color-warning-ochre)' : 'var(--color-text-slate)'
                  }}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-secondary text-small">Review</button>
                    {req.status === 'pending' && <button className="btn btn-primary text-small">Approve</button>}
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>No active rental requests.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

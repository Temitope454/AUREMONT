import { useProviderState } from '../../context/ProviderContext';

export default function ProviderLeads() {
  const { leads } = useProviderState();

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="h3">Agent Leads</h1>
        <p className="text-meta">Manage your inquiries and follow up with prospective clients.</p>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Date</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Customer</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr key={lead.id} style={{ borderBottom: i === leads.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }} className="text-meta">{lead.date}</td>
                <td style={{ padding: 'var(--space-4)', fontWeight: 500 }}>{lead.customerName}</td>
                <td style={{ padding: 'var(--space-4)' }} className="text-small">{lead.propertyTitle}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: lead.status === 'new' ? 'rgba(169, 104, 79, 0.1)' : 'var(--color-bg-sand)',
                    color: lead.status === 'new' ? 'var(--color-primary-navy)' : 'var(--color-text-slate)'
                  }}>
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <button className="btn btn-secondary text-small">Message</button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>No active leads found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

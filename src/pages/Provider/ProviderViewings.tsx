export default function ProviderViewings() {
  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Viewings</h1>
        <p className="text-meta">Manage your upcoming property viewings.</p>
      </div>
      
      <div style={{ padding: 'var(--space-12)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>No upcoming viewings</h3>
        <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>When customers request viewings for your active properties, they will appear here.</p>
      </div>
    </div>
  );
}

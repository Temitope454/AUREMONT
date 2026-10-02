export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="account-panel">
      <div className="panel-header" style={{padding: 'var(--space-6) var(--space-8)', borderBottom: '1px solid var(--color-border-limestone)'}}>
        <h1 className="h3">{title}</h1>
      </div>
      <div className="panel-body" style={{padding: 'var(--space-6) var(--space-8)'}}>
        <div className="empty-state">
          <h3 className="h4">No {title.toLowerCase()} available</h3>
          <p className="text-meta">This section is part of the mock architecture and will be populated with real data in the future.</p>
        </div>
      </div>
    </div>
  );
}

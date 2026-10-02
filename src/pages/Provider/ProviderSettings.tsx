export default function ProviderSettings() {
  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Settings</h1>
        <p className="text-meta">Manage your account preferences, language, and notifications.</p>
      </div>
      
      <div style={{ maxWidth: '600px' }}>
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
          <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Preferences</h3>
          <div className="input-group">
            <label>Language</label>
            <select className="input-field">
              <option>English</option>
              <option>Français</option>
              <option>Español</option>
            </select>
          </div>
          <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
            <label>Default Currency Display</label>
            <select className="input-field">
              <option>EUR (€)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>

        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Email Notifications</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <input type="checkbox" defaultChecked /> New inquiries and requests
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <input type="checkbox" defaultChecked /> Viewing updates
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" defaultChecked /> Weekly performance summary
          </label>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>Save Preferences</button>
      </div>
    </div>
  );
}

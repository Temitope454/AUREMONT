import { Bell } from 'lucide-react';

export default function ProviderNotifications() {
  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Notifications</h1>
        <p className="text-meta">Updates on your listings, leads, and account verification.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {[
          { id: 1, title: 'Listing Approved', body: 'Your listing "Modern Minimalist Apartment" has been approved and is now live.', time: '2 hours ago', type: 'success' },
          { id: 2, title: 'New Lead', body: 'Eleanor Vance has sent a new inquiry for "Paris Apartment".', time: '5 hours ago', type: 'info' }
        ].map(note => (
          <div key={note.id} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={20} color="var(--color-primary-navy)" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '15px' }}>{note.title}</strong>
                <span className="text-meta" style={{ color: 'var(--color-text-ash)' }}>{note.time}</span>
              </div>
              <div className="text-small" style={{ color: 'var(--color-text-slate)' }}>{note.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

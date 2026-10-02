import { useState } from 'react';

export default function ProviderMessages() {
  const [activeMessage, setActiveMessage] = useState<number | null>(null);

  const mockConversations = [
    { id: 1, customer: 'Eleanor Vance', property: 'Paris Apartment', lastMessage: 'Is it available this weekend?', time: '2 hours ago', unread: true },
    { id: 2, customer: 'James Wilson', property: 'Alfama Courtyard House', lastMessage: 'Thanks, I will review the documents.', time: 'Yesterday', unread: false }
  ];

  return (
    <div className="provider-panel" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', flexShrink: 0 }}>
        <h1 className="h3">Messages</h1>
        <p className="text-meta">Communicate securely with prospective buyers and tenants.</p>
      </div>
      
      <div style={{ display: 'flex', flex: 1, border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface-white)' }}>
        <div style={{ width: '320px', borderRight: '1px solid var(--color-border-limestone)', overflowY: 'auto' }}>
          {mockConversations.map(conv => (
            <div key={conv.id} 
              onClick={() => setActiveMessage(conv.id)}
              style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)', cursor: 'pointer', backgroundColor: activeMessage === conv.id ? 'var(--color-bg-ivory)' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '14px', fontWeight: conv.unread ? 700 : 500 }}>{conv.customer}</strong>
                <span className="text-meta" style={{ color: 'var(--color-text-ash)' }}>{conv.time}</span>
              </div>
              <div className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: '4px' }}>{conv.property}</div>
              <div className="text-small" style={{ color: 'var(--color-text-slate)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: conv.unread ? 600 : 400 }}>{conv.lastMessage}</div>
            </div>
          ))}
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-ivory)' }}>
          {activeMessage ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', margin: 'auto' }}>
              <p className="text-meta">Message thread implementation is centralized in the messaging foundation.</p>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-12)', textAlign: 'center', margin: 'auto' }}>
              <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Select a conversation</h3>
              <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>Choose a thread from the list to view your messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

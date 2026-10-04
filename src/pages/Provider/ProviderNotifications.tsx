import { useState } from 'react';
import { useProviderState } from '../../context/ProviderContext';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ArrowRight, Home, Users, CalendarCheck, MessageSquare, ShieldCheck, CreditCard } from 'lucide-react';

export default function ProviderNotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useProviderState();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('listing')) return <Home size={18} color="var(--color-primary-navy)" />;
    if (lower.includes('lead') || lower.includes('inquiry')) return <Users size={18} color="var(--color-primary-navy)" />;
    if (lower.includes('request') || lower.includes('tenancy')) return <Users size={18} color="var(--color-warning-ochre)" />;
    if (lower.includes('viewing')) return <CalendarCheck size={18} color="var(--color-primary-navy)" />;
    if (lower.includes('message')) return <MessageSquare size={18} color="var(--color-primary-navy)" />;
    if (lower.includes('identity') || lower.includes('verification')) return <ShieldCheck size={18} color="var(--color-success-forest)" />;
    if (lower.includes('transaction') || lower.includes('settlement')) return <CreditCard size={18} color="var(--color-success-forest)" />;
    return <Bell size={18} color="var(--color-primary-navy)" />;
  };

  return (
    <div className="provider-panel" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Notifications & System Alerts</h1>
          <p className="text-meta">Real-time alerts for listings, prospective leads, and verification milestones.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {unreadCount > 0 && (
            <button 
              onClick={markAllNotificationsRead} 
              className="btn btn-secondary text-small"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', paddingBottom: 'var(--space-2)' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: filter === 'all' ? 'var(--color-primary-navy)' : 'transparent',
            color: filter === 'all' ? '#fff' : 'var(--color-text-slate)',
            fontWeight: filter === 'all' ? 600 : 500,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: filter === 'unread' ? 'var(--color-primary-navy)' : 'transparent',
            color: filter === 'unread' ? '#fff' : 'var(--color-text-slate)',
            fontWeight: filter === 'unread' ? 600 : 500,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filteredNotifications.map(note => (
          <div 
            key={note.id} 
            onClick={() => markNotificationRead(note.id)}
            style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              padding: 'var(--space-4) var(--space-6)', 
              backgroundColor: note.read ? 'var(--color-surface-white)' : 'var(--color-bg-sand)', 
              border: '1px solid',
              borderColor: note.read ? 'var(--color-border-limestone)' : 'var(--color-primary-navy)',
              borderRadius: 'var(--radius-lg)',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-surface-white)', 
              border: '1px solid var(--color-border-limestone)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}>
              {getNotificationIcon(note.title)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                <strong style={{ fontSize: '15px', color: note.read ? 'var(--color-text-dark)' : 'var(--color-primary-navy)' }}>
                  {note.title}
                </strong>
                <span className="text-meta" style={{ fontSize: '12px', color: 'var(--color-text-ash)' }}>{note.time}</span>
              </div>
              <div className="text-small" style={{ color: 'var(--color-text-slate)' }}>{note.body}</div>
            </div>

            {note.link && (
              <Link 
                to={note.link} 
                className="btn btn-secondary text-small"
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  markNotificationRead(note.id);
                }}
              >
                View <ArrowRight size={13} />
              </Link>
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>No {filter === 'unread' ? 'unread ' : ''}notifications</h3>
            <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>All system updates have been acknowledged.</p>
          </div>
        )}
      </div>
    </div>
  );
}

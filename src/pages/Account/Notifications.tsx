import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Sparkles, Tag, Calendar, Shield, ExternalLink } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import './Notifications.css';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useConsumerState();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterCategory === 'all') return true;
    return n.category === filterCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'viewing_update':
        return <Calendar size={18} className="notif-cat-icon viewing" />;
      case 'price_drop':
        return <Tag size={18} className="notif-cat-icon price" />;
      case 'concierge_recommendation':
        return <Sparkles size={18} className="notif-cat-icon concierge" />;
      case 'security_alert':
        return <Shield size={18} className="notif-cat-icon security" />;
      default:
        return <Bell size={18} className="notif-cat-icon default" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'viewing_update': return 'Viewing Update';
      case 'price_drop': return 'Price Adjustment';
      case 'concierge_recommendation': return 'Concierge Match';
      case 'security_alert': return 'Security Dossier';
      default: return 'System Notice';
    }
  };

  return (
    <div className="account-panel">
      <div className="panel-header flex-between">
        <div>
          <h1 className="h3">Private Notifications & Dispatches</h1>
          <p className="text-meta">Real-time alerts regarding your appointments, asset price changes, and concierge recommendations.</p>
        </div>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={markAllNotificationsRead}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <CheckCheck size={14} /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="notifications-filters">
        <button 
          className={`notif-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          All Notifications ({notifications.length})
        </button>
        <button 
          className={`notif-filter-btn ${filterCategory === 'viewing_update' ? 'active' : ''}`}
          onClick={() => setFilterCategory('viewing_update')}
        >
          Viewings
        </button>
        <button 
          className={`notif-filter-btn ${filterCategory === 'concierge_recommendation' ? 'active' : ''}`}
          onClick={() => setFilterCategory('concierge_recommendation')}
        >
          Concierge Picks
        </button>
        <button 
          className={`notif-filter-btn ${filterCategory === 'price_drop' ? 'active' : ''}`}
          onClick={() => setFilterCategory('price_drop')}
        >
          Price Updates
        </button>
        <button 
          className={`notif-filter-btn ${filterCategory === 'security_alert' ? 'active' : ''}`}
          onClick={() => setFilterCategory('security_alert')}
        >
          Security & Access
        </button>
      </div>

      <div className="panel-body">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={40} className="empty-icon" />
            <h3 className="h4">No notifications in this folder</h3>
            <p className="text-meta">All updates from your brokers and concierge will appear here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(item => (
              <div 
                key={item.id} 
                className={`notification-card ${!item.read ? 'unread' : ''}`}
                onClick={() => markNotificationRead(item.id)}
              >
                <div className="notif-icon-col">
                  {getCategoryIcon(item.category)}
                  {!item.read && <span className="notif-unread-glow"></span>}
                </div>

                <div className="notif-body-col">
                  <div className="notif-top-row">
                    <span className="notif-badge">{getCategoryLabel(item.category)}</span>
                    <span className="notif-time">{item.timestamp}</span>
                  </div>

                  <h3 className="notif-title">{item.title}</h3>
                  <p className="notif-message">{item.message}</p>

                  {item.link && (
                    <div className="notif-link-row">
                      <Link 
                        to={item.link} 
                        className="notif-action-link"
                        onClick={(e) => { e.stopPropagation(); markNotificationRead(item.id); }}
                      >
                        Inspect Resource <ExternalLink size={12} />
                      </Link>
                    </div>
                  )}
                </div>

                {!item.read && (
                  <button 
                    className="notif-read-btn"
                    onClick={(e) => { e.stopPropagation(); markNotificationRead(item.id); }}
                    title="Mark as read"
                    aria-label="Mark notification as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Clock, Trash2, Heart, ExternalLink } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import './RecentlyViewed.css';

export default function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed, removeRecentlyViewed, toggleFavorite, isFavorite } = useConsumerState();

  return (
    <div className="account-panel">
      <div className="panel-header flex-between">
        <div>
          <h1 className="h3">Recently Viewed Residences & Mobility</h1>
          <p className="text-meta">Audit trail of the architectural properties and luxury vehicles you have recently inspected.</p>
        </div>
        {recentlyViewed.length > 0 && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={clearRecentlyViewed}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      <div className="panel-body">
        {recentlyViewed.length === 0 ? (
          <div className="empty-state">
            <Clock size={40} className="empty-icon" />
            <h3 className="h4">No inspection history</h3>
            <p className="text-meta">Properties and vehicles you inspect across the marketplace will be logged here for convenient reference.</p>
            <Link to="/search" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="recently-viewed-grid">
            {recentlyViewed.map(item => {
              const linkUrl = item.type === 'property' ? `/property/${item.id}` : `/cars/${item.slug}`;
              const favorited = isFavorite(item.id);

              return (
                <div key={item.id} className="recent-card">
                  <div className="recent-img-wrap">
                    <img src={item.image} alt={item.title} />
                    <span className="recent-type-badge">
                      {item.type === 'property' ? 'Residence' : 'Vehicle'}
                    </span>
                    <button 
                      className={`recent-fav-btn ${favorited ? 'active' : ''}`}
                      onClick={() => toggleFavorite(item.id)}
                      title={favorited ? 'Remove from favorites' : 'Save to favorites'}
                      aria-label="Toggle favorite"
                    >
                      <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="recent-card-body">
                    <div className="recent-time-tag">
                      <Clock size={12} /> {item.viewedAt}
                    </div>

                    <h3 className="recent-title">{item.title}</h3>
                    <p className="recent-subtitle">{item.subtitle}</p>

                    <div className="recent-price-wrap">
                      <span className="recent-price">
                        {item.currency}{item.price.toLocaleString()}
                        {item.pricingCadence && <small className="text-meta"> {item.pricingCadence}</small>}
                      </span>
                    </div>

                    <div className="recent-card-actions">
                      <Link to={linkUrl} className="btn btn-secondary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        Inspect <ExternalLink size={12} />
                      </Link>
                      <button 
                        className="recent-remove-btn"
                        onClick={() => removeRecentlyViewed(item.id)}
                        title="Remove from history"
                        aria-label="Remove from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

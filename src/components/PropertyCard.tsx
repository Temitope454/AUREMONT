import { Heart, CheckCircle2, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/mockProperties';
import type { Property } from '../data/mockProperties';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
}

export default function PropertyCard({ property, layout = 'grid' }: PropertyCardProps) {
  const priceDisplay = `${formatPrice(property.price, property.currency)}${property.pricingCadence || ''}`;
  
  return (
    <Link to={`/property/${property.id}`} className={`property-card layout-${layout}`}>
      <div className="card-image-wrapper">
        <img src={property.mainImage} alt={property.title} className="card-image" loading="lazy" />
        {property.video && (
          <div className="media-indicator">
            <PlayCircle size={16} strokeWidth={1.5} />
          </div>
        )}
        <button 
          className="favorite-btn" 
          aria-label={property.favoriteState ? "Remove from saved" : "Save property"}
          onClick={(e) => {
            e.preventDefault();
            // In a real app, this would toggle state optimistically
          }}
        >
          <Heart 
            size={20} 
            strokeWidth={1.5} 
            className={property.favoriteState ? 'favorite-active' : ''} 
            fill={property.favoriteState ? 'var(--color-text-ink)' : 'transparent'} 
          />
        </button>
      </div>
      <div className="card-content">
        <div className="card-meta">
          {property.propertyType} · {property.transactionType === 'Buy' ? 'For sale' : `For ${property.transactionType.toLowerCase()}`}
        </div>
        <h3 className="card-title">{property.title}</h3>
        <p className="card-location">{property.neighborhood}, {property.city}</p>
        <p className="card-price">{priceDisplay}</p>
        <div className="card-specs">
          {property.beds > 0 && `${property.beds} beds`}
          {property.beds > 0 && property.baths > 0 && ' · '}
          {property.baths > 0 && `${property.baths} baths`}
          {property.size > 0 && ' · '}
          {property.size > 0 && `${property.size} ${property.sizeUnit}`}
        </div>
        <div className="card-provider">
          Listed by {property.provider.name} 
          {property.provider.verifiedIdentity && (
            <CheckCircle2 size={14} className="verified-icon" strokeWidth={2} aria-label="Identity verified" />
          )}
        </div>
        {layout === 'list' && (
          <div className="card-list-cta">
            <span className="btn btn-secondary">View residence</span>
          </div>
        )}
      </div>
    </Link>
  );
}

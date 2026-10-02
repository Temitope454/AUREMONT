import { Heart, Users, Battery, GitBranch, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../data/mockCars';
import { formatPrice } from '../data/mockProperties';
import './CarCard.css';

interface CarCardProps {
  car: Vehicle;
}

export default function CarCard({ car }: CarCardProps) {
  const priceDisplay = `${formatPrice(car.price, car.currency)}${car.pricingCadence}`;

  return (
    <Link to={`/cars/${car.slug}`} className="car-card">
      <div className="car-image-wrapper">
        <img src={car.mainImage} alt={`${car.make} ${car.model}`} className="car-image" loading="lazy" />
        <button 
          className="favorite-btn" 
          aria-label={car.favoriteState ? "Remove from saved" : "Save vehicle"}
          onClick={(e) => {
            e.preventDefault();
            // Optimistic mock state toggle
          }}
        >
          <Heart 
            size={20} 
            strokeWidth={1.5} 
            className={car.favoriteState ? 'favorite-active' : ''} 
            fill={car.favoriteState ? 'var(--color-text-ink)' : 'transparent'} 
          />
        </button>
      </div>
      
      <div className="car-content">
        <div className="car-meta">
          <span className="car-category">{car.category}</span>
          <span className="car-location"><MapPin size={12} style={{marginRight: '2px', display:'inline-block'}}/>{car.location.split(',')[0]}</span>
        </div>
        
        <h3 className="car-title">{car.make} {car.model}</h3>
        
        <div className="car-specs-row">
          <div className="car-spec-item" title="Seats">
            <Users size={14} /> {car.seats}
          </div>
          <div className="car-spec-item" title="Transmission">
            <GitBranch size={14} /> {car.transmission === 'Automatic' ? 'Auto' : 'Manual'}
          </div>
          <div className="car-spec-item" title="Powertrain">
            <Battery size={14} /> {car.powertrain}
          </div>
        </div>

        <div className="car-footer">
          <div className="car-price">
            <span className="amount">{priceDisplay}</span>
          </div>
          <div className="car-availability">
            {car.availability}
          </div>
        </div>
      </div>
    </Link>
  );
}

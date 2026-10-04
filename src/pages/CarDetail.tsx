import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Share, ChevronLeft, ChevronRight, X, CheckCircle2, Navigation } from 'lucide-react';
import { mockCars } from '../data/mockCars';
import type { Vehicle } from '../data/mockCars';
import { formatPrice } from '../data/mockProperties';
import { useAuth } from '../context/AuthContext';
import { useConsumerState } from '../context/ConsumerContext';
import CarCard from '../components/CarCard';

// Using PropertyDetail styles where sensible, plus specific overrides
import '../pages/PropertyDetail.css';
import './CarDetail.css';

export default function CarDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addRecentlyViewed, toggleFavorite, isFavorite } = useConsumerState();
  
  const [car, setCar] = useState<Vehicle | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const found = mockCars.find(c => c.slug === slug);
    setCar(found || null);
    if (found) {
      addRecentlyViewed({
        id: found.id,
        type: 'car',
        title: `${found.make} ${found.model}`,
        subtitle: `${found.location} · ${found.powertrain}`,
        price: found.price,
        currency: found.currency,
        pricingCadence: found.pricingCadence,
        image: found.mainImage,
        slug: found.slug,
      });
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!car) {
    return (
      <div className="property-detail-container not-found">
        <div className="container">
          <h2>Vehicle not found.</h2>
          <p>This vehicle may have been removed or is currently unavailable.</p>
          <Link to="/cars" className="btn btn-primary">Return to mobility</Link>
        </div>
      </div>
    );
  }

  const similarCars = mockCars
    .filter(c => c.id !== car.id && (c.category === car.category || c.location === car.location))
    .slice(0, 3);

  const priceDisplay = `${formatPrice(car.price, car.currency)}${car.pricingCadence}`;

  const handleBookingRequest = () => {
    if (!isAuthenticated) {
      // Must authenticate to book
      navigate('/login', { state: { from: location } });
    } else {
      setIsBookingOpen(true);
    }
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingOpen(false);
    // Forward to checkout
    navigate('/checkout', { state: { itemType: 'vehicle', itemId: car.id } });
  };

  return (
    <div className="property-detail-container car-detail">
      
      <div className="detail-meta-header container">
        <div className="breadcrumbs text-meta">
          <Link to="/cars">Mobility</Link> <span className="separator">/</span> 
          <span>{car.location.split(',')[1]?.trim() || car.location}</span> <span className="separator">/</span> 
          <span>{car.category}</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn-labeled">
            <Share size={18} strokeWidth={1.5} /> Share
          </button>
          <button 
            className="icon-btn-labeled" 
            onClick={() => toggleFavorite(car.id)}
          >
            <Heart 
              size={18} 
              strokeWidth={1.5} 
              className={isFavorite(car.id) ? 'favorite-active' : ''} 
              fill={isFavorite(car.id) ? 'currentColor' : 'transparent'} 
            /> 
            {isFavorite(car.id) ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="container gallery-container desktop-only">
        <div className="gallery-grid" onClick={() => setIsGalleryOpen(true)}>
          <div className="gallery-main">
            <img src={car.mainImage} alt={car.model} />
          </div>
          <div className="gallery-side">
            {car.gallery.slice(0, 2).map((img, i) => (
              <div key={i} className="gallery-thumb">
                <img src={img} alt={`Detail ${i+1}`} />
              </div>
            ))}
          </div>
          <button className="btn btn-secondary view-all-btn">
            View all {car.gallery.length} photos
          </button>
        </div>
      </div>

      <div className="mobile-gallery mobile-only">
        <img src={car.mainImage} alt={car.model} onClick={() => setIsGalleryOpen(true)} />
        <div className="mobile-gallery-count">1 / {car.gallery.length}</div>
      </div>

      <div className="container detail-split">
        <div className="detail-main">
          
          <div className="property-title-section">
            <div className="property-badges">
              <span className="badge">{car.category}</span>
              <span className="badge">{car.year}</span>
            </div>
            <h1 className="h1">{car.make} {car.model}</h1>
            <p className="location-large">{car.location}</p>
          </div>

          <div className="core-specs-strip">
            <div className="spec-item">
              <span className="spec-value">{car.seats}</span>
              <span className="spec-label">Seats</span>
            </div>
            <div className="spec-item">
              <span className="spec-value">{car.doors}</span>
              <span className="spec-label">Doors</span>
            </div>
            <div className="spec-item">
              <span className="spec-value">{car.transmission}</span>
              <span className="spec-label">Transmission</span>
            </div>
            <div className="spec-item">
              <span className="spec-value">{car.powertrain}</span>
              <span className="spec-label">Powertrain</span>
            </div>
          </div>

          <div className="detail-section">
            <h2 className="h3">Features</h2>
            <div className="amenities-grid">
              {car.features.map((item, i) => (
                <div key={i} className="amenity-item">
                  <CheckCircle2 size={16} className="amenity-icon" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="amenity-item">
                 <CheckCircle2 size={16} className="amenity-icon" />
                 <span>Luggage: {car.luggageCapacity}</span>
              </div>
            </div>
          </div>

          <div className="detail-section provider-panel">
            <div className="provider-info">
              <div className="provider-avatar">
                <Navigation size={24} />
              </div>
              <div>
                <h3 className="h3" style={{marginBottom: '4px'}}>{car.provider.name}</h3>
                <p className="text-meta" style={{marginBottom: '8px'}}>Mobility Partner</p>
                {car.provider.verifiedIdentity && (
                  <div className="verified-badge">
                    <CheckCircle2 size={14} strokeWidth={2} /> Verified partner
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2 className="h3">Rental terms</h2>
            <p className="text-meta">{car.provider.terms}</p>
          </div>

        </div>

        <div className="detail-sidebar desktop-only">
          <div className="sticky-action-panel">
            <div className="panel-price">{priceDisplay}</div>
            <div className="panel-availability">Available: {car.availability}</div>
            
            <div className="panel-actions">
              <button className="btn btn-primary w-full" onClick={handleBookingRequest}>
                Continue to booking
              </button>
            </div>
            
            <div className="panel-trust">
              <p className="text-meta">No charge until confirmation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-action-bar mobile-only">
        <div className="mobile-action-price">
          <span className="price">{priceDisplay}</span>
        </div>
        <button className="btn btn-primary" onClick={handleBookingRequest}>
          Book
        </button>
      </div>

      {similarCars.length > 0 && (
        <div className="similar-section container">
          <h2 className="h2" style={{marginBottom: 'var(--space-8)'}}>Similar vehicles</h2>
          <div className="grid grid-cols-12">
            {similarCars.map(c => (
              <div key={c.id} className="col-span-12 md-col-span-4">
                <CarCard car={c} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isGalleryOpen && (
        <div className="fullscreen-gallery dark-theme">
          <div className="gallery-header">
            <div className="gallery-counter">{currentImageIndex + 1} / {car.gallery.length}</div>
            <button className="icon-btn" onClick={() => setIsGalleryOpen(false)} aria-label="Close gallery">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <button className="gallery-nav prev" onClick={() => setCurrentImageIndex(prev => prev === 0 ? car.gallery.length - 1 : prev - 1)}>
            <ChevronLeft size={32} strokeWidth={1} />
          </button>
          <div className="gallery-viewport">
            <img src={car.gallery[currentImageIndex]} alt={`Gallery view ${currentImageIndex + 1}`} />
          </div>
          <button className="gallery-nav next" onClick={() => setCurrentImageIndex(prev => prev === car.gallery.length - 1 ? 0 : prev + 1)}>
            <ChevronRight size={32} strokeWidth={1} />
          </button>
        </div>
      )}

      {isBookingOpen && (
        <>
          <div className="dialog-overlay" onClick={() => setIsBookingOpen(false)}></div>
          <div className="contact-dialog booking-dialog">
            <div className="dialog-header">
              <h3>Request booking</h3>
              <button className="icon-btn" onClick={() => setIsBookingOpen(false)}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={submitBooking}>
              <div className="dialog-content">
                <p>Booking the <strong>{car.make} {car.model}</strong> in {car.location.split(',')[0]}.</p>
                
                <div className="form-group" style={{marginTop: 'var(--space-4)'}}>
                  <label>Pickup Location</label>
                  <select className="input-field" required>
                    <option value="">Select location</option>
                    <option value="airport">Airport Terminal</option>
                    <option value="residence">Delivery to Residence</option>
                  </select>
                </div>

                <div className="form-row grid-2">
                  <div className="form-group">
                    <label>Pickup Date</label>
                    <input type="date" className="input-field" required />
                  </div>
                  <div className="form-group">
                    <label>Return Date</label>
                    <input type="date" className="input-field" required />
                  </div>
                </div>
              </div>
              <div className="dialog-footer">
                <button type="submit" className="btn btn-primary w-full">
                  Continue to checkout
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

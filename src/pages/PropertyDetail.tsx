import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share, ChevronLeft, ChevronRight, X, CheckCircle2, MapPin } from 'lucide-react';
import { mockProperties, formatPrice } from '../data/mockProperties';
import type { Property } from '../data/mockProperties';
import PropertyCard from '../components/PropertyCard';
import { useConsumerState } from '../context/ConsumerContext';
import './PropertyDetail.css';

export default function PropertyDetail({ previewProperty }: { previewProperty?: Property } = {}) {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(previewProperty || null);
  const { addRecentlyViewed, toggleFavorite, isFavorite, createInquiryThread, createBooking } = useConsumerState();
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [confirmationToast, setConfirmationToast] = useState<string | null>(null);

  useEffect(() => {
    let currentProp: Property | undefined;
    if (previewProperty) {
      currentProp = previewProperty;
      setProperty(previewProperty);
    } else {
      currentProp = mockProperties.find(p => p.id === id);
      setProperty(currentProp || null);
    }
    
    if (currentProp) {
      addRecentlyViewed({
        id: currentProp.id,
        type: 'property',
        title: currentProp.title,
        subtitle: `${currentProp.neighborhood}, ${currentProp.city}`,
        price: currentProp.price,
        currency: currentProp.currency,
        pricingCadence: currentProp.pricingCadence,
        image: currentProp.mainImage,
        slug: currentProp.slug,
      });
    }
    window.scrollTo(0, 0);
  }, [id, previewProperty]);

  if (!property) {
    return (
      <div className="property-detail-container not-found">
        <div className="container">
          <h2>Property not found.</h2>
          <p>This residence may have been removed or is currently unavailable.</p>
          <Link to="/search" className="btn btn-primary">Return to search</Link>
        </div>
      </div>
    );
  }

  const similarProperties = mockProperties
    .filter(p => p.id !== property.id && p.transactionType === property.transactionType)
    .slice(0, 3);

  const priceDisplay = `${formatPrice(property.price, property.currency)}${property.pricingCadence || ''}`;

  return (
    <div className="property-detail-container">
      
      {/* Top Meta Header */}
      <div className="detail-meta-header container">
        <div className="breadcrumbs text-meta">
          <Link to="/search">Search</Link> <span className="separator">/</span> 
          <span>{property.country}</span> <span className="separator">/</span> 
          <span>{property.city}</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn-labeled">
            <Share size={18} strokeWidth={1.5} /> Share
          </button>
          <button 
            className="icon-btn-labeled"
            onClick={() => toggleFavorite(property.id)}
          >
            <Heart 
              size={18} 
              strokeWidth={1.5} 
              className={isFavorite(property.id) ? 'favorite-active' : ''} 
              fill={isFavorite(property.id) ? 'currentColor' : 'transparent'} 
            /> 
            {isFavorite(property.id) ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Cinematic Gallery Grid (Desktop) */}
      <div className="container gallery-container desktop-only">
        <div className="gallery-grid" onClick={() => setIsGalleryOpen(true)}>
          <div className="gallery-main">
            <img src={property.mainImage} alt={property.title} />
          </div>
          <div className="gallery-side">
            {property.gallery.slice(0, 2).map((img, i) => (
              <div key={i} className="gallery-thumb">
                <img src={img} alt={`Detail ${i+1}`} />
              </div>
            ))}
          </div>
          <button className="btn btn-secondary view-all-btn">
            View all {property.gallery.length} photos
          </button>
        </div>
      </div>

      {/* Mobile Swipe Gallery */}
      <div className="mobile-gallery mobile-only">
        <img src={property.mainImage} alt={property.title} onClick={() => setIsGalleryOpen(true)} />
        <div className="mobile-gallery-count">1 / {property.gallery.length}</div>
      </div>

      {/* Main Content Split */}
      <div className="container detail-split">
        <div className="detail-main">
          
          <div className="property-title-section">
            <div className="property-badges">
              <span className="badge">{property.propertyType}</span>
              {property.listingVerified && <span className="badge verified"><CheckCircle2 size={12} strokeWidth={2}/> Listing reviewed</span>}
            </div>
            <h1 className="h1">{property.title}</h1>
            <p className="location-large"><MapPin size={18} strokeWidth={1.5} /> {property.neighborhood}, {property.city}</p>
          </div>

          <div className="core-specs-strip">
            <div className="spec-item">
              <span className="spec-value">{property.beds}</span>
              <span className="spec-label">Bedrooms</span>
            </div>
            <div className="spec-item">
              <span className="spec-value">{property.baths}</span>
              <span className="spec-label">Bathrooms</span>
            </div>
            <div className="spec-item">
              <span className="spec-value">{property.size}</span>
              <span className="spec-label">{property.sizeUnit}</span>
            </div>
            <div className="spec-item">
              <span className="spec-value">{property.furnished ? 'Yes' : 'No'}</span>
              <span className="spec-label">Furnished</span>
            </div>
          </div>

          <div className="detail-section">
            <h2 className="h3">The Residence</h2>
            <p className="large property-story">{property.description}</p>
          </div>

          <div className="detail-section">
            <h2 className="h3">Features & Amenities</h2>
            <div className="amenities-grid">
              {property.features.concat(property.amenities).map((item, i) => (
                <div key={i} className="amenity-item">
                  <CheckCircle2 size={16} className="amenity-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2 className="h3">Location</h2>
            <p>{property.neighborhood}, {property.city}, {property.country}</p>
            <div className="mock-detail-map">
               <div className="mock-map-bg"></div>
               <div className="map-area-circle"></div>
               <span className="map-caption text-meta">Location shown approximately</span>
            </div>
          </div>

          {/* Provider Panel */}
          <div className="detail-section provider-panel">
            <div className="provider-info">
              <div className="provider-avatar">
                {property.provider.name.charAt(0)}
              </div>
              <div>
                <h3 className="h3" style={{marginBottom: '4px'}}>{property.provider.name}</h3>
                <p className="text-meta" style={{marginBottom: '8px'}}>{property.provider.role} {property.provider.agency && `· ${property.provider.agency}`}</p>
                {property.provider.verifiedIdentity && (
                  <div className="verified-badge">
                    <CheckCircle2 size={14} strokeWidth={2} /> Identity verified
                  </div>
                )}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setIsContactOpen(true)}>Contact {property.provider.role.toLowerCase()}</button>
          </div>

        </div>

        {/* Sticky Action Panel */}
        <div className="detail-sidebar desktop-only">
          <div className="sticky-action-panel">
            <div className="panel-price">{priceDisplay}</div>
            {property.availability && (
              <div className="panel-availability">Available: {property.availability}</div>
            )}
            
            <div className="panel-actions">
              <button className="btn btn-primary w-full" onClick={() => setIsContactOpen(true)}>
                {property.transactionType === 'Rent' || property.transactionType === 'Lease' ? 'Request booking' : 'Request viewing'}
              </button>
              <button className="btn btn-secondary w-full" onClick={() => setIsContactOpen(true)}>
                Message {property.provider.role.toLowerCase()}
              </button>
            </div>
            
            <div className="panel-trust">
              <p className="text-meta">Secure communication through Auremont.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="mobile-action-bar mobile-only">
        <div className="mobile-action-price">
          <span className="price">{priceDisplay}</span>
        </div>
        <button className="btn btn-primary" onClick={() => setIsContactOpen(true)}>
          {property.transactionType === 'Rent' ? 'Request' : 'View'}
        </button>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="similar-section container">
          <h2 className="h2" style={{marginBottom: 'var(--space-8)'}}>Similar places</h2>
          <div className="grid grid-cols-12">
            {similarProperties.map(prop => (
              <div key={prop.id} className="col-span-12 md-col-span-4">
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Gallery */}
      {isGalleryOpen && (
        <div className="fullscreen-gallery dark-theme">
          <div className="gallery-header">
            <div className="gallery-counter">{currentImageIndex + 1} / {property.gallery.length}</div>
            <button className="icon-btn" onClick={() => setIsGalleryOpen(false)} aria-label="Close gallery">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          
          <button 
            className="gallery-nav prev" 
            onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.gallery.length - 1 : prev - 1)}
          >
            <ChevronLeft size={32} strokeWidth={1} />
          </button>
          
          <div className="gallery-viewport">
            <img src={property.gallery[currentImageIndex]} alt={`Gallery view ${currentImageIndex + 1}`} />
          </div>
          
          <button 
            className="gallery-nav next"
            onClick={() => setCurrentImageIndex(prev => prev === property.gallery.length - 1 ? 0 : prev + 1)}
          >
            <ChevronRight size={32} strokeWidth={1} />
          </button>
        </div>
      )}

      {/* Feedback Toast */}
      {confirmationToast && (
        <div className="alert alert-success" style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 1100, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
          <CheckCircle2 size={16} />
          <span>{confirmationToast}</span>
        </div>
      )}

      {/* Contact/Viewing Flow Dialog */}
      {isContactOpen && (
        <>
          <div className="dialog-overlay" onClick={() => setIsContactOpen(false)}></div>
          <div className="contact-dialog">
            <div className="dialog-header">
              <h3>{property.transactionType === 'Buy' ? 'Request a viewing' : 'Request booking'}</h3>
              <button className="icon-btn" onClick={() => setIsContactOpen(false)}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              createInquiryThread({
                propertyId: property.id,
                propertyTitle: property.title,
                propertyImage: property.mainImage,
                agentName: property.provider.name,
                agentAgency: property.provider.agency,
                message: inquiryText.trim() || `I am requesting private accompanied access for ${property.title} on ${preferredDate || 'the earliest available appointment slot'}.`,
              });

              if (preferredDate) {
                createBooking({
                  type: 'property_viewing',
                  itemTitle: property.title,
                  itemSubtitle: `${property.neighborhood}, ${property.city}`,
                  itemImage: property.mainImage,
                  referenceId: property.id,
                  scheduledDate: preferredDate,
                  scheduledTime: '15:00',
                  format: 'In-Person Accompanied',
                  agentName: property.provider.name,
                  agentPhone: '+33 1 42 68 55 00',
                  notes: inquiryText.trim() || 'Direct booking from residence page.',
                });
              }

              setIsContactOpen(false);
              setConfirmationToast(`Your viewing request for ${property.title} was submitted to ${property.provider.name}. View in Account.`);
              setTimeout(() => setConfirmationToast(null), 5000);
            }}>
              <div className="dialog-content">
                <p>You are requesting to {property.transactionType.toLowerCase()} <strong>{property.title}</strong>.</p>
                
                <div className="form-group" style={{marginTop: 'var(--space-4)'}}>
                  <label className="text-meta">Preferred Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group" style={{marginTop: 'var(--space-4)'}}>
                  <label className="text-meta">Message to {property.provider.name}</label>
                  <textarea 
                    className="input-field" 
                    style={{height: '100px', paddingTop: '12px'}} 
                    placeholder="Introduce yourself and share your requirements..."
                    value={inquiryText}
                    onChange={e => setInquiryText(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="dialog-footer">
                <button type="submit" className="btn btn-primary w-full">
                  Transmit Request
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

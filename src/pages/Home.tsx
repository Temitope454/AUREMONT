import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import './Home.css';
import { mockProperties } from '../data/mockProperties';

export default function Home() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'buy' | 'rent' | 'lease' | 'cars'>('buy');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === 'cars') {
      navigate('/cars');
    } else {
      const queryParam = searchLocation.trim() ? `?location=${encodeURIComponent(searchLocation.trim())}` : '';
      navigate(`/${activeMode}${queryParam}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src="/images/auremont_hero.jpg" alt="Exceptional residence" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="hero-content">
            <h1 className="hero-headline">Exceptional places, clearly discovered.</h1>
            <p className="hero-subline large">Explore considered homes, rentals and stays across the world through one trusted marketplace.</p>
            
            <form className="search-composer" onSubmit={handleSearchSubmit}>
              <div className="search-modes" role="tablist" aria-label="Marketplace Category">
                <button 
                  type="button"
                  className={`mode-btn ${activeMode === 'buy' ? 'active' : ''}`}
                  onClick={() => setActiveMode('buy')}
                  role="tab"
                  aria-selected={activeMode === 'buy'}
                >
                  Buy
                </button>
                <button 
                  type="button"
                  className={`mode-btn ${activeMode === 'rent' ? 'active' : ''}`}
                  onClick={() => setActiveMode('rent')}
                  role="tab"
                  aria-selected={activeMode === 'rent'}
                >
                  Rent
                </button>
                <button 
                  type="button"
                  className={`mode-btn ${activeMode === 'lease' ? 'active' : ''}`}
                  onClick={() => setActiveMode('lease')}
                  role="tab"
                  aria-selected={activeMode === 'lease'}
                >
                  Lease
                </button>
                <button 
                  type="button"
                  className={`mode-btn ${activeMode === 'cars' ? 'active' : ''}`}
                  onClick={() => setActiveMode('cars')}
                  role="tab"
                  aria-selected={activeMode === 'cars'}
                >
                  Cars
                </button>
              </div>
              <div className="search-inputs">
                <div className="input-group search-location">
                  <label htmlFor="search-dest-input">Where</label>
                  <input 
                    id="search-dest-input"
                    type="text" 
                    placeholder="Search destinations (e.g. Paris, London)" 
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                  />
                </div>
                <div className="input-group desktop-only">
                  <label htmlFor="prop-type-input">Property type</label>
                  <input id="prop-type-input" type="text" placeholder="Any" readOnly />
                </div>
                <div className="input-group desktop-only">
                  <label htmlFor="price-range-input">Price</label>
                  <input id="price-range-input" type="text" placeholder="Any" readOnly />
                </div>
                <button type="submit" className="btn btn-primary search-submit" aria-label="Perform Search">
                  <Search size={20} strokeWidth={1.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Curated Properties */}
      <section className="curated-section">
        <div className="container">
          <div className="section-header justify-between items-center flex" style={{ flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <h2 className="h2" style={{ margin: 0 }}>Residences worth a closer look.</h2>
            <Link to="/search" className="btn btn-secondary desktop-only">View all properties</Link>
          </div>
          
          <div className="grid grid-cols-12 property-grid">
            {mockProperties.slice(0, 4).map((prop, index) => (
              <div key={prop.id} className={`col-span-12 ${index === 0 ? 'md-col-span-8' : 'md-col-span-4'}`}>
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
          
          <Link to="/search" className="btn btn-secondary mobile-only w-full" style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            View all properties
          </Link>
        </div>
      </section>

      {/* Signature Property Story */}
      <section className="signature-section dark-theme">
        <div className="signature-image-wrapper">
          <img src="/images/paris_apartment.jpg" alt="Signature property detail" className="signature-bg" />
        </div>
        <div className="container relative">
          <div className="signature-content">
            <h2 className="h2">An apartment framed by Parisian rooftops.</h2>
            <p className="large">Set on an upper floor near the Seine, this three-bedroom apartment pairs a restrained contemporary renovation with the proportions of a classic Paris residence.</p>
            <Link to="/property/p-1001" className="btn btn-primary" style={{ marginTop: 'var(--space-4)', display: 'inline-flex' }}>
              Explore property
            </Link>
          </div>
        </div>
      </section>
      
      {/* Trust Layer */}
      <section className="trust-section">
        <div className="container">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md-col-span-4 trust-card">
              <h3>Discover</h3>
              <p>Explore precise, editorial-quality listings across major global destinations.</p>
            </div>
            <div className="col-span-12 md-col-span-4 trust-card">
              <h3>Connect</h3>
              <p>Communicate directly with verified agents and landlords through our secure platform.</p>
            </div>
            <div className="col-span-12 md-col-span-4 trust-card">
              <h3>Complete</h3>
              <p>Finalize viewing requests and securely manage transaction payments in one place.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


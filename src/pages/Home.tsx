import { Search } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

import { mockProperties } from '../data/mockProperties';

export default function Home() {
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
            
            <div className="search-composer">
              <div className="search-modes">
                <button className="mode-btn active">Buy</button>
                <button className="mode-btn">Rent</button>
                <button className="mode-btn">Lease</button>
                <button className="mode-btn">Cars</button>
              </div>
              <div className="search-inputs">
                <div className="input-group search-location">
                  <label>Where</label>
                  <input type="text" placeholder="Search destinations" />
                </div>
                <div className="input-group desktop-only">
                  <label>Property type</label>
                  <input type="text" placeholder="Any" />
                </div>
                <div className="input-group desktop-only">
                  <label>Price</label>
                  <input type="text" placeholder="Any" />
                </div>
                <button className="btn btn-primary search-submit" aria-label="Search">
                  <Search size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Properties */}
      <section className="curated-section">
        <div className="container">
          <div className="section-header justify-between items-center flex">
            <h2>Residences worth a closer look.</h2>
            <button className="btn btn-secondary desktop-only">View all properties</button>
          </div>
          
          <div className="grid grid-cols-12 property-grid">
            {mockProperties.slice(0, 4).map((prop, index) => (
              <div key={prop.id} className={`col-span-12 ${index === 0 ? 'md-col-span-8' : 'md-col-span-4'}`}>
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
          
          <button className="btn btn-secondary mobile-only w-full" style={{ marginTop: 'var(--space-6)' }}>
            View all properties
          </button>
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
            <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Explore property</button>
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

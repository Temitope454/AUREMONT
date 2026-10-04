import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Building, Key, Sparkles, Car } from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import './Explore.css';

interface CityExploreCard {
  name: string;
  country: string;
  image: string;
  description: string;
  neighborhoods: string[];
}

const citiesData: CityExploreCard[] = [
  {
    name: 'Paris',
    country: 'France',
    image: '/images/paris_apartment.jpg',
    description: 'Haussmannian volumes, wrought-iron balconies along the Seine, and quiet courtyard addresses in the 6th, 7th, and 8th arrondissements.',
    neighborhoods: ['7th arrondissement', 'Saint-Germain-des-Prés', 'Faubourg Saint-Honoré'],
  },
  {
    name: 'London',
    country: 'United Kingdom',
    image: '/images/london_apartment.jpg',
    description: 'Canal-fronting warehouse conversions in Islington, discreet mews houses in Belgravia, and executive commercial suites on Mount Street.',
    neighborhoods: ['Islington', 'Belgravia', 'Mayfair'],
  },
  {
    name: 'Madrid',
    country: 'Spain',
    image: '/images/madrid_apartment.jpg',
    description: 'Classic stone architecture alongside El Retiro park, period residences in Salamanca, and corporate studio addresses on Castellana.',
    neighborhoods: ['Retiro', 'Salamanca', 'Chamberí'],
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    image: '/images/lisbon_house.jpg',
    description: 'Restored pombaline buildings overlooking the Tagus estuary, courtyard living in Alfama, and boulevard offices along Avenida da Liberdade.',
    neighborhoods: ['Alfama', 'Chiado', 'Avenida da Liberdade'],
  },
  {
    name: 'Milan',
    country: 'Italy',
    image: '/images/milan_apartment.jpg',
    description: 'Double-height artisan lofts in Brera, panoramic contemporary high-rises in Porta Nuova, and private couture ateliers on Via della Spiga.',
    neighborhoods: ['Brera', 'Porta Nuova', 'Quadrilatero della Moda'],
  },
  {
    name: 'Dubai',
    country: 'UAE',
    image: '/images/dubai_residence.jpg',
    description: 'Geometric contemporary architecture overlooking Dubai Marina, private shoreline villas on Palm Jumeirah, and corporate suites in DIFC.',
    neighborhoods: ['Dubai Marina', 'Palm Jumeirah', 'DIFC'],
  },
  {
    name: 'New York',
    country: 'United States',
    image: '/images/paris_apartment.jpg',
    description: 'Cast-iron architectural proportions in Tribeca and SoHo, paired with historic Greek Revival brownstone duplexes in the West Village.',
    neighborhoods: ['Tribeca', 'West Village', 'SoHo'],
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    image: '/images/lisbon_house.jpg',
    description: 'Indoor-outdoor tropical modernism in Tanglin, panoramic skyline residences along Orchard Boulevard, and Grade-A workspaces on Marina Bay.',
    neighborhoods: ['Tanglin', 'Orchard', 'Marina Bay'],
  },
];

export default function Explore() {
  const getCityListingCount = (cityName: string) => {
    return mockProperties.filter(p => p.city.toLowerCase() === cityName.toLowerCase()).length;
  };

  return (
    <div className="explore-page">
      {/* Editorial Header */}
      <section className="explore-header-section">
        <div className="container">
          <div className="explore-header-content">
            <span className="section-kicker">Metropolitan Discovery</span>
            <h1 className="h1 explore-title">Eight Global Corridors. Clear Architectural Representation.</h1>
            <p className="large explore-subtitle">
              Explore residences, private tenancies, and commercial spaces across our eight primary metropolitan hubs. Each catalog entry reflects audited architectural details, precise dimensions, and direct provider representation.
            </p>
          </div>
        </div>
      </section>

      {/* Collection Categories Bar */}
      <section className="explore-collections-section">
        <div className="container">
          <h2 className="h3 section-heading">Curated Discovery Pathways</h2>
          <div className="collections-grid">
            <Link to="/buy" className="collection-card">
              <div className="collection-icon-wrap">
                <Building size={22} />
              </div>
              <div className="collection-text">
                <h3 className="collection-title">Outright Acquisitions</h3>
                <p className="collection-desc">Prime freehold and apartment purchases across eight metropolitan centers.</p>
                <span className="collection-link">Explore Sale Catalog <ArrowRight size={14} /></span>
              </div>
            </Link>

            <Link to="/rent" className="collection-card">
              <div className="collection-icon-wrap">
                <Key size={22} />
              </div>
              <div className="collection-text">
                <h3 className="collection-title">Residential Tenancies</h3>
                <p className="collection-desc">Furnished and unfurnished residences available for medium and long-term tenancies.</p>
                <span className="collection-link">Explore Rental Catalog <ArrowRight size={14} /></span>
              </div>
            </Link>

            <Link to="/lease" className="collection-card">
              <div className="collection-icon-wrap">
                <Sparkles size={22} />
              </div>
              <div className="collection-text">
                <h3 className="collection-title">Commercial & Studio Leases</h3>
                <p className="collection-desc">Ateliers, galleries, executive suites, and creative spaces for professional use.</p>
                <span className="collection-link">Explore Commercial Leases <ArrowRight size={14} /></span>
              </div>
            </Link>

            <Link to="/cars" className="collection-card">
              <div className="collection-icon-wrap">
                <Car size={22} />
              </div>
              <div className="collection-text">
                <h3 className="collection-title">Auremont Mobility</h3>
                <p className="collection-desc">Executive sedan, sports, and SUV fleet bookings available in European and Gulf hubs.</p>
                <span className="collection-link">Explore Vehicle Fleet <ArrowRight size={14} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* City Hubs Grid */}
      <section className="explore-cities-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>Metropolitan Hubs</h2>
              <p className="text-meta" style={{ marginTop: '4px' }}>
                Select a metropolis to view active residential and commercial availability.
              </p>
            </div>
            <Link to="/search" className="btn btn-secondary desktop-only">
              Search All Listings
            </Link>
          </div>

          <div className="cities-grid">
            {citiesData.map(city => {
              const count = getCityListingCount(city.name);

              return (
                <div key={city.name} className="city-card">
                  <div className="city-image-wrap">
                    <img src={city.image} alt={city.name} className="city-img" />
                    <div className="city-badge-top">
                      <span className="city-count">{count} verified listings</span>
                    </div>
                  </div>

                  <div className="city-card-body">
                    <div className="city-title-row">
                      <h3 className="city-name">
                        <MapPin size={16} className="city-pin" /> {city.name}
                      </h3>
                      <span className="city-country">{city.country}</span>
                    </div>

                    <p className="city-desc">{city.description}</p>

                    <div className="city-neighborhoods">
                      {city.neighborhoods.map(nb => (
                        <span key={nb} className="neighborhood-chip">{nb}</span>
                      ))}
                    </div>

                    <div className="city-actions">
                      <Link 
                        to={`/search?city=${encodeURIComponent(city.name)}`} 
                        className="btn btn-secondary btn-sm w-full city-explore-btn"
                      >
                        Explore {city.name} Listings <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mobile-only" style={{ marginTop: 'var(--space-6)' }}>
            <Link to="/search" className="btn btn-secondary w-full" style={{ textAlign: 'center' }}>
              Search All Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Map as MapIcon, Grid as GridIcon, List as ListIcon, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { mockProperties, formatPrice } from '../data/mockProperties';
import type { Property } from '../data/mockProperties';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL State
  const mode = searchParams.get('mode') || 'Buy';
  const query = searchParams.get('q') || '';
  const view = searchParams.get('view') || 'grid'; // 'grid', 'list', 'map'
  const sort = searchParams.get('sort') || 'recommended';
  
  // Local UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Simple Location Autocomplete Mock
  const locations = [
    { label: 'Paris, France', type: 'Country/City' },
    { label: '7th arrondissement, Paris', type: 'Neighborhood' },
    { label: 'Retiro, Madrid', type: 'Neighborhood' },
    { label: 'Alfama, Lisbon', type: 'Neighborhood' },
    { label: 'Brera, Milan', type: 'Neighborhood' },
    { label: 'Tribeca, New York', type: 'Neighborhood' },
    { label: 'Dubai Marina, Dubai', type: 'Neighborhood' },
    { label: 'Tanglin, Singapore', type: 'Neighborhood' }
  ];

  // Filtering Logic
  useEffect(() => {
    let results = mockProperties.filter(p => p.transactionType === mode);
    
    if (query) {
      results = results.filter(p => 
        p.city.toLowerCase().includes(query.toLowerCase()) || 
        p.neighborhood.toLowerCase().includes(query.toLowerCase()) ||
        p.country.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Sort logic
    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      results.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }

    setFilteredProperties(results);
  }, [mode, query, sort]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', localQuery);
    setIsLocationOpen(false);
  };

  return (
    <div className={`search-page view-${view}`}>
      
      {/* Refined Desktop Search Header */}
      <div className="search-header">
        <div className="search-header-container">
          
          <div className="search-modes-compact">
            {['Buy', 'Rent', 'Lease', 'Cars'].map(m => (
              <button 
                key={m} 
                className={`mode-tab ${mode === m ? 'active' : ''}`}
                onClick={() => updateParam('mode', m)}
              >
                {m}
              </button>
            ))}
          </div>
          
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="location-input-wrapper">
              <SearchIcon size={18} strokeWidth={1.5} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search locations..." 
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  setIsLocationOpen(true);
                }}
                onFocus={() => setIsLocationOpen(true)}
              />
              {isLocationOpen && (
                <div className="autocomplete-dropdown">
                  {locations.filter(l => l.label.toLowerCase().includes(localQuery.toLowerCase())).map((loc, idx) => (
                    <div 
                      key={idx} 
                      className="autocomplete-item"
                      onClick={() => {
                        setLocalQuery(loc.label);
                        updateParam('q', loc.label);
                        setIsLocationOpen(false);
                      }}
                    >
                      <span className="loc-label">{loc.label}</span>
                      <span className="loc-type">{loc.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger" onClick={() => setIsFilterOpen(true)}>
              Price <ChevronDown size={14} />
            </button>
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger" onClick={() => setIsFilterOpen(true)}>
              Property type <ChevronDown size={14} />
            </button>
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger advanced" onClick={() => setIsFilterOpen(true)}>
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              <span>Filters</span>
            </button>
          </form>
          
        </div>
      </div>
      
      {/* Main Content Area (Split map support) */}
      <div className="search-content">
        
        {/* Results Pane */}
        <div className="results-pane">
          <div className="results-header">
            <div>
              <h1 className="h3" style={{marginBottom: 0}}>
                {query ? `Residences in ${query.split(',')[0]}` : 'Explore global residences'}
              </h1>
              <p className="text-meta" style={{marginBottom: 0, marginTop: '4px'}}>
                {filteredProperties.length} properties
              </p>
            </div>
            
            <div className="results-controls">
              <div className="sort-control">
                <span className="text-meta">Sort by:</span>
                <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
              
              <div className="view-controls desktop-only">
                <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => updateParam('view', 'grid')} aria-label="Grid view">
                  <GridIcon size={18} strokeWidth={1.5} />
                </button>
                <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => updateParam('view', 'list')} aria-label="List view">
                  <ListIcon size={18} strokeWidth={1.5} />
                </button>
                <button className={`view-btn ${view === 'map' ? 'active' : ''}`} onClick={() => updateParam('view', 'map')} aria-label="Map view">
                  <MapIcon size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Applied filters chips would go here */}
          {query && (
            <div className="active-filters">
              <div className="filter-chip">
                {query} <X size={14} onClick={() => { setLocalQuery(''); updateParam('q', ''); }} style={{cursor: 'pointer'}} />
              </div>
            </div>
          )}

          {/* Properties Grid/List */}
          {filteredProperties.length > 0 ? (
            <div className={`properties-container layout-${view}`}>
              {filteredProperties.map(prop => (
                <div key={prop.id} className="property-wrapper">
                  <PropertyCard property={prop} layout={view === 'list' ? 'list' : 'grid'} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3 className="h3">No matching properties found.</h3>
              <p>Try adjusting your search criteria or expanding your location.</p>
              <button className="btn btn-secondary" onClick={() => { setLocalQuery(''); updateParam('q', ''); }}>Clear search</button>
            </div>
          )}
        </div>

        {/* Map Pane (Mock) */}
        {view === 'map' && (
          <div className="map-pane desktop-only">
            <div className="mock-map">
              <div className="mock-map-bg"></div>
              {filteredProperties.map((prop, i) => (
                <div 
                  key={prop.id} 
                  className="map-marker"
                  style={{ top: `${20 + (i * 15)}%`, left: `${30 + (i * 20)}%` }} // Fake coords for demo
                >
                  {formatPrice(prop.price, prop.currency)}
                </div>
              ))}
              <div className="map-overlay-controls">
                <button className="btn btn-primary" style={{ height: '36px' }}>Search this area</button>
              </div>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Mobile Sticky Map Button */}
      {view !== 'map' && (
        <button className="mobile-map-toggle mobile-only" onClick={() => updateParam('view', 'map')}>
          <MapIcon size={18} strokeWidth={1.5} /> Map
        </button>
      )}

      {/* Advanced Filter Drawer */}
      {isFilterOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsFilterOpen(false)}></div>
          <div className="filter-drawer">
            <div className="drawer-header">
              <h3>Filters</h3>
              <button className="icon-btn" onClick={() => setIsFilterOpen(false)}>
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="drawer-content">
              {/* Mock filter content */}
              <div className="filter-section">
                <h4>Price range</h4>
                <div className="flex gap-4">
                  <input type="text" className="input-field" placeholder="Minimum" />
                  <input type="text" className="input-field" placeholder="Maximum" />
                </div>
              </div>
              <div className="filter-section">
                <h4>Bedrooms</h4>
                <div className="segmented-control">
                  {['Any', '1+', '2+', '3+', '4+'].map(b => (
                    <button key={b} className={b === 'Any' ? 'active' : ''}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <h4>Property type</h4>
                <div className="checkbox-group">
                  <label><input type="checkbox" defaultChecked /> Apartment</label>
                  <label><input type="checkbox" defaultChecked /> House</label>
                  <label><input type="checkbox" defaultChecked /> Villa</label>
                  <label><input type="checkbox" defaultChecked /> Loft</label>
                </div>
              </div>
              <div className="filter-section">
                <h4>Amenities</h4>
                <div className="checkbox-group grid-2">
                  <label><input type="checkbox" /> Air conditioning</label>
                  <label><input type="checkbox" /> Elevator</label>
                  <label><input type="checkbox" /> Terrace</label>
                  <label><input type="checkbox" /> Pool</label>
                </div>
              </div>
            </div>
            <div className="drawer-footer">
              <button className="btn btn-quiet">Clear all</button>
              <button className="btn btn-primary" onClick={() => setIsFilterOpen(false)}>Show {filteredProperties.length} residences</button>
            </div>
          </div>
        </>
      )}
      
    </div>
  );
}

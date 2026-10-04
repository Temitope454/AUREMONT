import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Map as MapIcon, Grid as GridIcon, List as ListIcon, SlidersHorizontal, ChevronDown, X, RotateCcw } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { mockProperties, formatPrice } from '../data/mockProperties';
import './Search.css';

export default function Search({ defaultMode }: { defaultMode?: 'Buy' | 'Rent' | 'Lease' } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active mode from path or params
  const determinedMode = useMemo(() => {
    if (defaultMode) return defaultMode;
    const path = location.pathname.toLowerCase();
    if (path.includes('/buy')) return 'Buy';
    if (path.includes('/rent')) return 'Rent';
    if (path.includes('/lease')) return 'Lease';
    
    const paramMode = searchParams.get('mode');
    if (paramMode) {
      const lower = paramMode.toLowerCase();
      if (lower === 'buy') return 'Buy';
      if (lower === 'rent') return 'Rent';
      if (lower === 'lease') return 'Lease';
    }
    return 'Buy';
  }, [defaultMode, location.pathname, searchParams]);

  // URL State
  const query = searchParams.get('q') || searchParams.get('location') || searchParams.get('city') || '';
  const view = searchParams.get('view') || 'grid';
  const sort = searchParams.get('sort') || 'recommended';
  const selectedTypeParam = searchParams.get('type') || '';

  // Local UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  
  // Filter drawer states
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [minBeds, setMinBeds] = useState<string>(searchParams.get('beds') || 'Any');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    return selectedTypeParam ? [selectedTypeParam] : ['Apartment', 'House', 'Villa', 'Loft', 'Residence', 'Commercial'];
  });
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || 'All');

  // Simple Location Autocomplete
  const locations = [
    { label: 'Paris, France', city: 'Paris', type: 'Country/City' },
    { label: '7th arrondissement, Paris', city: 'Paris', type: 'Neighborhood' },
    { label: 'London, United Kingdom', city: 'London', type: 'Country/City' },
    { label: 'Mayfair, London', city: 'London', type: 'Neighborhood' },
    { label: 'Madrid, Spain', city: 'Madrid', type: 'Country/City' },
    { label: 'Retiro, Madrid', city: 'Madrid', type: 'Neighborhood' },
    { label: 'Lisbon, Portugal', city: 'Lisbon', type: 'Country/City' },
    { label: 'Alfama, Lisbon', city: 'Lisbon', type: 'Neighborhood' },
    { label: 'Milan, Italy', city: 'Milan', type: 'Country/City' },
    { label: 'Brera, Milan', city: 'Milan', type: 'Neighborhood' },
    { label: 'Dubai, UAE', city: 'Dubai', type: 'Country/City' },
    { label: 'Dubai Marina, Dubai', city: 'Dubai', type: 'Neighborhood' },
    { label: 'New York, United States', city: 'New York', type: 'Country/City' },
    { label: 'Tribeca, New York', city: 'New York', type: 'Neighborhood' },
    { label: 'Singapore', city: 'Singapore', type: 'Country/City' },
    { label: 'Tanglin, Singapore', city: 'Singapore', type: 'Neighborhood' }
  ];

  // Primary filtering logic
  const filteredProperties = useMemo(() => {
    let results = mockProperties.filter(p => p.transactionType === determinedMode);

    // City / General Query filter
    if (query) {
      const qLower = query.toLowerCase();
      results = results.filter(p =>
        p.city.toLowerCase().includes(qLower) ||
        p.neighborhood.toLowerCase().includes(qLower) ||
        p.country.toLowerCase().includes(qLower) ||
        p.title.toLowerCase().includes(qLower)
      );
    }

    // City Dropdown Filter
    if (selectedCity && selectedCity !== 'All') {
      results = results.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Property Type Filter
    if (selectedTypes.length > 0) {
      results = results.filter(p => selectedTypes.includes(p.propertyType));
    }

    // Min / Max Price Filter
    if (minPrice && !isNaN(Number(minPrice))) {
      results = results.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      results = results.filter(p => p.price <= Number(maxPrice));
    }

    // Bedrooms filter
    if (minBeds !== 'Any') {
      const requiredBeds = parseInt(minBeds, 10);
      if (!isNaN(requiredBeds)) {
        results = results.filter(p => p.beds >= requiredBeds);
      }
    }

    // Sort logic
    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      results.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }

    return results;
  }, [determinedMode, query, selectedCity, selectedTypes, minPrice, maxPrice, minBeds, sort]);

  // Sync query when searchParams change
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleModeChange = (newMode: 'Buy' | 'Rent' | 'Lease' | 'Cars') => {
    if (newMode === 'Cars') {
      navigate('/cars');
      return;
    }
    // Maintain query when switching mode
    const path = `/${newMode.toLowerCase()}`;
    const qStr = searchParams.toString();
    navigate(qStr ? `${path}?${qStr}` : path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', localQuery.trim());
    setIsLocationOpen(false);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('Any');
    setSelectedCity('All');
    setSelectedTypes(['Apartment', 'House', 'Villa', 'Loft', 'Residence', 'Commercial']);
    setLocalQuery('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className={`search-page view-${view}`}>
      {/* Desktop & Mobile Search Control Header */}
      <div className="search-header">
        <div className="search-header-container">
          
          {/* Mode Switcher Tabs */}
          <div className="search-modes-compact" role="tablist" aria-label="Transaction Type Selector">
            {(['Buy', 'Rent', 'Lease', 'Cars'] as const).map(m => (
              <button 
                key={m} 
                className={`mode-tab ${determinedMode === m ? 'active' : ''}`}
                onClick={() => handleModeChange(m)}
                role="tab"
                aria-selected={determinedMode === m}
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
                placeholder="Search metropolis (e.g. Paris, London, Milan)..." 
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
                        setLocalQuery(loc.city);
                        updateParam('q', loc.city);
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
              Price {minPrice || maxPrice ? '•' : ''} <ChevronDown size={14} />
            </button>
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger" onClick={() => setIsFilterOpen(true)}>
              Metropolis {selectedCity !== 'All' ? `(${selectedCity})` : ''} <ChevronDown size={14} />
            </button>
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger advanced" onClick={() => setIsFilterOpen(true)}>
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              <span>Filters</span>
            </button>
          </form>
          
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="search-content">
        
        {/* Results Pane */}
        <div className="results-pane">
          <div className="results-header">
            <div>
              <h1 className="h3" style={{ marginBottom: 0 }}>
                {determinedMode === 'Buy' && (query ? `Residences for Sale in ${query}` : 'Prime Residences for Acquisition')}
                {determinedMode === 'Rent' && (query ? `Luxury Tenancies in ${query}` : 'Curated Residential Tenancies')}
                {determinedMode === 'Lease' && (query ? `Commercial & Studio Leases in ${query}` : 'Commercial & Corporate Leases')}
              </h1>
              <p className="text-meta" style={{ marginBottom: 0, marginTop: '4px' }}>
                {filteredProperties.length} verified listings available
              </p>
            </div>
            
            <div className="results-controls">
              <div className="sort-control">
                <span className="text-meta">Sort by:</span>
                <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort listings">
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

          {/* Active Filter Chips */}
          {(query || selectedCity !== 'All' || minBeds !== 'Any' || minPrice || maxPrice) && (
            <div className="active-filters">
              {query && (
                <div className="filter-chip">
                  <span>Keyword: {query}</span>
                  <X size={14} onClick={() => { setLocalQuery(''); updateParam('q', ''); }} style={{ cursor: 'pointer' }} />
                </div>
              )}
              {selectedCity !== 'All' && (
                <div className="filter-chip">
                  <span>City: {selectedCity}</span>
                  <X size={14} onClick={() => setSelectedCity('All')} style={{ cursor: 'pointer' }} />
                </div>
              )}
              {minBeds !== 'Any' && (
                <div className="filter-chip">
                  <span>Beds: {minBeds}</span>
                  <X size={14} onClick={() => setMinBeds('Any')} style={{ cursor: 'pointer' }} />
                </div>
              )}
              {(minPrice || maxPrice) && (
                <div className="filter-chip">
                  <span>Price: {minPrice ? `From ${minPrice}` : ''} {maxPrice ? `To ${maxPrice}` : ''}</span>
                  <X size={14} onClick={() => { setMinPrice(''); setMaxPrice(''); }} style={{ cursor: 'pointer' }} />
                </div>
              )}
              <button className="btn btn-quiet btn-sm" onClick={handleClearFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <RotateCcw size={12} /> Reset all
              </button>
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
              <p className="text-meta">Try adjusting your filters, selecting a different city, or resetting your search parameters.</p>
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                Clear all filters
              </button>
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
                  style={{ top: `${15 + ((i * 12) % 70)}%`, left: `${15 + ((i * 18) % 70)}%` }}
                >
                  {formatPrice(prop.price, prop.currency)}
                </div>
              ))}
              <div className="map-overlay-controls">
                <button className="btn btn-primary" style={{ height: '36px' }}>
                  Search this perimeter
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Mobile Sticky Map Toggle Button */}
      {view !== 'map' && (
        <button className="mobile-map-toggle mobile-only" onClick={() => updateParam('view', 'map')}>
          <MapIcon size={18} strokeWidth={1.5} /> Map View
        </button>
      )}

      {/* Advanced Filter Drawer */}
      {isFilterOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsFilterOpen(false)}></div>
          <div className="filter-drawer">
            <div className="drawer-header">
              <h3 style={{ margin: 0 }}>Filter Residences</h3>
              <button className="icon-btn" onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="drawer-content">
              {/* City Selection */}
              <div className="filter-section">
                <h4>Metropolitan Hub</h4>
                <select 
                  className="input-field" 
                  value={selectedCity} 
                  onChange={e => setSelectedCity(e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  <option value="All">All Hubs (Paris, London, Madrid, Lisbon, Milan, Dubai, NY, Singapore)</option>
                  <option value="Paris">Paris, France</option>
                  <option value="London">London, United Kingdom</option>
                  <option value="Madrid">Madrid, Spain</option>
                  <option value="Lisbon">Lisbon, Portugal</option>
                  <option value="Milan">Milan, Italy</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="New York">New York, United States</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              {/* Price range */}
              <div className="filter-section">
                <h4>Price range</h4>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="Min Price" 
                    value={minPrice} 
                    onChange={e => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="Max Price" 
                    value={maxPrice} 
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="filter-section">
                <h4>Bedrooms</h4>
                <div className="segmented-control">
                  {['Any', '1+', '2+', '3+', '4+'].map(b => (
                    <button 
                      key={b} 
                      type="button"
                      className={minBeds === b ? 'active' : ''}
                      onClick={() => setMinBeds(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className="filter-section">
                <h4>Property type</h4>
                <div className="checkbox-group">
                  {['Apartment', 'House', 'Villa', 'Loft', 'Residence', 'Commercial'].map(tName => (
                    <label key={tName}>
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.includes(tName)} 
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedTypes(prev => [...prev, tName]);
                          } else {
                            setSelectedTypes(prev => prev.filter(t => t !== tName));
                          }
                        }}
                      /> {tName}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button type="button" className="btn btn-quiet" onClick={handleClearFilters}>
                Reset all
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setIsFilterOpen(false)}>
                Show {filteredProperties.length} residences
              </button>
            </div>
          </div>
        </>
      )}
      
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import CarCard from '../components/CarCard';
import { mockCars } from '../data/mockCars';
import type { Vehicle } from '../data/mockCars';
import './Cars.css';

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'recommended';
  
  const [localQuery, setLocalQuery] = useState(query);
  const [filteredCars, setFilteredCars] = useState<Vehicle[]>([]);

  useEffect(() => {
    let results = [...mockCars];
    
    if (query) {
      results = results.filter(c => 
        c.location.toLowerCase().includes(query.toLowerCase()) ||
        c.make.toLowerCase().includes(query.toLowerCase()) ||
        c.model.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(results);
  }, [query, sort]);

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
  };

  return (
    <div className="cars-page">
      <div className="cars-hero">
        <div className="cars-hero-content container">
          <h1 className="h1">Mobility, wherever you're staying.</h1>
          <p className="large text-slate" style={{maxWidth: '600px', marginTop: 'var(--space-4)'}}>
            A restrained collection of vehicles curated for their composure and capability. Book alongside your residence or independently.
          </p>
        </div>
      </div>

      <div className="search-header">
        <div className="search-header-container">
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="location-input-wrapper">
              <SearchIcon size={18} strokeWidth={1.5} className="search-icon" />
              <input 
                type="text" 
                placeholder="Where are you staying?" 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </div>
            
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger">
              Dates <ChevronDown size={14} />
            </button>
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger">
              Vehicle type <ChevronDown size={14} />
            </button>
            <div className="divider"></div>
            
            <button type="button" className="filter-trigger advanced">
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              <span>Filters</span>
            </button>
          </form>
        </div>
      </div>

      <div className="container cars-content">
        <div className="results-header">
          <div>
            <h2 className="h3" style={{marginBottom: 0}}>
              {query ? `Vehicles in ${query.split(',')[0]}` : 'Explore vehicles'}
            </h2>
            <p className="text-meta" style={{marginBottom: 0, marginTop: '4px'}}>
              {filteredCars.length} vehicles available
            </p>
          </div>
          
          <div className="sort-control">
            <span className="text-meta">Sort by:</span>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
        </div>

        {filteredCars.length > 0 ? (
          <div className="cars-grid">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="h3">No matching vehicles found.</h3>
            <p>Try adjusting your search criteria or location.</p>
            <button className="btn btn-secondary" onClick={() => { setLocalQuery(''); updateParam('q', ''); }}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}

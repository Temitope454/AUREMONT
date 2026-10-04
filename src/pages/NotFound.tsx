import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, ArrowRight, Home } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-container">
          <span className="not-found-code">404 Error</span>
          <h1 className="h1 not-found-title">Residence or Page Not Found</h1>
          <p className="large not-found-desc">
            The page or catalog address you requested is unavailable or may have been relocated.
          </p>

          <form onSubmit={handleSearch} className="not-found-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by city (e.g. Paris, London, Milan)..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search Catalog
            </button>
          </form>

          <div className="not-found-links-grid">
            <Link to="/" className="not-found-link-item">
              <Home size={18} />
              <div>
                <strong>Homepage</strong>
                <span>Return to marketplace overview</span>
              </div>
              <ArrowRight size={14} className="link-arrow" />
            </Link>

            <Link to="/buy" className="not-found-link-item">
              <Compass size={18} />
              <div>
                <strong>Buy Residences</strong>
                <span>Acquisition listings in eight hubs</span>
              </div>
              <ArrowRight size={14} className="link-arrow" />
            </Link>

            <Link to="/rent" className="not-found-link-item">
              <Compass size={18} />
              <div>
                <strong>Rent Residences</strong>
                <span>Curated city tenancies</span>
              </div>
              <ArrowRight size={14} className="link-arrow" />
            </Link>

            <Link to="/cars" className="not-found-link-item">
              <Compass size={18} />
              <div>
                <strong>Mobility Fleet</strong>
                <span>Chauffeur & executive car reservations</span>
              </div>
              <ArrowRight size={14} className="link-arrow" />
            </Link>

            <Link to="/explore" className="not-found-link-item">
              <Compass size={18} />
              <div>
                <strong>Explore Hubs</strong>
                <span>City & collection discovery</span>
              </div>
              <ArrowRight size={14} className="link-arrow" />
            </Link>

            <Link to="/about" className="not-found-link-item">
              <Compass size={18} />
              <div>
                <strong>About Auremont</strong>
                <span>Our platform standards & contact</span>
              </div>
              <ArrowRight size={14} className="link-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

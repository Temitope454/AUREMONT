import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Trash2, Plus, ExternalLink, SlidersHorizontal, Check } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import type { SavedSearch } from '../../context/ConsumerContext';
import './SavedSearches.css';

export default function SavedSearches() {
  const { savedSearches, removeSavedSearch, toggleSearchAlert, addSavedSearch } = useConsumerState();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Paris');
  const [newMode, setNewMode] = useState<'Buy' | 'Rent' | 'Lease'>('Buy');
  const [newType, setNewType] = useState('Apartment');
  const [newMinPrice, setNewMinPrice] = useState('2000000');
  const [newMaxPrice, setNewMaxPrice] = useState('10000000');
  const [newCadence, setNewCadence] = useState<SavedSearch['alertFrequency']>('daily');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.transactionType) params.set('mode', search.transactionType.toLowerCase());
    if (search.city) params.set('city', search.city);
    navigate(`/search?${params.toString()}`);
  };

  const handleCreateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSavedSearch({
      title: newTitle.trim(),
      city: newCity,
      transactionType: newMode,
      propertyType: newType,
      minPrice: Number(newMinPrice) || undefined,
      maxPrice: Number(newMaxPrice) || undefined,
      alertFrequency: newCadence,
    });

    setIsModalOpen(false);
    setNewTitle('');
    setToastMessage('Search alert successfully created.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="account-panel">
      <div className="panel-header flex-between">
        <div>
          <h1 className="h3">Saved Searches</h1>
          <p className="text-meta">Manage your saved searches and listing alert preferences.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> New Saved Search
        </button>
      </div>

      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) var(--space-6) 0' }}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="panel-body">
        {savedSearches.length === 0 ? (
          <div className="empty-state">
            <Search size={40} className="empty-icon" />
            <h3 className="h4">No saved criteria</h3>
            <p className="text-meta">Save your search parameters from the marketplace to receive notifications when matching properties become available.</p>
          </div>
        ) : (
          <div className="saved-searches-list">
            {savedSearches.map(item => (
              <div key={item.id} className="saved-search-card">
                <div className="saved-search-header">
                  <div className="saved-search-title-wrap">
                    <h3 className="saved-search-title">{item.title}</h3>
                    <span className="saved-search-date">Created on {item.createdAt}</span>
                  </div>
                  <div className="saved-search-badge">
                    <span className="match-pill">{item.matchCount} New Matches</span>
                  </div>
                </div>

                <div className="saved-search-criteria-chips">
                  {item.city && <span className="criteria-chip">📍 {item.city}</span>}
                  {item.transactionType && <span className="criteria-chip">🏷️ {item.transactionType}</span>}
                  {item.propertyType && <span className="criteria-chip">🏛️ {item.propertyType}</span>}
                  {(item.minPrice || item.maxPrice) && (
                    <span className="criteria-chip">
                      💶 {item.minPrice ? `€${(item.minPrice / 1000000).toFixed(1)}M` : '€0'} - {item.maxPrice ? `€${(item.maxPrice / 1000000).toFixed(1)}M` : 'No max'}
                    </span>
                  )}
                  {item.beds && <span className="criteria-chip">🛏️ {item.beds}+ Beds</span>}
                </div>

                <div className="saved-search-footer">
                  <div className="frequency-selector-wrap">
                    <Bell size={16} className="bell-icon" />
                    <label className="frequency-label">Notification Cadence:</label>
                    <select
                      className="frequency-select"
                      value={item.alertFrequency}
                      onChange={e => toggleSearchAlert(item.id, e.target.value as SavedSearch['alertFrequency'])}
                      aria-label="Select Notification Cadence"
                    >
                      <option value="instant">Instant WhatsApp & Email</option>
                      <option value="daily">Daily Evening Digest</option>
                      <option value="weekly">Weekly Prime Briefing</option>
                      <option value="none">Muted (Manual review only)</option>
                    </select>
                  </div>

                  <div className="saved-search-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRunSearch(item)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={14} /> Execute Search
                    </button>
                    <button 
                      className="icon-btn-danger"
                      onClick={() => removeSavedSearch(item.id)}
                      title="Delete search alert"
                      aria-label="Delete search alert"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Search Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={20} /> Create New Property Alert
              </h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSearch} className="modal-form">
              <div className="form-group">
                <label>Alert Label / Portfolio Reference</label>
                <input 
                  type="text" 
                  placeholder="e.g. Monaco Penthouse / Saint-Tropez Villa" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Prime Metropolis</label>
                  <select value={newCity} onChange={e => setNewCity(e.target.value)}>
                    <option value="Paris">Paris, France</option>
                    <option value="London">London, UK</option>
                    <option value="Madrid">Madrid, Spain</option>
                    <option value="Milan">Milan, Italy</option>
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Transaction Type</label>
                  <select value={newMode} onChange={e => setNewMode(e.target.value as any)}>
                    <option value="Buy">Outright Acquisition (Buy)</option>
                    <option value="Rent">Luxury Tenancy (Rent)</option>
                    <option value="Lease">Commercial Lease</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Property Architecture</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)}>
                    <option value="Apartment">Haussmannian / Classic Apartment</option>
                    <option value="Penthouse">Top-Floor Penthouse</option>
                    <option value="Villa">Detached Prime Villa</option>
                    <option value="Loft">Architectural Loft</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Alert Dispatch Cadence</label>
                  <select value={newCadence} onChange={e => setNewCadence(e.target.value as any)}>
                    <option value="instant">Instant WhatsApp / VIP Alert</option>
                    <option value="daily">Daily Curated Digest</option>
                    <option value="weekly">Weekly Intelligence Report</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Min Target Budget (€)</label>
                  <input 
                    type="number" 
                    value={newMinPrice} 
                    onChange={e => setNewMinPrice(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Max Target Budget (€)</label>
                  <input 
                    type="number" 
                    value={newMaxPrice} 
                    onChange={e => setNewMaxPrice(e.target.value)} 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Establish Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

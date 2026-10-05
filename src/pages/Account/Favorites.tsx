import { useState } from 'react';
import PropertyCard from '../../components/PropertyCard';
import CarCard from '../../components/CarCard';
import { mockProperties } from '../../data/mockProperties';
import { mockCars } from '../../data/mockCars';
import { useConsumerState } from '../../context/ConsumerContext';

export default function Favorites() {
  const { favorites } = useConsumerState();
  const [filter, setFilter] = useState<'all' | 'properties' | 'cars'>('all');

  // Filter items that match the favorited IDs
  const favProperties = mockProperties.filter(p => favorites.includes(p.id));
  const favCars = mockCars.filter(c => favorites.includes(c.id));

  let itemsToRender: React.ReactNode[] = [];

  if (filter === 'all' || filter === 'properties') {
    itemsToRender = itemsToRender.concat(
      favProperties.map(p => (
        <div key={p.id} className="fav-item-wrapper" style={{marginBottom: 'var(--space-6)'}}>
          <PropertyCard property={{...p, favoriteState: true}} layout="list" />
        </div>
      ))
    );
  }

  if (filter === 'all' || filter === 'cars') {
    itemsToRender = itemsToRender.concat(
      favCars.map(c => (
        <div key={c.id} className="fav-item-wrapper" style={{marginBottom: 'var(--space-6)'}}>
          <CarCard car={{...c, favoriteState: true}} />
        </div>
      ))
    );
  }

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3" style={{marginBottom: 'var(--space-3)'}}>Favorites</h1>
        <div className="segmented-control" style={{width: 'max-content'}}>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All ({favorites.length})</button>
          <button className={filter === 'properties' ? 'active' : ''} onClick={() => setFilter('properties')}>Properties ({favProperties.length})</button>
          <button className={filter === 'cars' ? 'active' : ''} onClick={() => setFilter('cars')}>Vehicles ({favCars.length})</button>
        </div>
      </div>

      <div className="panel-body">
        {itemsToRender.length > 0 ? (
          <div className="favorites-list">
             {itemsToRender}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="h4">No favorites yet</h3>
            <p className="text-meta">Properties and vehicles you save will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

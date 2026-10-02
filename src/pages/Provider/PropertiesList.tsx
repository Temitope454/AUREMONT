import { useProviderState } from '../../context/ProviderContext';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Plus, Search, Filter } from 'lucide-react';
import { formatPrice } from '../../data/mockProperties';

export default function PropertiesList() {
  const { properties } = useProviderState();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'var(--color-success-forest)';
      case 'under_review': return 'var(--color-warning-ochre)';
      case 'paused': return 'var(--color-text-ash)';
      default: return 'var(--color-text-slate)';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="h3">Properties</h1>
          <p className="text-meta">Manage your listings, drafts, and availability.</p>
        </div>
        <Link to="/provider/properties/new" className="btn btn-primary">
          <Plus size={16} /> Add property
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', padding: '0 var(--space-4)' }}>
          <Search size={16} color="var(--color-text-ash)" />
          <input type="text" placeholder="Search properties..." style={{ border: 'none', background: 'transparent', padding: 'var(--space-3)', width: '100%', outline: 'none' }} />
        </div>
        <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Type</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Price</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Availability</th>
              <th style={{ padding: 'var(--space-4)', width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop, i) => (
              <tr key={prop.id} style={{ borderBottom: i === properties.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <img src={prop.mainImage} alt={prop.title} style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{prop.title}</div>
                      <div className="text-meta" style={{ color: 'var(--color-text-ash)' }}>{prop.location} • Updated {prop.lastUpdated}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px' }}>
                  <span style={{ textTransform: 'capitalize' }}>{prop.type}</span>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', fontFamily: 'monospace' }}>
                  {formatPrice(prop.price, prop.currency)} {prop.type === 'rent' && '/mo'}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    backgroundColor: 'var(--color-bg-sand)',
                    color: getStatusColor(prop.status)
                  }}>
                    {getStatusLabel(prop.status)}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', textTransform: 'capitalize' }}>
                  {prop.availability}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-slate)' }}>
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
            
            {properties.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <h3 className="h4">No properties found</h3>
                  <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>You haven't added any properties yet.</p>
                  <Link to="/provider/properties/new" className="btn btn-primary">Create a listing</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

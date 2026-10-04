import { useState } from 'react';
import { useProviderState } from '../../context/ProviderContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Image as ImageIcon, 
  Copy, 
  PauseCircle, 
  PlayCircle, 
  Archive, 
  AlertCircle 
} from 'lucide-react';
import { formatPrice } from '../../data/mockProperties';

export default function PropertiesList() {
  const { properties, updatePropertyStatus, duplicateProperty, archiveProperty } = useProviderState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'var(--color-success-forest)';
      case 'under_review': return 'var(--color-warning-ochre)';
      case 'paused': return 'var(--color-text-ash)';
      case 'archived': return 'var(--color-error-brick)';
      case 'draft': return 'var(--color-text-slate)';
      default: return 'var(--color-text-slate)';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDuplicate = (id: string) => {
    const newDraft = duplicateProperty(id);
    setOpenMenuId(null);
    if (newDraft) {
      navigate(`/provider/properties/${newDraft.id}/edit`);
    }
  };

  const handleTogglePause = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paused' ? 'published' : 'paused';
    updatePropertyStatus(id, newStatus);
    setOpenMenuId(null);
  };

  const handleConfirmArchive = () => {
    if (confirmArchiveId) {
      archiveProperty(confirmArchiveId);
      setConfirmArchiveId(null);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Properties Portfolio</h1>
          <p className="text-meta">Manage your residences, editorial drafts, and listing availability.</p>
        </div>
        <Link to="/provider/properties/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flex: 1, minWidth: '240px', alignItems: 'center', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', padding: '0 var(--space-4)' }}>
          <Search size={16} color="var(--color-text-ash)" />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: 'var(--space-3)', width: '100%', outline: 'none', fontSize: '14px' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Filter size={16} color="var(--color-text-slate)" />
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ padding: '8px 12px', fontSize: '13px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            <option value="all">All States ({properties.length})</option>
            <option value="published">Published</option>
            <option value="under_review">Under Review</option>
            <option value="draft">Drafts</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table of Listings */}
      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Type</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Asking Price</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Listing State</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Availability</th>
              <th style={{ padding: 'var(--space-4)', width: '70px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((prop, i) => (
              <tr key={prop.id} style={{ borderBottom: i === filteredProperties.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <img 
                      src={prop.mainImage} 
                      alt={prop.title} 
                      style={{ width: '70px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border-limestone)' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-dark)' }}>{prop.title}</div>
                      <div className="text-meta" style={{ color: 'var(--color-text-ash)', marginTop: '2px' }}>
                        {prop.location} • Updated {prop.lastUpdated}
                      </div>
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
                    padding: '3px 10px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 600,
                    backgroundColor: 'var(--color-bg-sand)',
                    color: getStatusColor(prop.status)
                  }}>
                    {getStatusLabel(prop.status)}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '13px', textTransform: 'capitalize' }}>
                  {prop.availability.replace('_', ' ')}
                </td>
                <td style={{ padding: 'var(--space-4)', position: 'relative', textAlign: 'center' }}>
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === prop.id ? null : prop.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-slate)', padding: '6px' }}
                    title="Actions"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === prop.id && (
                    <div style={{
                      position: 'absolute',
                      right: '12px',
                      top: '40px',
                      backgroundColor: 'var(--color-surface-white)',
                      border: '1px solid var(--color-border-limestone)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      zIndex: 100,
                      width: '180px',
                      textAlign: 'left'
                    }}>
                      <Link 
                        to={`/provider/properties/${prop.id}/preview`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-slate)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-limestone)' }}
                      >
                        <Eye size={14} /> View / Preview
                      </Link>
                      <Link 
                        to={`/provider/properties/${prop.id}/edit`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-slate)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-limestone)' }}
                      >
                        <Edit size={14} /> Edit Listing
                      </Link>
                      <Link 
                        to={`/provider/properties/${prop.id}/media`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-slate)', textDecoration: 'none', borderBottom: '1px solid var(--color-border-limestone)' }}
                      >
                        <ImageIcon size={14} /> Manage Media
                      </Link>
                      <button 
                        onClick={() => handleDuplicate(prop.id)}
                        style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-slate)', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--color-border-limestone)' }}
                      >
                        <Copy size={14} /> Duplicate (New Draft)
                      </button>
                      <button 
                        onClick={() => handleTogglePause(prop.id, prop.status)}
                        style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-slate)', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--color-border-limestone)' }}
                      >
                        {prop.status === 'paused' ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                        {prop.status === 'paused' ? 'Resume Listing' : 'Pause Listing'}
                      </button>
                      <button 
                        onClick={() => setConfirmArchiveId(prop.id)}
                        style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: 'var(--color-error-brick)', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <Archive size={14} /> Archive Listing
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredProperties.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <h3 className="h4">No properties match your filter</h3>
                  <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>Try clearing your search query or status filter.</p>
                  <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="btn btn-secondary text-small">
                    Reset Filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Consequential Actions (Archive) */}
      {confirmArchiveId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'var(--space-4)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-error-brick)', marginBottom: 'var(--space-3)' }}>
              <AlertCircle size={24} />
              <h3 className="h4" style={{ margin: 0 }}>Archive Property Listing?</h3>
            </div>
            <p className="text-small" style={{ color: 'var(--color-text-slate)', margin: '0 0 var(--space-6) 0' }}>
              Archiving will immediately withdraw this listing from all public search channels. You can re-activate or duplicate it later from your archived portfolio.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button onClick={() => setConfirmArchiveId(null)} className="btn btn-secondary text-small">
                Cancel
              </button>
              <button onClick={handleConfirmArchive} className="btn btn-primary text-small" style={{ backgroundColor: 'var(--color-error-brick)' }}>
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

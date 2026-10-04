import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Star, 
  Eye, 
  Check, 
  X, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { useAdmin, type AdminListing } from '../../context/AdminContext';
import './AdminListings.css';

export default function AdminListings() {
  const { listings, approveListing, requestListingChanges, rejectListing, toggleFeaturedListing } = useAdmin();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Inspection Modal State
  const [inspectingListing, setInspectingListing] = useState<AdminListing | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Filtering
  const filteredListings = listings.filter(l => {
    if (activeTab === 'under_review' && l.status !== 'under_review') return false;
    if (activeTab === 'published' && l.status !== 'published') return false;
    if (activeTab === 'changes_requested' && l.status !== 'changes_requested') return false;
    if (activeTab === 'rejected' && l.status !== 'rejected') return false;
    if (cityFilter !== 'all' && l.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (typeFilter !== 'all' && l.transactionType.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.providerName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const cities = Array.from(new Set(listings.map(l => l.city)));

  const formatPrice = (val: number, cur: string = '€') => {
    return `${cur}${val.toLocaleString('en-US')}`;
  };

  const openInspection = (listing: AdminListing) => {
    setInspectingListing(listing);
    setChangeNotes(listing.editorialNotes || '');
    setIsRequestingChanges(false);
    setIsRejecting(false);
  };

  const closeInspection = () => {
    setInspectingListing(null);
    setIsRequestingChanges(false);
    setIsRejecting(false);
  };

  const handleApproveFromModal = () => {
    if (inspectingListing) {
      approveListing(inspectingListing.id);
      closeInspection();
    }
  };

  const handleSubmitChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (inspectingListing && changeNotes.trim()) {
      requestListingChanges(inspectingListing.id, changeNotes.trim());
      closeInspection();
    }
  };

  const handleSubmitReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (inspectingListing && rejectReason.trim()) {
      rejectListing(inspectingListing.id, rejectReason.trim());
      closeInspection();
    }
  };

  return (
    <div className="admin-listings-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-breadcrumb">OPERATIONS CONSOLE &gt; LISTING MODERATION</span>
          <h1 className="admin-page-title">Curatorial & Compliance Moderation</h1>
          <p className="admin-page-subtitle">
            Every property published to Auremont must satisfy strict editorial criteria: architectural significance, authentic deed records, and uncompressed high-resolution photography.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="admin-controls-card">
        <div className="admin-status-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Listings ({listings.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'under_review' ? 'active' : ''}`}
            onClick={() => setActiveTab('under_review')}
          >
            Under Review ({listings.filter(l => l.status === 'under_review').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published ({listings.filter(l => l.status === 'published').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'changes_requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('changes_requested')}
          >
            Changes Requested ({listings.filter(l => l.status === 'changes_requested').length})
          </button>
        </div>

        <div className="admin-filter-bar">
          <div className="search-field-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, city, or provider..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="admin-input-search"
            />
          </div>

          <div className="filter-dropdowns">
            <select 
              value={cityFilter} 
              onChange={e => setCityFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Metropolises</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              value={typeFilter} 
              onChange={e => setTypeFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Types</option>
              <option value="buy">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="admin-panel">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Feat.</th>
                <th>Listing Details</th>
                <th>Location</th>
                <th>Price & Type</th>
                <th>Provider</th>
                <th>Compliance Checks</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center" style={{ padding: 'var(--space-10) 0' }}>
                    <p className="text-secondary">No listings matched your active filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredListings.map(listing => (
                  <tr key={listing.id}>
                    <td>
                      <button 
                        onClick={() => toggleFeaturedListing(listing.id)}
                        className={`star-toggle ${listing.isFeatured ? 'featured' : ''}`}
                        title={listing.isFeatured ? 'Featured on Curated Hero' : 'Mark as Featured'}
                        aria-label="Toggle Featured"
                      >
                        <Star size={16} fill={listing.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>

                    <td>
                      <div className="listing-cell-flex">
                        <img src={listing.mainImage} alt={listing.title} className="listing-table-thumb" />
                        <div>
                          <div className="listing-cell-title">{listing.title}</div>
                          <div className="listing-cell-specs text-meta">
                            {listing.beds} Beds · {listing.baths} Baths · {listing.size} {listing.sizeUnit} · {listing.propertyType}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="location-cell">
                        <span className="location-city">{listing.city}</span>
                        <span className="location-country text-meta">{listing.neighborhood}, {listing.country}</span>
                      </div>
                    </td>

                    <td>
                      <div className="price-cell">
                        <span className="price-amount">{formatPrice(listing.price, listing.currency)}</span>
                        <span className="price-type-badge">{listing.transactionType}</span>
                      </div>
                    </td>

                    <td>
                      <div className="provider-cell">
                        <span className="provider-name">{listing.providerName}</span>
                        <span className="provider-sub text-meta">{listing.providerAgency || listing.providerRole}</span>
                      </div>
                    </td>

                    <td>
                      <div className="compliance-checklist-icons">
                        <span 
                          className={`check-icon-pill ${listing.complianceChecks.deedVerification ? 'valid' : 'invalid'}`}
                          title={listing.complianceChecks.deedVerification ? 'Title Deed Verified' : 'Title Deed Missing'}
                        >
                          Deed
                        </span>
                        <span 
                          className={`check-icon-pill ${listing.complianceChecks.highResPhotography ? 'valid' : 'invalid'}`}
                          title={listing.complianceChecks.highResPhotography ? 'Photography Compliant' : 'Photography Resolution Flagged'}
                        >
                          Photos
                        </span>
                        <span 
                          className={`check-icon-pill ${listing.complianceChecks.energyPerformanceCert ? 'valid' : 'invalid'}`}
                          title={listing.complianceChecks.energyPerformanceCert ? 'EPC Certificate Present' : 'EPC Missing'}
                        >
                          EPC
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`status-pill status-${listing.status}`}>
                        {listing.status === 'under_review' ? 'Under Review' : 
                         listing.status === 'published' ? 'Published' :
                         listing.status === 'changes_requested' ? 'Changes Req.' : listing.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell">
                        <button 
                          onClick={() => openInspection(listing)} 
                          className="btn btn-secondary btn-sm"
                          title="Inspect full listing dossier"
                        >
                          <Eye size={14} /> Moderate
                        </button>
                        {listing.status === 'under_review' && (
                          <button 
                            onClick={() => approveListing(listing.id)}
                            className="btn btn-primary btn-sm btn-icon-only"
                            title="Quick Approve"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection & Moderation Modal */}
      {inspectingListing && (
        <div className="admin-modal-overlay" onClick={closeInspection}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">{inspectingListing.transactionType.toUpperCase()} LISTING DOSSIER</span>
                <h2 className="modal-title">{inspectingListing.title}</h2>
                <p className="modal-location">
                  <MapPin size={14} /> {inspectingListing.neighborhood}, {inspectingListing.city}, {inspectingListing.country}
                </p>
              </div>
              <button onClick={closeInspection} className="icon-btn-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Media Gallery Strip */}
              <div className="modal-gallery">
                <img src={inspectingListing.mainImage} alt="Main" className="modal-main-img" />
                <div className="modal-gallery-thumbs">
                  {inspectingListing.gallery.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="Thumb" className="modal-sub-img" />
                  ))}
                </div>
              </div>

              {/* Two Column Inspection Details */}
              <div className="modal-details-grid">
                <div className="modal-specs-column">
                  <h3 className="section-label">Architectural Specifications</h3>
                  <div className="spec-item-row">
                    <span className="spec-k">Asking Price:</span>
                    <span className="spec-v font-serif">{formatPrice(inspectingListing.price, inspectingListing.currency)}</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-k">Layout:</span>
                    <span className="spec-v">{inspectingListing.beds} Bedrooms, {inspectingListing.baths} Bathrooms</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-k">Floor Area:</span>
                    <span className="spec-v">{inspectingListing.size} {inspectingListing.sizeUnit}</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-k">Property Style:</span>
                    <span className="spec-v">{inspectingListing.propertyType}</span>
                  </div>

                  <h3 className="section-label" style={{ marginTop: 'var(--space-5)' }}>Editorial Description</h3>
                  <p className="modal-desc-text">{inspectingListing.description}</p>
                </div>

                <div className="modal-compliance-column">
                  <h3 className="section-label">Auremont Regulatory Checklist</h3>
                  <div className="checklist-box">
                    <div className="checklist-item">
                      <div className={`chk-indicator ${inspectingListing.complianceChecks.deedVerification ? 'chk-pass' : 'chk-warn'}`}>
                        {inspectingListing.complianceChecks.deedVerification ? <Check size={14} /> : <AlertTriangle size={14} />}
                      </div>
                      <div>
                        <strong>Title Deed Verification</strong>
                        <p className="chk-desc">Notarial title deed proof submitted and authenticated.</p>
                      </div>
                    </div>

                    <div className="checklist-item">
                      <div className={`chk-indicator ${inspectingListing.complianceChecks.highResPhotography ? 'chk-pass' : 'chk-warn'}`}>
                        {inspectingListing.complianceChecks.highResPhotography ? <Check size={14} /> : <AlertTriangle size={14} />}
                      </div>
                      <div>
                        <strong>Photography Quality Standard</strong>
                        <p className="chk-desc">Curated architectural lighting, minimum 2500px, no watermarks.</p>
                      </div>
                    </div>

                    <div className="checklist-item">
                      <div className={`chk-indicator ${inspectingListing.complianceChecks.energyPerformanceCert ? 'chk-pass' : 'chk-warn'}`}>
                        {inspectingListing.complianceChecks.energyPerformanceCert ? <Check size={14} /> : <AlertTriangle size={14} />}
                      </div>
                      <div>
                        <strong>Energy Performance Certificate (EPC)</strong>
                        <p className="chk-desc">Official regional energy rating rating documentation filed.</p>
                      </div>
                    </div>

                    <div className="checklist-item">
                      <div className={`chk-indicator ${inspectingListing.complianceChecks.floorPlanSupplied ? 'chk-pass' : 'chk-warn'}`}>
                        {inspectingListing.complianceChecks.floorPlanSupplied ? <Check size={14} /> : <AlertTriangle size={14} />}
                      </div>
                      <div>
                        <strong>Architectural Floor Plan</strong>
                        <p className="chk-desc">Dimensional architectural schematic provided for buyer inspection.</p>
                      </div>
                    </div>
                  </div>

                  <div className="provider-dossier-summary">
                    <h3 className="section-label">Provider Information</h3>
                    <p><strong>{inspectingListing.providerName}</strong> ({inspectingListing.providerRole})</p>
                    <p className="text-meta">{inspectingListing.providerAgency || 'Private Landlord'}</p>
                    <p className="text-meta">{inspectingListing.providerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Sub-form for Requesting Changes */}
              {isRequestingChanges && (
                <form onSubmit={handleSubmitChanges} className="modal-action-subform">
                  <h4 className="subform-title">Specify Required Editorial Corrections</h4>
                  <p className="subform-desc">This feedback will be dispatched directly to the provider and set listing status to <em>Changes Requested</em>.</p>
                  <textarea 
                    value={changeNotes}
                    onChange={e => setChangeNotes(e.target.value)}
                    placeholder="e.g. Please supply unwatermarked high-resolution photos and upload the EPC certificate."
                    rows={4}
                    className="admin-textarea"
                    required
                  />
                  <div className="subform-buttons">
                    <button type="submit" className="btn btn-primary btn-sm">
                      Dispatch Feedback to Provider
                    </button>
                    <button type="button" onClick={() => setIsRequestingChanges(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-form for Rejecting Listing */}
              {isRejecting && (
                <form onSubmit={handleSubmitReject} className="modal-action-subform reject-subform">
                  <h4 className="subform-title text-error">Reject Listing Publication</h4>
                  <p className="subform-desc">Provide mandatory compliance justification for rejection:</p>
                  <textarea 
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="State legal or compliance reason for rejection..."
                    rows={3}
                    className="admin-textarea"
                    required
                  />
                  <div className="subform-buttons">
                    <button type="submit" className="btn btn-error btn-sm">
                      Confirm Rejection
                    </button>
                    <button type="button" onClick={() => setIsRejecting(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-footer">
              <div className="footer-left">
                <a 
                  href={`/property/${inspectingListing.id}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-secondary btn-sm"
                >
                  Live Preview <ExternalLink size={14} />
                </a>
              </div>

              <div className="footer-right">
                {!isRequestingChanges && !isRejecting && (
                  <>
                    <button 
                      onClick={() => setIsRejecting(true)} 
                      className="btn btn-text-error btn-sm"
                    >
                      Reject Listing
                    </button>
                    <button 
                      onClick={() => setIsRequestingChanges(true)} 
                      className="btn btn-secondary btn-sm"
                    >
                      Request Changes
                    </button>
                    <button 
                      onClick={handleApproveFromModal} 
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={16} /> Approve & Publish
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

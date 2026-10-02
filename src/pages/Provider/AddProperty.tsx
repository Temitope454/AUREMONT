import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, UploadCloud, Save, AlertCircle } from 'lucide-react';
import './AddProperty.css';

const STEPS = [
  'Basics', 'Location', 'Details', 'Description', 'Amenities', 
  'Media', 'Pricing', 'Availability', 'Contact', 'Review'
];

interface Draft {
  type: string;
  propertyType: string;
  country: string;
  city: string;
  neighborhood: string;
  address: string;
  publicLocation: string;
  bedrooms: string;
  bathrooms: string;
  interiorSize: string;
  sizeUnit: string;
  furnishedState: string;
  title: string;
  description: string;
  amenities: string[];
  price: string;
  currency: string;
  pricingCadence: string;
  availability: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const DEFAULT_DRAFT: Draft = {
  type: 'rent',
  propertyType: 'apartment',
  country: '',
  city: '',
  neighborhood: '',
  address: '',
  publicLocation: 'exact',
  bedrooms: '',
  bathrooms: '',
  interiorSize: '',
  sizeUnit: 'sqm',
  furnishedState: 'unfurnished',
  title: '',
  description: '',
  amenities: [],
  price: '',
  currency: '€',
  pricingCadence: 'monthly',
  availability: 'immediate',
  contactName: '',
  contactPhone: '',
  contactEmail: ''
};

const AMENITIES_LIST = ['Air Conditioning', 'Balcony', 'Concierge', 'Elevator', 'Gym', 'Parking', 'Pool', 'Terrace', 'View'];

export default function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const draftKey = isEditing ? `auremont_draft_${id}` : 'auremont_new_draft';

  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [draft, setDraft] = useState<Draft>(() => {
    const saved = localStorage.getItem(draftKey);
    return saved ? JSON.parse(saved) : DEFAULT_DRAFT;
  });

  const isInitialMount = useRef(true);

  // Debounced Autosave
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    setSaveStatus('saving');
    
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setSaveStatus('saved');
        setLastSaved(new Date());
      } catch (e) {
        setSaveStatus('failed');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [draft, draftKey]);

  const updateDraft = (key: keyof Draft, value: any) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (am: string) => {
    setDraft(prev => ({
      ...prev,
      amenities: prev.amenities.includes(am)
        ? prev.amenities.filter(a => a !== am)
        : [...prev.amenities, am]
    }));
  };

  const forceSave = () => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (e) {
      setSaveStatus('failed');
    }
  };

  const handleSubmit = () => {
    // Produce Submitted/Under review status (mocked via cleanup and redirect)
    localStorage.removeItem(draftKey);
    navigate('/provider/properties');
  };

  const renderSaveStatus = () => {
    if (saveStatus === 'saving') return <span>Saving... <Save size={14} className="spin" /></span>;
    if (saveStatus === 'failed') return <span className="text-error" style={{ cursor: 'pointer' }} onClick={forceSave}>Save failed — Retry</span>;
    if (lastSaved) return <span>Saved {lastSaved.toLocaleTimeString()} <Check size={14} /></span>;
    return <span>Draft saved <Save size={14} /></span>;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>Transaction Type</label>
              <select className="input-field" value={draft.type} onChange={e => updateDraft('type', e.target.value)}>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
                <option value="lease">Lease</option>
              </select>
            </div>
            <div className="input-group">
              <label>Property Type</label>
              <select className="input-field" value={draft.propertyType} onChange={e => updateDraft('propertyType', e.target.value)}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="commercial">Commercial Space</option>
              </select>
            </div>
            <div className="input-group form-full">
              <label>Furnished State</label>
              <select className="input-field" value={draft.furnishedState} onChange={e => updateDraft('furnishedState', e.target.value)}>
                <option value="unfurnished">Unfurnished</option>
                <option value="partially">Partially Furnished</option>
                <option value="furnished">Fully Furnished</option>
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>Country</label>
              <input type="text" className="input-field" placeholder="e.g. France" value={draft.country} onChange={e => updateDraft('country', e.target.value)} />
            </div>
            <div className="input-group">
              <label>City</label>
              <input type="text" className="input-field" placeholder="e.g. Paris" value={draft.city} onChange={e => updateDraft('city', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Neighborhood / District</label>
              <input type="text" className="input-field" placeholder="e.g. Le Marais" value={draft.neighborhood} onChange={e => updateDraft('neighborhood', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Postal Code / Zip</label>
              <input type="text" className="input-field" placeholder="e.g. 75004" />
            </div>
            <div className="input-group form-full">
              <label>Street Address</label>
              <input type="text" className="input-field" placeholder="e.g. 12 Rue de Rivoli" value={draft.address} onChange={e => updateDraft('address', e.target.value)} />
            </div>
            <div className="input-group form-full">
              <label>Public Location Preference</label>
              <select className="input-field" value={draft.publicLocation} onChange={e => updateDraft('publicLocation', e.target.value)}>
                <option value="exact">Exact address</option>
                <option value="approximate">Approximate neighborhood (Privacy)</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-grid">
            {draft.propertyType !== 'commercial' && (
              <>
                <div className="input-group">
                  <label>Bedrooms</label>
                  <input type="number" className="input-field" placeholder="e.g. 3" value={draft.bedrooms} onChange={e => updateDraft('bedrooms', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Bathrooms</label>
                  <input type="number" className="input-field" placeholder="e.g. 2" value={draft.bathrooms} onChange={e => updateDraft('bathrooms', e.target.value)} />
                </div>
              </>
            )}
            <div className="input-group">
              <label>Interior Size</label>
              <input type="number" className="input-field" placeholder="e.g. 120" value={draft.interiorSize} onChange={e => updateDraft('interiorSize', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Size Unit</label>
              <select className="input-field" value={draft.sizeUnit} onChange={e => updateDraft('sizeUnit', e.target.value)}>
                <option value="sqm">sqm</option>
                <option value="sqft">sqft</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-grid">
            <div className="input-group form-full">
              <label>Listing Title</label>
              <input type="text" className="input-field" placeholder="e.g. Restored Heritage Villa" value={draft.title} onChange={e => updateDraft('title', e.target.value)} />
            </div>
            <div className="input-group form-full">
              <label>Full Description</label>
              <textarea 
                className="input-field" 
                style={{ height: '150px', padding: 'var(--space-3)' }} 
                placeholder="Describe the architecture, layout, condition, natural light and relationship to the surrounding area."
                value={draft.description}
                onChange={e => updateDraft('description', e.target.value)}
              />
              <p className="text-meta" style={{marginTop: '4px', color: 'var(--color-text-ash)'}}>Provide useful editorial guidance rather than hyperbole.</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-grid">
             <div className="form-full">
               <h3 className="h4" style={{marginBottom: 'var(--space-4)'}}>Select Amenities</h3>
               <div style={{display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                 {AMENITIES_LIST.map(am => (
                   <label key={am} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-3)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: draft.amenities.includes(am) ? 'var(--color-bg-sand)' : 'transparent'}}>
                     <input type="checkbox" checked={draft.amenities.includes(am)} onChange={() => toggleAmenity(am)} /> {am}
                   </label>
                 ))}
               </div>
             </div>
          </div>
        );
      case 5:
        return (
          <div>
            <div className="media-uploader">
              <UploadCloud size={48} color="var(--color-text-slate)" style={{marginBottom: 'var(--space-4)'}} />
              <h3 className="h4">Upload High-Quality Photography</h3>
              <p className="text-meta">Use landscape photography where possible. Drag and drop or browse files.</p>
            </div>
            <div className="media-grid">
               <div className="media-thumbnail">
                 <img src="/images/madrid_apartment.jpg" alt="Preview 1" />
                 <div className="primary-badge">Primary</div>
               </div>
               <div className="media-thumbnail">
                 <img src="/images/paris_apartment.jpg" alt="Preview 2" />
                 <div className="media-controls">
                   <button>←</button>
                   <button>→</button>
                 </div>
               </div>
            </div>
            <p className="text-meta" style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-slate)' }}>Note: This is a local preview demonstration. Images are not durably uploaded to cloud storage yet.</p>
          </div>
        );
      case 6:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>{draft.type === 'sale' ? 'Sale Price' : 'Price'}</label>
              <input type="number" className="input-field" placeholder="e.g. 5000" value={draft.price} onChange={e => updateDraft('price', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Currency</label>
              <select className="input-field" value={draft.currency} onChange={e => updateDraft('currency', e.target.value)}>
                <option value="€">EUR (€)</option>
                <option value="$">USD ($)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>
            {draft.type !== 'sale' && (
              <div className="input-group">
                <label>Pricing Cadence</label>
                <select className="input-field" value={draft.pricingCadence} onChange={e => updateDraft('pricingCadence', e.target.value)}>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>
        );
      case 7:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>Availability Status</label>
              <select className="input-field" value={draft.availability} onChange={e => updateDraft('availability', e.target.value)}>
                <option value="immediate">Available immediately</option>
                <option value="specific_date">Available from specific date</option>
                <option value="occupied">Currently occupied (taking viewings)</option>
              </select>
            </div>
            {draft.availability === 'specific_date' && (
              <div className="input-group">
                <label>Available From</label>
                <input type="date" className="input-field" />
              </div>
            )}
          </div>
        );
      case 8:
        return (
          <div className="form-grid">
            <div className="input-group form-full">
              <label>Contact Name (Displayed publicly)</label>
              <input type="text" className="input-field" placeholder="e.g. Jane Doe" value={draft.contactName} onChange={e => updateDraft('contactName', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Contact Email</label>
              <input type="email" className="input-field" placeholder="e.g. jane@example.com" value={draft.contactEmail} onChange={e => updateDraft('contactEmail', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Contact Phone</label>
              <input type="tel" className="input-field" placeholder="+1 555 123 4567" value={draft.contactPhone} onChange={e => updateDraft('contactPhone', e.target.value)} />
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <h3 className="h4">Review your listing</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
              <div style={{ backgroundColor: 'var(--color-bg-ivory)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="h4">{draft.title || <span className="text-error">Missing Title</span>}</div>
                  <button className="text-small" style={{ color: 'var(--color-primary-navy)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setCurrentStep(3)}>Edit</button>
                </div>
                <p>{draft.city || <span className="text-error">Missing City</span>}{draft.city && draft.country && ', '}{draft.country}</p>
                <div style={{ fontWeight: 600, fontSize: '18px', marginTop: 'var(--space-4)'}}>
                  {draft.currency} {draft.price || <span className="text-error">Missing Price</span>} {draft.type !== 'sale' && `/${draft.pricingCadence === 'monthly' ? 'mo' : 'period'}`}
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--color-bg-ivory)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                <h4 className="h5" style={{ marginBottom: 'var(--space-4)' }}>Completeness Check</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {draft.title ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-error-brick)" />}
                    Title provided
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {draft.price ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-error-brick)" />}
                    Pricing configured
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {draft.description.length > 50 ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-warning-ochre)" />}
                    Detailed description ({draft.description.length} chars)
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)', color: 'var(--color-warning-ochre)'}}>
              <AlertCircle size={20} /> 
              <span className="text-small" style={{ lineHeight: 1.5 }}>
                By submitting, this listing will enter the "Under Review" state. <br/>
                It will not be published automatically.
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-property-container">
      <div className="add-property-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="h3">{isEditing ? 'Edit Property' : 'Add Property'}</h1>
            <p className="text-meta">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
          </div>
          <div className="save-status text-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderSaveStatus()}
          </div>
        </div>

        <div className="step-indicator">
          {STEPS.map((step, idx) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button 
                onClick={() => setCurrentStep(idx)}
                className={`step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                title={step}
                style={{ cursor: 'pointer', border: 'none', padding: 0 }}
              />
              {idx < STEPS.length - 1 && (
                <div style={{ width: 'clamp(8px, 2vw, 24px)', height: '1px', backgroundColor: 'var(--color-border-limestone)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="add-property-content">
        <h2 className="h4 step-title">{STEPS[currentStep]}</h2>
        
        {renderStepContent()}

        <div className="form-actions" style={{ marginTop: 'var(--space-8)' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => currentStep === STEPS.length - 1 ? handleSubmit() : setCurrentStep(prev => prev + 1)}
          >
            {currentStep === STEPS.length - 1 ? 'Submit Listing' : 'Continue'} 
            {currentStep < STEPS.length - 1 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

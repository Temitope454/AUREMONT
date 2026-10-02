import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, UploadCloud, Save } from 'lucide-react';
import './AddProperty.css';

const STEPS = [
  'Basics', 'Location', 'Details', 'Description', 'Amenities', 
  'Media', 'Pricing', 'Availability', 'Review'
];

export default function AddProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mock Draft State
  const [draft, setDraft] = useState({
    type: 'rent',
    propertyType: 'apartment',
    country: '',
    city: '',
    title: '',
    description: '',
    price: '',
    currency: '€'
  });

  // Mock Autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [draft]);

  const updateDraft = (key: string, value: any) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final Submit
      navigate('/provider/properties');
    }
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
            <div className="input-group form-full">
              <label>Public Location Preference</label>
              <select className="input-field">
                <option>Exact address</option>
                <option>Approximate neighborhood (Privacy)</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>Bedrooms</label>
              <input type="number" className="input-field" placeholder="e.g. 3" />
            </div>
            <div className="input-group">
              <label>Bathrooms</label>
              <input type="number" className="input-field" placeholder="e.g. 2" />
            </div>
            <div className="input-group">
              <label>Interior Size</label>
              <input type="number" className="input-field" placeholder="e.g. 120" />
            </div>
            <div className="input-group">
              <label>Size Unit</label>
              <select className="input-field">
                <option>sqm</option>
                <option>sqft</option>
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
                 {['Air Conditioning', 'Balcony', 'Concierge', 'Elevator', 'Gym', 'Parking', 'Pool', 'Terrace', 'View'].map(am => (
                   <label key={am} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-3)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-sm)', cursor: 'pointer'}}>
                     <input type="checkbox" /> {am}
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
               </div>
               <div className="media-thumbnail">
                 <img src="/images/paris_apartment.jpg" alt="Preview 2" />
               </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>{draft.type === 'sale' ? 'Sale Price' : 'Rental Price (per month)'}</label>
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
          </div>
        );
      case 7:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>Availability Status</label>
              <select className="input-field">
                <option>Available immediately</option>
                <option>Available from specific date</option>
                <option>Currently occupied (taking viewings)</option>
              </select>
            </div>
          </div>
        );
      case 8:
        return (
          <div>
            <h3 className="h4">Review your listing</h3>
            <div style={{ backgroundColor: 'var(--color-bg-ivory)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-4)'}}>
              <div className="h3">{draft.title || 'Untitled Property'}</div>
              <p>{draft.city}{draft.city && draft.country && ', '}{draft.country}</p>
              <div style={{ fontWeight: 600, fontSize: '18px', marginTop: 'var(--space-4)'}}>
                {draft.currency} {draft.price || '0'} {draft.type === 'rent' && '/mo'}
              </div>
              <p style={{ marginTop: 'var(--space-4)'}}>{draft.description}</p>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', color: 'var(--color-warning-ochre)'}}>
              <Check size={16} /> <span className="text-small">By submitting, this listing will enter the "Under Review" state.</span>
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
            <h1 className="h3">Add Property</h1>
            <p className="text-meta">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
          </div>
          <div className="save-status">
            {isSaving ? 'Saving draft...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Draft saved'}
            <Save size={16} />
          </div>
        </div>

        <div className="step-indicator">
          {STEPS.map((step, idx) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div 
                className={`step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                title={step}
              />
              {idx < STEPS.length - 1 && (
                <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--color-border-limestone)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="add-property-content">
        <h2 className="h4 step-title">{STEPS[currentStep]}</h2>
        
        {renderStepContent()}

        <div className="form-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button className="btn btn-primary" onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? 'Submit Listing' : 'Continue'} 
            {currentStep < STEPS.length - 1 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>

    </div>
  );
}

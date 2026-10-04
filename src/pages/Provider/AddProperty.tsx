import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProviderState } from '../../context/ProviderContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  UploadCloud, 
  Save, 
  AlertCircle, 
  Star, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  CheckCircle2, 
  Video, 
  FileText 
} from 'lucide-react';
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
  images: { id: string; url: string; caption: string; isPrimary: boolean }[];
  videoUrl: string;
  floorPlanName: string;
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
  images: [
    { id: 'img_1', url: '/images/paris_apartment.jpg', caption: 'Main Living Room', isPrimary: true },
    { id: 'img_2', url: '/images/madrid_apartment.jpg', caption: 'Dining Area', isPrimary: false }
  ],
  videoUrl: '',
  floorPlanName: 'ground_floor_plan.pdf',
  price: '',
  currency: '€',
  pricingCadence: 'monthly',
  availability: 'immediate',
  contactName: '',
  contactPhone: '',
  contactEmail: ''
};

const AMENITY_GROUPS = [
  {
    category: 'Living & Interior',
    items: ['Air Conditioning', 'Elevator', 'Balcony', 'Terrace', 'Fireplace', 'Wine Cellar']
  },
  {
    category: 'Wellness & Grounds',
    items: ['Pool', 'Gym', 'Spa', 'Private Garden', 'Panoramic View']
  },
  {
    category: 'Security & Services',
    items: ['Concierge', '24/7 Security', 'Private Parking', 'Valet', 'Storage Room']
  }
];

export default function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { properties, addProperty, updateProperty } = useProviderState();
  const isEditing = Boolean(id);
  const draftKey = isEditing ? `auremont_draft_${id}` : 'auremont_new_draft';

  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize draft from localStorage or pre-populate from existing listing in context
  const [draft, setDraft] = useState<Draft>(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }

    if (isEditing) {
      const existingProp = properties.find(p => p.id === id);
      if (existingProp) {
        const [city, country] = existingProp.location.split(',').map(s => s.trim());
        return {
          type: existingProp.type,
          propertyType: existingProp.propertyType || 'apartment',
          country: country || 'France',
          city: city || 'Paris',
          neighborhood: 'Historic Center',
          address: '15 Avenue Montaigne',
          publicLocation: 'exact',
          bedrooms: String(existingProp.bedrooms || 3),
          bathrooms: String(existingProp.bathrooms || 2),
          interiorSize: String(existingProp.interiorSize || 120),
          sizeUnit: existingProp.sizeUnit || 'sqm',
          furnishedState: existingProp.furnishedState || 'furnished',
          title: existingProp.title,
          description: existingProp.description || '',
          amenities: existingProp.amenities || [],
          images: (existingProp.images && existingProp.images.length > 0)
            ? existingProp.images.map((img, idx) => ({ id: `img_${idx}`, url: img, caption: `Photo ${idx + 1}`, isPrimary: idx === 0 }))
            : [{ id: 'img_1', url: existingProp.mainImage, caption: 'Main Elevation', isPrimary: true }],
          videoUrl: '',
          floorPlanName: 'ground_floor_plan.pdf',
          price: String(existingProp.price),
          currency: existingProp.currency,
          pricingCadence: existingProp.pricingCadence || 'monthly',
          availability: existingProp.availability || 'immediate',
          contactName: 'Auremont Partner Provider',
          contactPhone: '+33 1 42 68 55 00',
          contactEmail: 'contact@auremont.com'
        };
      }
    }

    return DEFAULT_DRAFT;
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

  // Media Handlers
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMedia = Array.from(files).map((file, idx) => {
      const objUrl = URL.createObjectURL(file);
      return {
        id: `upload_${Date.now()}_${idx}`,
        url: objUrl,
        caption: file.name.replace(/\.[^/.]+$/, ""),
        isPrimary: draft.images.length === 0 && idx === 0
      };
    });

    setDraft(prev => ({ ...prev, images: [...prev.images, ...newMedia] }));
    if (mediaFileInputRef.current) mediaFileInputRef.current.value = '';
  };

  const setPrimaryImage = (itemId: string) => {
    setDraft(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === itemId
      }))
    }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draft.images.length) return;

    setDraft(prev => {
      const copy = [...prev.images];
      const temp = copy[targetIndex];
      copy[targetIndex] = copy[index];
      copy[index] = temp;
      return { ...prev, images: copy };
    });
  };

  const removeImage = (itemId: string) => {
    setDraft(prev => {
      const filtered = prev.images.filter(img => img.id !== itemId);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const handleSubmit = () => {
    const primaryImg = draft.images.find(img => img.isPrimary)?.url || draft.images[0]?.url || '/images/paris_apartment.jpg';
    const locationStr = draft.city && draft.country ? `${draft.city}, ${draft.country}` : (draft.city || 'Paris, France');

    if (isEditing && id) {
      updateProperty(id, {
        title: draft.title || 'Untitled Residence',
        location: locationStr,
        type: draft.type as 'sale' | 'rent' | 'lease',
        propertyType: draft.propertyType,
        price: Number(draft.price) || 0,
        currency: draft.currency,
        pricingCadence: draft.pricingCadence,
        status: 'under_review',
        mainImage: primaryImg,
        images: draft.images.map(img => img.url),
        bedrooms: Number(draft.bedrooms) || 0,
        bathrooms: Number(draft.bathrooms) || 0,
        interiorSize: Number(draft.interiorSize) || 0,
        sizeUnit: draft.sizeUnit,
        furnishedState: draft.furnishedState,
        description: draft.description,
        amenities: draft.amenities,
        availability: draft.availability as any
      });
    } else {
      const newId = `prop_${Date.now()}`;
      addProperty({
        id: newId,
        title: draft.title || 'Untitled Residence',
        location: locationStr,
        type: draft.type as 'sale' | 'rent' | 'lease',
        propertyType: draft.propertyType,
        price: Number(draft.price) || 0,
        currency: draft.currency,
        pricingCadence: draft.pricingCadence,
        status: 'under_review',
        availability: draft.availability as any,
        mainImage: primaryImg,
        images: draft.images.map(img => img.url),
        bedrooms: Number(draft.bedrooms) || 0,
        bathrooms: Number(draft.bathrooms) || 0,
        interiorSize: Number(draft.interiorSize) || 0,
        sizeUnit: draft.sizeUnit,
        furnishedState: draft.furnishedState,
        description: draft.description,
        amenities: draft.amenities,
        lastUpdated: 'Just now'
      });
    }

    localStorage.removeItem(draftKey);
    setIsSubmittedSuccess(true);
  };

  const renderSaveStatus = () => {
    if (saveStatus === 'saving') return <span>Autosaving draft... <Save size={14} className="spin" /></span>;
    if (saveStatus === 'failed') return <span className="text-error" style={{ cursor: 'pointer' }} onClick={forceSave}>Save failed — Retry</span>;
    if (lastSaved) return <span>Draft saved {lastSaved.toLocaleTimeString()} <Check size={14} /></span>;
    return <span>Draft saved <Save size={14} /></span>;
  };

  if (isSubmittedSuccess) {
    return (
      <div className="provider-panel" style={{ maxWidth: '650px', margin: 'var(--space-12) auto', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', padding: 'var(--space-8)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <CheckCircle2 size={48} color="var(--color-success-forest)" style={{ margin: '0 auto var(--space-4)' }} />
        <h2 className="h3" style={{ marginBottom: 'var(--space-2)' }}>Listing Submitted for Editorial Review</h2>
        <p className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          Thank you. Your property listing <strong>"{draft.title}"</strong> has been saved and queued for editorial verification. It will remain in the <em>Under Review</em> state until our compliance team validates the ownership documentation.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <button onClick={() => navigate('/provider/properties')} className="btn btn-primary">
            View in Listings Portfolio
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>Transaction Type</label>
              <select className="input-field" value={draft.type} onChange={e => updateDraft('type', e.target.value)}>
                <option value="sale">Sale (10% Commission)</option>
                <option value="rent">Rent (5% Commission)</option>
                <option value="lease">Commercial Lease (Requires Configuration)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Property Typology</label>
              <select className="input-field" value={draft.propertyType} onChange={e => updateDraft('propertyType', e.target.value)}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa / Estate</option>
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
              <input type="text" className="input-field" placeholder="e.g. 8th Arrondissement" value={draft.neighborhood} onChange={e => updateDraft('neighborhood', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Postal Code / Zip</label>
              <input type="text" className="input-field" placeholder="e.g. 75008" />
            </div>
            <div className="input-group form-full">
              <label>Street Address</label>
              <input type="text" className="input-field" placeholder="e.g. 15 Avenue Montaigne" value={draft.address} onChange={e => updateDraft('address', e.target.value)} />
            </div>
            <div className="input-group form-full">
              <label>Public Location Privacy Setting</label>
              <select className="input-field" value={draft.publicLocation} onChange={e => updateDraft('publicLocation', e.target.value)}>
                <option value="exact">Exact street address displayed publicly</option>
                <option value="approximate">Approximate neighborhood radius only (Privacy Protection)</option>
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
              <label>Interior Floor Area</label>
              <input type="number" className="input-field" placeholder="e.g. 140" value={draft.interiorSize} onChange={e => updateDraft('interiorSize', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Measurement Unit</label>
              <select className="input-field" value={draft.sizeUnit} onChange={e => updateDraft('sizeUnit', e.target.value)}>
                <option value="sqm">Square Meters (sqm)</option>
                <option value="sqft">Square Feet (sqft)</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-grid">
            <div className="input-group form-full">
              <label>Listing Editorial Title</label>
              <input type="text" className="input-field" placeholder="e.g. Golden Triangle Haussmann Residence" value={draft.title} onChange={e => updateDraft('title', e.target.value)} />
            </div>
            <div className="input-group form-full">
              <label>Architectural Description & Narrative</label>
              <textarea 
                className="input-field" 
                style={{ height: '140px', padding: 'var(--space-3)' }} 
                placeholder="Detail the natural illumination, ceiling heights, materials, historical restoration, and neighborhood ambiance."
                value={draft.description}
                onChange={e => updateDraft('description', e.target.value)}
              />
              <p className="text-meta" style={{ marginTop: '4px', color: 'var(--color-text-ash)' }}>
                Editorial tone: Refined, clear, and informative. Avoid excessive real estate jargon.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {AMENITY_GROUPS.map(group => (
              <div key={group.category}>
                <h3 className="h5" style={{ marginBottom: 'var(--space-3)', color: 'var(--color-primary-navy)' }}>{group.category}</h3>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  {group.items.map(am => (
                    <label 
                      key={am} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: 'var(--space-2) var(--space-4)', 
                        border: '1px solid',
                        borderColor: draft.amenities.includes(am) ? 'var(--color-primary-navy)' : 'var(--color-border-limestone)',
                        borderRadius: 'var(--radius-md)', 
                        cursor: 'pointer', 
                        backgroundColor: draft.amenities.includes(am) ? 'var(--color-bg-sand)' : 'transparent',
                        fontSize: '13px'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={draft.amenities.includes(am)} 
                        onChange={() => toggleAmenity(am)} 
                      /> 
                      {am}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div>
            <div 
              onClick={() => mediaFileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--color-border-limestone)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                textAlign: 'center',
                backgroundColor: 'var(--color-bg-ivory)',
                cursor: 'pointer',
                marginBottom: 'var(--space-6)'
              }}
            >
              <input 
                ref={mediaFileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleMediaUpload} 
                style={{ display: 'none' }} 
              />
              <UploadCloud size={36} color="var(--color-primary-navy)" style={{ margin: '0 auto var(--space-2)' }} />
              <h3 className="h5" style={{ margin: '0 0 4px 0' }}>Upload Architectural Photography</h3>
              <p className="text-meta" style={{ margin: 0 }}>Click or drag files. Primary photo will be used as the catalog hero.</p>
            </div>

            {/* Image List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {draft.images.map((img, idx) => (
                <div key={img.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)' }}>
                  <img src={img.url} alt={`Preview ${idx + 1}`} style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="text-meta" style={{ fontWeight: 600 }}>Photo {idx + 1}</span>
                      {img.isPrimary && (
                        <span style={{ fontSize: '10px', backgroundColor: 'var(--color-primary-navy)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                          Primary Cover
                        </span>
                      )}
                    </div>
                    <div className="text-meta" style={{ fontSize: '12px', color: 'var(--color-text-slate)' }}>{img.caption}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {!img.isPrimary && (
                      <button onClick={() => setPrimaryImage(img.id)} className="btn btn-secondary text-small" title="Make primary">
                        <Star size={13} /> Cover
                      </button>
                    )}
                    <button onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="btn btn-secondary text-small" style={{ opacity: idx === 0 ? 0.3 : 1 }}>
                      <ArrowUp size={13} />
                    </button>
                    <button onClick={() => moveImage(idx, 'down')} disabled={idx === draft.images.length - 1} className="btn btn-secondary text-small" style={{ opacity: idx === draft.images.length - 1 ? 0.3 : 1 }}>
                      <ArrowDown size={13} />
                    </button>
                    <button onClick={() => removeImage(img.id)} className="btn btn-secondary text-small" style={{ color: 'var(--color-error-brick)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Video & Floor Plan Inputs */}
            <div className="grid grid-cols-12" style={{ gap: 'var(--space-4)' }}>
              <div className="col-span-12 md-col-span-6 input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Video size={14} /> Video Walkthrough URL (Vimeo / YouTube)
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="https://player.vimeo.com/video/..." 
                  value={draft.videoUrl} 
                  onChange={e => updateDraft('videoUrl', e.target.value)} 
                />
              </div>

              <div className="col-span-12 md-col-span-6 input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} /> Architectural CAD Floor Plan
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={draft.floorPlanName} 
                  onChange={e => updateDraft('floorPlanName', e.target.value)} 
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="form-grid">
            <div className="input-group">
              <label>{draft.type === 'sale' ? 'Sale Price' : 'Asking Price'}</label>
              <input type="number" className="input-field" placeholder="e.g. 3500000" value={draft.price} onChange={e => updateDraft('price', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Currency</label>
              <select className="input-field" value={draft.currency} onChange={e => updateDraft('currency', e.target.value)}>
                <option value="€">EUR (€) - European Union</option>
                <option value="£">GBP (£) - United Kingdom</option>
                <option value="$">USD ($) - United States</option>
                <option value="AED">AED - United Arab Emirates</option>
                <option value="S$">SGD (S$) - Singapore</option>
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
              <label>Availability Schedule</label>
              <select className="input-field" value={draft.availability} onChange={e => updateDraft('availability', e.target.value)}>
                <option value="immediate">Available immediately</option>
                <option value="specific_date">Available from specific calendar date</option>
                <option value="occupied">Occupied (Pre-viewings permitted)</option>
              </select>
            </div>
            {draft.availability === 'specific_date' && (
              <div className="input-group">
                <label>Available From Date</label>
                <input type="date" className="input-field" />
              </div>
            )}
          </div>
        );
      case 8:
        return (
          <div className="form-grid">
            <div className="input-group form-full">
              <label>Designated Contact Representative (Displayed Publicly)</label>
              <input type="text" className="input-field" placeholder="e.g. Sarah Jenkins" value={draft.contactName} onChange={e => updateDraft('contactName', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Contact Email</label>
              <input type="email" className="input-field" placeholder="e.g. agent@auremont.com" value={draft.contactEmail} onChange={e => updateDraft('contactEmail', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Contact Phone</label>
              <input type="tel" className="input-field" placeholder="+33 1 42 68 55 00" value={draft.contactPhone} onChange={e => updateDraft('contactPhone', e.target.value)} />
            </div>
          </div>
        );
      case 9:
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div>
                <h3 className="h4" style={{ margin: 0 }}>Review Your Residence Listing</h3>
                <p className="text-meta" style={{ margin: '2px 0 0 0' }}>Verify completeness before submitting for compliance and editorial review.</p>
              </div>
              <Link 
                to={id ? `/provider/properties/${id}/preview` : `/provider/properties/new_draft/preview`} 
                target="_blank" 
                className="btn btn-secondary text-small"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Eye size={14} /> Full Public Preview <ArrowRight size={13} />
              </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {/* Summary Card */}
              <div style={{ backgroundColor: 'var(--color-bg-ivory)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-limestone)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="h4" style={{ margin: 0 }}>{draft.title || <span className="text-error">Missing Title</span>}</div>
                  <button className="text-small" style={{ color: 'var(--color-primary-navy)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCurrentStep(3)}>Edit</button>
                </div>
                <p className="text-meta" style={{ marginTop: '4px' }}>
                  {draft.city || <span className="text-error">Missing City</span>}{draft.city && draft.country && ', '}{draft.country} • {draft.type.toUpperCase()}
                </p>
                <div style={{ fontWeight: 600, fontSize: '18px', marginTop: 'var(--space-4)', fontFamily: 'monospace' }}>
                  {draft.currency} {draft.price || <span className="text-error">Missing Price</span>} {draft.type !== 'sale' && `/${draft.pricingCadence === 'monthly' ? 'mo' : 'period'}`}
                </div>
                <div className="text-meta" style={{ marginTop: 'var(--space-3)', fontSize: '12px' }}>
                  {draft.bedrooms} Beds • {draft.bathrooms} Baths • {draft.interiorSize} {draft.sizeUnit} • {draft.furnishedState}
                </div>
              </div>
              
              {/* Completeness Checklist */}
              <div style={{ backgroundColor: 'var(--color-surface-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-limestone)' }}>
                <h4 className="h5" style={{ marginBottom: 'var(--space-4)' }}>Editorial Verification Checklist</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    {draft.title ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-error-brick)" />}
                    Title provided ({draft.title ? 'Pass' : 'Missing'})
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    {draft.price ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-error-brick)" />}
                    Financial price configured
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    {draft.images.length > 0 ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-error-brick)" />}
                    Photography uploaded ({draft.images.length} photos)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    {draft.description.length > 30 ? <Check size={16} color="var(--color-success-forest)" /> : <AlertCircle size={16} color="var(--color-warning-ochre)" />}
                    Architectural description ({draft.description.length} characters)
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4)', backgroundColor: 'rgba(165, 108, 39, 0.08)', border: '1px solid var(--color-warning-ochre)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
              <AlertCircle size={20} color="var(--color-warning-ochre)" style={{ flexShrink: 0 }} /> 
              <span className="text-small" style={{ color: 'var(--color-text-slate)' }}>
                Submission transfers the listing to the <strong>Under Review</strong> state. Published status requires compliance approval.
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1 className="h3">{isEditing ? 'Edit Property Listing' : 'Create Residence Listing'}</h1>
            <p className="text-meta">Step {currentStep + 1} of {STEPS.length}: <strong>{STEPS[currentStep]}</strong></p>
          </div>
          <div className="save-status text-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderSaveStatus()}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator" style={{ display: 'flex', alignItems: 'center', marginTop: 'var(--space-4)', overflowX: 'auto', paddingBottom: '4px' }}>
          {STEPS.map((step, idx) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button 
                onClick={() => setCurrentStep(idx)}
                className={`step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                title={step}
                style={{ cursor: 'pointer', border: 'none', padding: 0 }}
              />
              {idx < STEPS.length - 1 && (
                <div style={{ width: 'clamp(8px, 1.8vw, 20px)', height: '1px', backgroundColor: 'var(--color-border-limestone)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="add-property-content">
        <h2 className="h4 step-title" style={{ marginBottom: 'var(--space-6)' }}>{STEPS[currentStep]}</h2>
        
        {renderStepContent()}

        <div className="form-actions" style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
            style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => currentStep === STEPS.length - 1 ? handleSubmit() : setCurrentStep(prev => prev + 1)}
          >
            {currentStep === STEPS.length - 1 ? 'Submit for Review' : 'Continue'} 
            {currentStep < STEPS.length - 1 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

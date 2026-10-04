import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropertyDetail from '../PropertyDetail';
import { useProviderState } from '../../context/ProviderContext';
import type { Property } from '../../data/mockProperties';
import { ArrowLeft, Edit, Image as ImageIcon } from 'lucide-react';

export default function PropertyPreview() {
  const { id } = useParams<{ id: string }>();
  const { properties } = useProviderState();

  const previewProperty = useMemo<Property | null>(() => {
    // 1. Check local draft
    const draftKey = id ? `auremont_draft_${id}` : 'auremont_new_draft';
    const savedDraftStr = localStorage.getItem(draftKey);
    let draftData: any = null;
    if (savedDraftStr) {
      try {
        draftData = JSON.parse(savedDraftStr);
      } catch (e) {
        // ignore
      }
    }

    // 2. Check provider properties
    const existingProp = properties.find(p => p.id === id);

    if (!draftData && !existingProp) {
      return null;
    }

    const title = draftData?.title || existingProp?.title || 'Untitled Residence Preview';
    const city = draftData?.city || (existingProp?.location ? existingProp.location.split(',')[0].trim() : 'Paris');
    const country = draftData?.country || (existingProp?.location ? existingProp.location.split(',')[1]?.trim() || 'France' : 'France');
    const type = (draftData?.type || existingProp?.type || 'rent') as 'sale' | 'rent' | 'lease';
    const price = Number(draftData?.price) || existingProp?.price || 1500000;
    const currency = draftData?.currency || existingProp?.currency || '€';
    const mainImg = existingProp?.mainImage || '/images/paris_apartment.jpg';
    const gallery = existingProp?.images && existingProp.images.length > 0 ? existingProp.images : [mainImg, '/images/madrid_apartment.jpg', '/images/lisbon_house.jpg'];

    const mapped: Property = {
      id: id || 'preview_draft',
      slug: (title || 'residence').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      transactionType: type === 'sale' ? 'Buy' : type === 'rent' ? 'Rent' : 'Lease',
      propertyType: (draftData?.propertyType || existingProp?.propertyType || 'Apartment') as 'Apartment' | 'House' | 'Loft' | 'Villa' | 'Residence',
      title: `${title} [DRAFT PREVIEW]`,
      country: country,
      city: city,
      neighborhood: draftData?.neighborhood || 'Central District',
      address: draftData?.address || '10 Avenue Montaigne',
      coordinates: { lat: 48.8661, lng: 2.3075 },
      price: price,
      currency: currency,
      pricingCadence: type === 'sale' ? undefined : (draftData?.pricingCadence === 'weekly' ? '/ week' : draftData?.pricingCadence === 'yearly' ? '/ year' : '/ month'),
      beds: Number(draftData?.bedrooms) || existingProp?.bedrooms || 3,
      baths: Number(draftData?.bathrooms) || existingProp?.bathrooms || 2,
      size: Number(draftData?.interiorSize) || existingProp?.interiorSize || 140,
      sizeUnit: 'm²',
      furnished: Boolean(draftData?.furnishedState === 'Furnished' || existingProp?.furnishedState === 'Furnished'),
      description: draftData?.description || existingProp?.description || 'A bespoke architectural residence curated exclusively for Auremont clients.',
      features: ['Air Conditioning', 'Elevator', 'Terrace', 'High Ceilings'],
      amenities: draftData?.amenities && draftData.amenities.length > 0 ? draftData.amenities : (existingProp?.amenities || ['Air Conditioning', 'Elevator', 'Terrace']),
      availability: 'Immediate',
      mainImage: mainImg,
      gallery: gallery,
      video: draftData?.videoUrl || undefined,
      floorPlan: draftData?.floorPlanUrl || undefined,
      provider: {
        name: draftData?.contactName || 'Auremont Partner Provider',
        role: 'Agent',
        verifiedIdentity: true,
        avatar: '/images/madrid_apartment.jpg'
      },
      listingVerified: false,
      publicationStatus: 'Draft',
      favoriteState: false,
      creationDate: 'Oct 2026'
    };

    return mapped;
  }, [id, properties]);

  return (
    <div>
      {/* Prominent Preview Mode Banner */}
      <aside 
        aria-label="Provider Preview Mode Notice"
        style={{ 
          backgroundColor: 'var(--color-primary-navy)', 
          color: 'var(--color-surface-white)', 
          padding: 'var(--space-3) var(--space-6)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ 
            backgroundColor: 'var(--color-warning-ochre)', 
            color: '#000', 
            fontWeight: 700, 
            fontSize: '11px', 
            padding: '2px 8px', 
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Preview Mode
          </span>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>
            Viewing unpublished draft: <strong>{previewProperty?.title || id}</strong>. Not visible in public search.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {id && (
            <Link 
              to={`/provider/properties/${id}/media`} 
              style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none', padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}
            >
              <ImageIcon size={14} /> Media
            </Link>
          )}
          <Link 
            to={id ? `/provider/properties/${id}/edit` : `/provider/properties/new`} 
            style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none', padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}
          >
            <Edit size={14} /> Edit Listing
          </Link>
          <Link 
            to="/provider/properties" 
            style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }}
          >
            <ArrowLeft size={14} /> Back to Listings
          </Link>
        </div>
      </aside>

      {/* Render the unified public property presentation with draft data */}
      {previewProperty ? (
        <PropertyDetail previewProperty={previewProperty} />
      ) : (
        <div className="provider-panel" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <h2 className="h4">Draft Listing Not Found</h2>
          <p className="text-meta" style={{ marginTop: 'var(--space-2)' }}>No local draft or listing exists for ID "{id}".</p>
          <Link to="/provider/properties/new" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Create New Listing</Link>
        </div>
      )}
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import PropertyDetail from '../PropertyDetail';
import { ArrowLeft } from 'lucide-react';

export default function PropertyPreview() {
  const { id } = useParams();

  // Since PropertyDetail fetches from Consumer API, and this is a preview of a draft,
  // we would normally inject draft data here. For this phase, we display the
  // PropertyDetail component wrapped with a "Preview Mode" banner.
  
  return (
    <div>
      <div style={{ backgroundColor: 'var(--color-primary-navy)', color: 'var(--color-surface-white)', padding: 'var(--space-2) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider Preview Mode</span>
        </div>
        <Link to={`/provider/properties/${id}/edit`} style={{ color: 'var(--color-surface-white)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Editor
        </Link>
      </div>
      
      {/* Reusing the public presentation layer */}
      <PropertyDetail />
    </div>
  );
}

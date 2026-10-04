import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProviderState } from '../../context/ProviderContext';
import { 
  ArrowLeft, 
  UploadCloud, 
  Star, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  AlertCircle, 
  Video, 
  FileText, 
  Save, 
  RotateCw 
} from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  caption: string;
  isPrimary: boolean;
  status: 'queued' | 'uploading' | 'uploaded' | 'failed';
  progress: number;
}

export default function PropertyMedia() {
  const { id } = useParams<{ id: string }>();
  const { properties, updateProperty } = useProviderState();
  const property = properties.find(p => p.id === id);

  const [images, setImages] = useState<MediaItem[]>(() => {
    if (property?.images && property.images.length > 0) {
      return property.images.map((img, idx) => ({
        id: `img_${idx}`,
        url: img,
        caption: idx === 0 ? 'Main architectural elevation' : `Interior angle ${idx}`,
        isPrimary: idx === 0,
        status: 'uploaded',
        progress: 100
      }));
    }
    return [
      {
        id: 'img_default',
        url: property?.mainImage || '/images/paris_apartment.jpg',
        caption: 'Primary Facade',
        isPrimary: true,
        status: 'uploaded',
        progress: 100
      }
    ];
  });

  const [videoUrl, setVideoUrl] = useState<string>('https://player.vimeo.com/video/example-architectural-tour');
  const [floorPlanName, setFloorPlanName] = useState<string>('architectural_ground_plan_cad.pdf');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up any temporary object URLs when unmounting
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = Array.from(files).map((file, idx) => {
      const objectUrl = URL.createObjectURL(file);
      return {
        id: `upload_${Date.now()}_${idx}`,
        url: objectUrl,
        caption: file.name.replace(/\.[^/.]+$/, ""),
        isPrimary: images.length === 0 && idx === 0,
        status: 'uploading',
        progress: 20
      };
    });

    setImages(prev => [...prev, ...newItems]);

    // Simulate upload progression
    newItems.forEach(item => {
      setTimeout(() => {
        setImages(prev => prev.map(img => img.id === item.id ? { ...img, progress: 70 } : img));
      }, 600);

      setTimeout(() => {
        setImages(prev => prev.map(img => img.id === item.id ? { ...img, status: 'uploaded', progress: 100 } : img));
      }, 1200);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setPrimary = (itemId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === itemId
    })));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const updateCaption = (itemId: string, caption: string) => {
    setImages(prev => prev.map(img => img.id === itemId ? { ...img, caption } : img));
  };

  const removeImage = (itemId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== itemId);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const retryUpload = (itemId: string) => {
    setImages(prev => prev.map(img => img.id === itemId ? { ...img, status: 'uploading', progress: 50 } : img));
    setTimeout(() => {
      setImages(prev => prev.map(img => img.id === itemId ? { ...img, status: 'uploaded', progress: 100 } : img));
    }, 1000);
  };

  const saveMediaChanges = () => {
    if (property && id) {
      const primaryImg = images.find(img => img.isPrimary) || images[0];
      updateProperty(id, {
        mainImage: primaryImg ? primaryImg.url : property.mainImage,
        images: images.map(img => img.url)
      });
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  if (!property) {
    return (
      <div className="provider-panel" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <h2 className="h4">Property Not Found</h2>
        <Link to="/provider/properties" className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="provider-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/provider/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-navy)', fontSize: '14px', textDecoration: 'none', marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to Listings
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="h3" style={{ margin: 0 }}>Media Management</h1>
            <p className="text-meta" style={{ marginTop: '4px' }}>
              {property.title} • {property.location}
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={saveMediaChanges}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSavedNotice ? <><Check size={16} /> Saved Successfully</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--color-border-limestone)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-ivory)',
          cursor: 'pointer',
          marginBottom: 'var(--space-8)'
        }}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
        />
        <UploadCloud size={40} color="var(--color-primary-navy)" style={{ margin: '0 auto var(--space-3)' }} />
        <h3 className="h4" style={{ margin: '0 0 6px 0' }}>Upload Architectural Photography</h3>
        <p className="text-meta" style={{ margin: 0, color: 'var(--color-text-slate)' }}>
          Click to browse or drop high-resolution photographs. Supports JPG, PNG, WebP up to 25MB each.
        </p>
      </div>

      {/* Photo Gallery List with Reordering */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 className="h4" style={{ marginBottom: 'var(--space-4)' }}>
          Curated Gallery ({images.length} photos)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {images.map((img, idx) => (
            <div 
              key={img.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--color-border-limestone)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap'
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', width: '120px', height: '80px', flexShrink: 0 }}>
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                />
                {img.isPrimary && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '4px', 
                    left: '4px', 
                    backgroundColor: 'var(--color-primary-navy)', 
                    color: '#fff', 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    Primary
                  </span>
                )}
              </div>

              {/* Caption and Upload status */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="text-meta" style={{ fontWeight: 600 }}>Position {idx + 1}</span>
                  {img.status === 'uploading' && (
                    <span style={{ fontSize: '11px', color: 'var(--color-warning-ochre)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RotateCw size={12} className="spin" /> Uploading {img.progress}%
                    </span>
                  )}
                  {img.status === 'uploaded' && (
                    <span style={{ fontSize: '11px', color: 'var(--color-success-forest)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> Ready
                    </span>
                  )}
                  {img.status === 'failed' && (
                    <span style={{ fontSize: '11px', color: 'var(--color-error-brick)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> Failed
                      <button onClick={() => retryUpload(img.id)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-navy)', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px' }}>Retry</button>
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={img.caption} 
                  onChange={e => updateCaption(img.id, e.target.value)}
                  placeholder="Enter editorial caption (e.g. Master suite balcony view)" 
                  className="input-field" 
                  style={{ fontSize: '13px', padding: '6px 10px' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {!img.isPrimary && (
                  <button 
                    onClick={() => setPrimary(img.id)}
                    className="btn btn-secondary text-small"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Set as primary thumbnail"
                  >
                    <Star size={14} /> Make Primary
                  </button>
                )}
                
                <button 
                  onClick={() => moveUp(idx)} 
                  disabled={idx === 0} 
                  className="btn btn-secondary text-small"
                  style={{ padding: '6px 10px', opacity: idx === 0 ? 0.4 : 1 }}
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>

                <button 
                  onClick={() => moveDown(idx)} 
                  disabled={idx === images.length - 1} 
                  className="btn btn-secondary text-small"
                  style={{ padding: '6px 10px', opacity: idx === images.length - 1 ? 0.4 : 1 }}
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>

                <button 
                  onClick={() => removeImage(img.id)} 
                  className="btn btn-secondary text-small"
                  style={{ padding: '6px 10px', color: 'var(--color-error-brick)' }}
                  title="Remove Image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Video & Floor Plans */}
      <div className="grid grid-cols-12" style={{ gap: 'var(--space-6)' }}>
        
        {/* Video Tour Architecture */}
        <div className="col-span-12 md-col-span-6" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <Video size={18} color="var(--color-primary-navy)" />
            <h3 className="h5" style={{ margin: 0 }}>Cinematic Video Walkthrough</h3>
          </div>
          <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>
            Embed an ultra-HD 4K tour hosted on Vimeo, YouTube Unlisted, or Matterport 3D.
          </p>
          <div className="input-group">
            <label className="text-meta">Embed URL</label>
            <input 
              type="text" 
              className="input-field" 
              value={videoUrl} 
              onChange={e => setVideoUrl(e.target.value)} 
              placeholder="https://player.vimeo.com/video/..." 
            />
          </div>
        </div>

        {/* Floor Plan Architecture */}
        <div className="col-span-12 md-col-span-6" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <FileText size={18} color="var(--color-primary-navy)" />
            <h3 className="h5" style={{ margin: 0 }}>Architectural CAD Floor Plans</h3>
          </div>
          <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>
            Verified dimensional floor plans downloadable by vetted prospective buyers.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-sand)', borderRadius: 'var(--radius-md)' }}>
            <FileText size={16} />
            <span className="text-small" style={{ fontWeight: 500, flex: 1 }}>{floorPlanName}</span>
            <button className="btn btn-secondary text-small" onClick={() => setFloorPlanName('updated_architectural_plan.pdf')}>
              Replace
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

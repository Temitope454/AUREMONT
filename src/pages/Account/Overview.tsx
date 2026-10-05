import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockProperties } from '../../data/mockProperties';
import { mockCars } from '../../data/mockCars';
import { ChevronRight } from 'lucide-react';

export default function Overview() {
  const { user } = useAuth();
  
  // Mock data derivation for overview
  const upcomingBooking = mockCars[0]; 
  const recentFavorite = mockProperties[1];

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3">Welcome back, {user?.firstName}.</h1>
        <p className="text-meta">Here is your account overview and recent activity.</p>
      </div>

      <div className="panel-body">
        
        <div className="overview-module-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)'}}>
          
          <div className="overview-module" style={{padding: 'var(--space-6)', background: 'var(--color-bg-sand)', borderRadius: 'var(--radius-lg)'}}>
            <h3 className="h4" style={{marginBottom: 'var(--space-4)'}}>Upcoming booking</h3>
            <div style={{display:'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)'}}>
              <img src={upcomingBooking.mainImage} alt="Car" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />
              <div>
                <div style={{fontWeight: 600}}>{upcomingBooking.make} {upcomingBooking.model}</div>
                <div className="text-meta">Tomorrow • Paris</div>
              </div>
            </div>
            <Link to="/account/bookings" className="link text-ink" style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'14px', fontWeight:500}}>
              View details <ChevronRight size={14}/>
            </Link>
          </div>

          <div className="overview-module" style={{padding: 'var(--space-6)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)'}}>
            <h3 className="h4" style={{marginBottom: 'var(--space-4)'}}>Recent favorite</h3>
            <div style={{display:'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)'}}>
              <img src={recentFavorite.mainImage} alt="Property" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} />
              <div>
                <div style={{fontWeight: 600}}>{recentFavorite.title}</div>
                <div className="text-meta">Madrid, Spain</div>
              </div>
            </div>
            <Link to="/account/favorites" className="link text-ink" style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'14px', fontWeight:500}}>
              Manage favorites <ChevronRight size={14}/>
            </Link>
          </div>

        </div>

        <div className="overview-list" style={{borderTop: '1px solid var(--color-border-limestone)', paddingTop: 'var(--space-6)'}}>
          <h3 className="h4" style={{marginBottom: 'var(--space-4)'}}>Recent activity</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)'}}>
              <div>
                <div style={{fontWeight: 500}}>Message from Claire Moreau</div>
                <div className="text-meta">Regarding Rue de Varenne Residence</div>
              </div>
              <span className="text-meta">2 hours ago</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)'}}>
              <div>
                <div style={{fontWeight: 500}}>New property in your saved search</div>
                <div className="text-meta">Residences in Lisbon</div>
              </div>
              <span className="text-meta">Yesterday</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

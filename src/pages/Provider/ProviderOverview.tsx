import { useAuth } from '../../context/AuthContext';
import { useProviderState } from '../../context/ProviderContext';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Clock, AlertCircle, Home, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../data/mockProperties';

export default function ProviderOverview() {
  const { user } = useAuth();
  const { leads, requests, transactions } = useProviderState();
  const isAgent = user?.providerRole === 'agent';

  // Calculate earnings snapshot
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const pendingVolume = pendingTransactions.reduce((acc, t) => acc + t.netAmount, 0);

  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const completedVolume = completedTransactions.reduce((acc, t) => acc + t.netAmount, 0);

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Overview</h1>
        <p className="text-meta">Here is what needs your attention today.</p>
      </div>

      {/* Actionable Alerts Row */}
      <div className="grid grid-cols-12" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="col-span-12 md-col-span-6 lg-col-span-4" style={{ 
          padding: 'var(--space-6)', 
          backgroundColor: 'var(--color-bg-sand)', 
          borderRadius: 'var(--radius-lg)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', color: 'var(--color-warning-ochre)' }}>
            <AlertCircle size={20} />
            <h3 className="h4" style={{ margin: 0 }}>Action required</h3>
          </div>
          {isAgent ? (
            <p className="text-small">You have 2 new leads that require follow-up within 24 hours.</p>
          ) : (
            <p className="text-small">You have 1 pending rental request awaiting approval.</p>
          )}
          <Link to={isAgent ? "/provider/leads" : "/provider/requests"} className="btn btn-primary" style={{ marginTop: 'var(--space-2)', width: '100%' }}>
            Review now
          </Link>
        </div>

        <div className="col-span-12 md-col-span-6 lg-col-span-8">
          <div className="grid grid-cols-12" style={{ height: '100%' }}>
            
            <div className="col-span-12 md-col-span-6" style={{
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border-limestone)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>Pending earnings</h3>
                <div className="h2" style={{ margin: 0 }}>{formatPrice(pendingVolume, '€')}</div>
              </div>
              <Link to="/provider/earnings" className="text-small" style={{ color: 'var(--color-primary-navy)', fontWeight: 500, display: 'flex', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                View earnings <ChevronRight size={16} />
              </Link>
            </div>

            <div className="col-span-12 md-col-span-6" style={{
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border-limestone)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>Completed earnings</h3>
                <div className="h2" style={{ margin: 0 }}>{formatPrice(completedVolume, '€')}</div>
              </div>
              <div className="text-meta" style={{ color: 'var(--color-success-forest)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-4)' }}>
                <TrendingUp size={16} /> +12% this month
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Operational Queues */}
      <div className="grid grid-cols-12" style={{ marginBottom: 'var(--space-8)' }}>
        
        {/* Properties Status */}
        <div className="col-span-12 md-col-span-6" style={{
          border: '1px solid var(--color-border-limestone)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="h4" style={{ margin: 0 }}>Listings</h3>
            <Link to="/provider/properties" className="text-small" style={{ color: 'var(--color-primary-navy)' }}>Manage</Link>
          </div>
          <div style={{ padding: 'var(--space-4) var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--color-success-forest)"/> Published active</span>
              <strong>{isAgent ? '12' : '3'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="var(--color-warning-ochre)"/> Under review</span>
              <strong>1</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Home size={16} color="var(--color-text-slate)"/> Drafts</span>
              <strong>2</strong>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="col-span-12 md-col-span-6" style={{
          border: '1px solid var(--color-border-limestone)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="h4" style={{ margin: 0 }}>{isAgent ? 'Recent Leads' : 'Rental Requests'}</h3>
            <Link to={isAgent ? "/provider/leads" : "/provider/requests"} className="text-small" style={{ color: 'var(--color-primary-navy)' }}>View all</Link>
          </div>
          <div style={{ padding: '0' }}>
            {(isAgent ? leads : requests as any[]).slice(0, 2).map((item, i) => (
              <div key={item.id} style={{ 
                padding: 'var(--space-4) var(--space-6)', 
                borderBottom: i === 0 ? '1px solid var(--color-border-limestone)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong className="text-small">{item.customerName}</strong>
                  <span className="text-meta" style={{ color: 'var(--color-text-slate)' }}>{item.status}</span>
                </div>
                <div className="text-small" style={{ color: 'var(--color-text-slate)' }}>{item.propertyTitle}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

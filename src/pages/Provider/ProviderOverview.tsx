import { useAuth } from '../../context/AuthContext';
import { useProviderState } from '../../context/ProviderContext';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, AlertCircle, Home, CheckCircle2, DollarSign } from 'lucide-react';
import { formatPrice } from '../../data/mockProperties';

export default function ProviderOverview() {
  const { user } = useAuth();
  const { properties, leads, requests, transactions } = useProviderState();
  const isAgent = user?.providerRole === 'agent';

  // Group transactions by currency for safe summary
  const currencies = Array.from(new Set(transactions.map(t => t.currency)));
  const primaryCurrency = currencies[0] || '€';

  // Calculate earnings for primary currency
  const primaryTx = transactions.filter(t => t.currency === primaryCurrency);
  const pendingTransactions = primaryTx.filter(t => t.status === 'pending');
  const pendingVolume = pendingTransactions.reduce((acc, t) => acc + (t.netAmount || 0), 0);

  const completedTransactions = primaryTx.filter(t => t.status === 'completed');
  const completedVolume = completedTransactions.reduce((acc, t) => acc + (t.netAmount || 0), 0);

  // Property counts from actual state
  const publishedCount = properties.filter(p => p.status === 'published').length;
  const underReviewCount = properties.filter(p => p.status === 'under_review').length;
  const draftCount = properties.filter(p => p.status === 'draft').length;

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Provider Overview</h1>
        <p className="text-meta">
          {isAgent ? 'Licensed Agent Workspace' : 'Landlord Portfolio Workspace'} • Logged in as {user?.firstName} {user?.lastName}
        </p>
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
            <p className="text-small">
              You have {leads.filter(l => l.status === 'new').length} new lead(s) requiring response.
            </p>
          ) : (
            <p className="text-small">
              You have {requests.filter(r => r.status === 'pending').length} pending rental request(s) awaiting review.
            </p>
          )}
          <Link to={isAgent ? "/provider/leads" : "/provider/requests"} className="btn btn-primary" style={{ marginTop: 'var(--space-4)', width: '100%', display: 'inline-block', textAlign: 'center' }}>
            {isAgent ? "Review Leads" : "Review Requests"}
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
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-surface-white)'
            }}>
              <div>
                <h3 className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>
                  Pending net ({primaryCurrency})
                </h3>
                <div className="h2" style={{ margin: 0, color: 'var(--color-warning-ochre)' }}>
                  {formatPrice(pendingVolume, primaryCurrency)}
                </div>
                <p className="text-meta" style={{ fontSize: '12px', marginTop: '4px', color: 'var(--color-text-ash)' }}>
                  {pendingTransactions.length} pending settlement(s)
                </p>
              </div>
              <Link to="/provider/earnings" className="text-small" style={{ color: 'var(--color-primary-navy)', fontWeight: 500, display: 'flex', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                View multi-currency earnings <ChevronRight size={16} />
              </Link>
            </div>

            <div className="col-span-12 md-col-span-6" style={{
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border-limestone)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-surface-white)'
            }}>
              <div>
                <h3 className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>
                  Settled net ({primaryCurrency})
                </h3>
                <div className="h2" style={{ margin: 0, color: 'var(--color-success-forest)' }}>
                  {formatPrice(completedVolume, primaryCurrency)}
                </div>
                <p className="text-meta" style={{ fontSize: '12px', marginTop: '4px', color: 'var(--color-text-ash)' }}>
                  Across {currencies.length} active global currencies
                </p>
              </div>
              <div className="text-meta" style={{ color: 'var(--color-text-slate)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-4)' }}>
                <DollarSign size={16} /> Disbursed to verified bank account
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
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-white)'
        }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="h4" style={{ margin: 0 }}>Listings Portfolio</h3>
            <Link to="/provider/properties" className="text-small" style={{ color: 'var(--color-primary-navy)' }}>Manage ({properties.length})</Link>
          </div>
          <div style={{ padding: 'var(--space-4) var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--color-success-forest)"/> Published active</span>
              <strong>{publishedCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="var(--color-warning-ochre)"/> Under review</span>
              <strong>{underReviewCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Home size={16} color="var(--color-text-slate)"/> Drafts</span>
              <strong>{draftCount}</strong>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="col-span-12 md-col-span-6" style={{
          border: '1px solid var(--color-border-limestone)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-white)'
        }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="h4" style={{ margin: 0 }}>{isAgent ? 'Recent Leads' : 'Rental Requests'}</h3>
            <Link to={isAgent ? "/provider/leads" : "/provider/requests"} className="text-small" style={{ color: 'var(--color-primary-navy)' }}>
              View all ({isAgent ? leads.length : requests.length})
            </Link>
          </div>
          <div>
            {(isAgent ? leads : requests as any[]).slice(0, 3).map((item, i) => (
              <div key={item.id} style={{ 
                padding: 'var(--space-4) var(--space-6)', 
                borderBottom: i === Math.min(2, (isAgent ? leads.length : requests.length) - 1) ? 'none' : '1px solid var(--color-border-limestone)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong className="text-small">{item.customerName}</strong>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    backgroundColor: 'var(--color-bg-sand)',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    {item.status}
                  </span>
                </div>
                <div className="text-small" style={{ color: 'var(--color-text-slate)' }}>{item.propertyTitle}</div>
              </div>
            ))}
            {(isAgent ? leads : requests).length === 0 && (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-ash)' }}>
                No active records.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

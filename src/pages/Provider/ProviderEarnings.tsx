import { useProviderState } from '../../context/ProviderContext';
import { formatPrice } from '../../data/mockProperties';
import { Briefcase, CreditCard, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderEarnings() {
  const { transactions } = useProviderState();

  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const grossCompleted = completedTransactions.reduce((acc, t) => acc + t.grossAmount, 0);
  const commissionCompleted = completedTransactions.reduce((acc, t) => acc + t.commissionAmount, 0);
  const netCompleted = completedTransactions.reduce((acc, t) => acc + t.netAmount, 0);

  const netPending = pendingTransactions.reduce((acc, t) => acc + t.netAmount, 0);

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Earnings Overview</h1>
        <p className="text-meta">Review your financial activity and pending payouts.</p>
      </div>

      <div className="grid grid-cols-12" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="col-span-12 md-col-span-4" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>
            <Briefcase size={16} /> <span className="text-meta">Net Completed Earnings</span>
          </div>
          <div className="h2" style={{ margin: 0 }}>{formatPrice(netCompleted, '€')}</div>
          <p className="text-small" style={{ color: 'var(--color-text-slate)', marginTop: '4px' }}>From {completedTransactions.length} transactions</p>
        </div>

        <div className="col-span-12 md-col-span-4" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-sand)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>
            <Clock size={16} /> <span className="text-meta">Net Pending Earnings</span>
          </div>
          <div className="h2" style={{ margin: 0 }}>{formatPrice(netPending, '€')}</div>
          <p className="text-small" style={{ color: 'var(--color-text-slate)', marginTop: '4px' }}>From {pendingTransactions.length} transactions in progress</p>
        </div>
      </div>

      <div style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 className="h4" style={{ margin: 0 }}>Lifetime Breakdown (Completed)</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>
          <span className="text-meta">Gross Transaction Value</span>
          <strong style={{ fontFamily: 'monospace', fontSize: '15px' }}>{formatPrice(grossCompleted, '€')}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border-limestone)' }}>
          <span className="text-meta">Auremont Commission</span>
          <strong style={{ fontFamily: 'monospace', fontSize: '15px', color: 'var(--color-error-brick)' }}>-{formatPrice(commissionCompleted, '€')}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-4)' }}>
          <span className="text-meta" style={{ color: 'var(--color-primary-navy)' }}>Net Earnings</span>
          <strong style={{ fontFamily: 'monospace', fontSize: '18px', color: 'var(--color-success-forest)' }}>{formatPrice(netCompleted, '€')}</strong>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 className="h4" style={{ margin: 0 }}>Recent Completed Transactions</h2>
          <Link to="/provider/transactions" className="btn btn-secondary text-small">View all</Link>
        </div>
        
        {completedTransactions.slice(0, 3).map(tx => (
          <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-navy)' }}>
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{tx.propertyTitle}</div>
                <div className="text-meta" style={{ color: 'var(--color-text-slate)' }}>{tx.date} • {tx.type === 'sale' ? 'Sale' : 'Rent'}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '16px' }}>{formatPrice(tx.netAmount, tx.currency)}</div>
              <Link to="/provider/transactions" className="text-small" style={{ color: 'var(--color-primary-navy)', display: 'inline-flex', alignItems: 'center' }}>Details <ChevronRight size={14} /></Link>
            </div>
          </div>
        ))}
        {completedTransactions.length === 0 && (
          <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>No completed transactions yet.</p>
        )}
      </div>

    </div>
  );
}

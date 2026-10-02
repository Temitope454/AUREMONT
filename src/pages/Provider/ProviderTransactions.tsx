import { useProviderState } from '../../context/ProviderContext';
import { formatPrice } from '../../data/mockProperties';
import { Download } from 'lucide-react';

export default function ProviderTransactions() {
  const { transactions } = useProviderState();

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h3">Transactions</h1>
        <p className="text-meta">A detailed history of your gross volumes, commissions, and net payouts.</p>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Reference / Date</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property / Customer</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Type</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Gross Amount</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Auremont Commission</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Net Earnings</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.id} style={{ borderBottom: i === transactions.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', fontFamily: 'monospace' }}>{tx.reference}</div>
                  <div className="text-meta" style={{ color: 'var(--color-text-ash)' }}>{tx.date}</div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>{tx.propertyTitle}</div>
                  <div className="text-meta" style={{ color: 'var(--color-text-slate)' }}>{tx.customerName}</div>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', textTransform: 'capitalize' }}>
                  {tx.type}
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', fontFamily: 'monospace', textAlign: 'right' }}>
                  {formatPrice(tx.grossAmount, tx.currency)}
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', fontFamily: 'monospace', textAlign: 'right', color: 'var(--color-error-brick)' }}>
                  - {formatPrice(tx.commissionAmount, tx.currency)}
                  <div className="text-meta" style={{ color: 'var(--color-text-ash)', marginTop: '2px' }}>({tx.commissionRate * 100}%)</div>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '15px', fontFamily: 'monospace', textAlign: 'right', fontWeight: 600, color: 'var(--color-success-forest)' }}>
                  {formatPrice(tx.netAmount, tx.currency)}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    backgroundColor: tx.status === 'completed' ? 'rgba(52, 112, 87, 0.1)' : 'rgba(165, 108, 39, 0.1)',
                    color: tx.status === 'completed' ? 'var(--color-success-forest)' : 'var(--color-warning-ochre)'
                  }}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  {tx.status === 'completed' && (
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-slate)' }} title="Download Receipt">
                      <Download size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {transactions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <h3 className="h4">No transactions found</h3>
                  <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>Your transaction history will appear here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

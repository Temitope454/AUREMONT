import { useState } from 'react';
import { useProviderState } from '../../context/ProviderContext';
import { formatPrice } from '../../data/mockProperties';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderTransactions() {
  const { transactions } = useProviderState();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const currencies = Array.from(new Set(transactions.map(t => t.currency)));

  const filteredTransactions = transactions.filter(t => {
    const matchesCurrency = selectedCurrency === 'all' || t.currency === selectedCurrency;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    return matchesCurrency && matchesStatus;
  });

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Transactions & Settlements</h1>
          <p className="text-meta">A detailed audit history of gross volumes, platform commissions, and net payouts.</p>
        </div>
        <Link to="/provider/earnings" className="btn btn-secondary text-small">
          View Multi-Currency Earnings
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="text-meta" style={{ fontWeight: 600 }}>Currency:</span>
          <select 
            value={selectedCurrency} 
            onChange={e => setSelectedCurrency(e.target.value)}
            className="input-field"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="all">All Currencies ({currencies.length})</option>
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr} Portfolio</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="text-meta" style={{ fontWeight: 600 }}>Status:</span>
          <select 
            value={selectedStatus} 
            onChange={e => setSelectedStatus(e.target.value)}
            className="input-field"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Reference / Date</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property / Customer</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Type</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Gross Amount</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Auremont Commission</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Net Payout</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', width: '60px', textAlign: 'center' }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, i) => (
              <tr key={tx.id} style={{ borderBottom: i === filteredTransactions.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <Link 
                    to={`/provider/transactions/${tx.id}`} 
                    style={{ fontWeight: 600, fontSize: '14px', fontFamily: 'monospace', color: 'var(--color-primary-navy)', textDecoration: 'none' }}
                  >
                    {tx.reference}
                  </Link>
                  <div className="text-meta" style={{ color: 'var(--color-text-ash)', fontSize: '12px' }}>{tx.date}</div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>{tx.propertyTitle}</div>
                  <div className="text-meta" style={{ color: 'var(--color-text-slate)', fontSize: '12px' }}>{tx.customerName}</div>
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', textTransform: 'capitalize' }}>
                  {tx.type}
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', fontFamily: 'monospace', textAlign: 'right' }}>
                  {formatPrice(tx.grossAmount, tx.currency)}
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '14px', fontFamily: 'monospace', textAlign: 'right', color: 'var(--color-error-brick)' }}>
                  {tx.isConfigured && tx.commissionAmount !== undefined && tx.commissionRate !== undefined ? (
                    <>
                      - {formatPrice(tx.commissionAmount, tx.currency)}
                      <div className="text-meta" style={{ color: 'var(--color-text-ash)', marginTop: '2px', fontSize: '11px' }}>({tx.commissionRate * 100}%)</div>
                    </>
                  ) : (
                    <span className="text-meta" style={{ color: 'var(--color-warning-ochre)', fontSize: '11px' }}>{tx.commissionMessage || 'Requires configuration'}</span>
                  )}
                </td>
                <td style={{ padding: 'var(--space-4)', fontSize: '15px', fontFamily: 'monospace', textAlign: 'right', fontWeight: 600, color: 'var(--color-success-forest)' }}>
                  {tx.isConfigured && tx.netAmount !== undefined ? formatPrice(tx.netAmount, tx.currency) : '—'}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 600,
                    backgroundColor: tx.status === 'completed' ? 'rgba(52, 112, 87, 0.1)' : 'rgba(165, 108, 39, 0.1)',
                    color: tx.status === 'completed' ? 'var(--color-success-forest)' : 'var(--color-warning-ochre)'
                  }}>
                    {tx.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <Link 
                    to={`/provider/transactions/${tx.id}`} 
                    className="btn btn-secondary text-small"
                    style={{ padding: '4px 8px' }}
                    title="View settlement ledger"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <h3 className="h4">No transactions found</h3>
                  <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>No records match the active currency or status filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

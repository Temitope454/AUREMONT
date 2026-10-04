import { useState } from 'react';
import { useProviderState } from '../../context/ProviderContext';
import { formatPrice } from '../../data/mockProperties';
import { Briefcase, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderEarnings() {
  const { transactions } = useProviderState();

  // Extract all distinct currencies
  const currencies = Array.from(new Set(transactions.map(t => t.currency)));
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currencies[0] || '€');

  // Filter transactions for the selected currency
  const currencyTransactions = transactions.filter(t => t.currency === selectedCurrency);
  const completed = currencyTransactions.filter(t => t.status === 'completed');
  const pending = currencyTransactions.filter(t => t.status === 'pending');

  const grossCompleted = completed.reduce((acc, t) => acc + t.grossAmount, 0);
  const commissionCompleted = completed.reduce((acc, t) => acc + (t.commissionAmount || 0), 0);
  const netCompleted = completed.reduce((acc, t) => acc + (t.netAmount || 0), 0);
  const netPending = pending.reduce((acc, t) => acc + (t.netAmount || 0), 0);

  const unconfiguredCount = currencyTransactions.filter(t => !t.isConfigured).length;

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="h3">Earnings & Financial Settlement</h1>
        <p className="text-meta">
          Independent settlements grouped strictly by currency. Auremont does not merge distinct fiat currencies.
        </p>
      </div>

      {/* Currency Switcher Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-border-limestone)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span className="text-meta" style={{ alignSelf: 'center', marginRight: 'var(--space-2)', fontWeight: 600 }}>Currencies:</span>
        {currencies.map(curr => {
          const currTx = transactions.filter(t => t.currency === curr);
          const isSelected = selectedCurrency === curr;
          return (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--color-primary-navy)' : 'var(--color-border-limestone)',
                backgroundColor: isSelected ? 'var(--color-primary-navy)' : 'var(--color-surface-white)',
                color: isSelected ? 'var(--color-surface-white)' : 'var(--color-text-slate)',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{curr} Portfolio</span>
              <span style={{ 
                fontSize: '11px', 
                padding: '1px 6px', 
                borderRadius: '10px', 
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-sand)' 
              }}>
                {currTx.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Currency KPI Cards */}
      <div className="grid grid-cols-12" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="col-span-12 md-col-span-6 lg-col-span-4" style={{ 
          padding: 'var(--space-6)', 
          backgroundColor: 'var(--color-bg-ivory)', 
          border: '1px solid var(--color-border-limestone)', 
          borderRadius: 'var(--radius-lg)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>
            <Briefcase size={16} /> <span className="text-meta">Net Settled ({selectedCurrency})</span>
          </div>
          <div className="h2" style={{ margin: 0, color: 'var(--color-success-forest)' }}>
            {formatPrice(netCompleted, selectedCurrency)}
          </div>
          <p className="text-small" style={{ color: 'var(--color-text-slate)', marginTop: '4px' }}>
            From {completed.length} completed transactions
          </p>
        </div>

        <div className="col-span-12 md-col-span-6 lg-col-span-4" style={{ 
          padding: 'var(--space-6)', 
          backgroundColor: 'var(--color-bg-sand)', 
          border: '1px solid var(--color-border-limestone)', 
          borderRadius: 'var(--radius-lg)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-slate)', marginBottom: 'var(--space-2)' }}>
            <Clock size={16} /> <span className="text-meta">Net Pending ({selectedCurrency})</span>
          </div>
          <div className="h2" style={{ margin: 0, color: 'var(--color-warning-ochre)' }}>
            {formatPrice(netPending, selectedCurrency)}
          </div>
          <p className="text-small" style={{ color: 'var(--color-text-slate)', marginTop: '4px' }}>
            From {pending.length} transactions pending settlement
          </p>
        </div>

        {unconfiguredCount > 0 && (
          <div className="col-span-12 lg-col-span-4" style={{ 
            padding: 'var(--space-6)', 
            backgroundColor: 'rgba(217, 83, 79, 0.06)', 
            border: '1px solid rgba(217, 83, 79, 0.25)', 
            borderRadius: 'var(--radius-lg)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error-brick)', marginBottom: 'var(--space-2)' }}>
              <AlertTriangle size={16} /> <span className="text-meta" style={{ fontWeight: 600 }}>Unconfigured Models</span>
            </div>
            <div className="h4" style={{ margin: 0 }}>{unconfiguredCount} transaction(s)</div>
            <p className="text-small" style={{ color: 'var(--color-text-slate)', marginTop: '4px' }}>
              Lease / Mobility items excluded from automated payout until rate agreement is set.
            </p>
          </div>
        )}
      </div>

      {/* Lifetime Settlement Breakdown */}
      <div style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-white)', marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 className="h4" style={{ margin: 0 }}>Settled Portfolio Breakdown ({selectedCurrency})</h2>
          <span className="text-meta" style={{ color: 'var(--color-text-ash)' }}>Centralized commission rules applied</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)' }}>
          <span className="text-meta">Gross Volume (Completed)</span>
          <strong style={{ fontFamily: 'monospace', fontSize: '15px' }}>{formatPrice(grossCompleted, selectedCurrency)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border-limestone)' }}>
          <span className="text-meta">Auremont Platform Commission (10% Sale / 5% Rent)</span>
          <strong style={{ fontFamily: 'monospace', fontSize: '15px', color: 'var(--color-error-brick)' }}>
            -{formatPrice(commissionCompleted, selectedCurrency)}
          </strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-4)' }}>
          <span className="text-meta" style={{ color: 'var(--color-primary-navy)', fontWeight: 600 }}>Net Disbursed Provider Earnings</span>
          <strong style={{ fontFamily: 'monospace', fontSize: '18px', color: 'var(--color-success-forest)' }}>
            {formatPrice(netCompleted, selectedCurrency)}
          </strong>
        </div>
      </div>

      {/* Itemized Transactions for this Currency */}
      <div style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 className="h4" style={{ margin: 0 }}>{selectedCurrency} Transactions Ledger</h2>
          <Link to="/provider/transactions" className="btn btn-secondary text-small" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Full Transactions <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Ref / Date</th>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Type</th>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Gross</th>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Commission</th>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Net</th>
                <th style={{ padding: 'var(--space-3)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {currencyTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border-limestone)' }}>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <Link to={`/provider/transactions/${tx.id}`} style={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace', color: 'var(--color-primary-navy)' }}>
                      {tx.reference}
                    </Link>
                    <div className="text-meta" style={{ fontSize: '11px', color: 'var(--color-text-ash)' }}>{tx.date}</div>
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: '13px' }}>{tx.propertyTitle}</td>
                  <td style={{ padding: 'var(--space-3)', fontSize: '13px', textTransform: 'capitalize' }}>{tx.type}</td>
                  <td style={{ padding: 'var(--space-3)', fontSize: '13px', fontFamily: 'monospace', textAlign: 'right' }}>
                    {formatPrice(tx.grossAmount, tx.currency)}
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: '13px', fontFamily: 'monospace', textAlign: 'right', color: 'var(--color-error-brick)' }}>
                    {tx.isConfigured && tx.commissionAmount !== undefined ? (
                      `-${formatPrice(tx.commissionAmount, tx.currency)}`
                    ) : (
                      <span className="text-meta" style={{ color: 'var(--color-warning-ochre)', fontSize: '11px' }}>Requires config</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: '14px', fontFamily: 'monospace', textAlign: 'right', fontWeight: 600, color: 'var(--color-success-forest)' }}>
                    {tx.isConfigured && tx.netAmount !== undefined ? formatPrice(tx.netAmount, tx.currency) : '—'}
                  </td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      backgroundColor: tx.status === 'completed' ? 'rgba(52, 112, 87, 0.1)' : 'rgba(165, 108, 39, 0.1)',
                      color: tx.status === 'completed' ? 'var(--color-success-forest)' : 'var(--color-warning-ochre)'
                    }}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProviderState } from '../../context/ProviderContext';
import { formatPrice } from '../../data/mockProperties';
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const { transactions } = useProviderState();
  const navigate = useNavigate();

  const transaction = transactions.find(t => t.id === id || t.reference === id);

  if (!transaction) {
    return (
      <div className="provider-panel" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <h2 className="h4">Transaction Not Found</h2>
        <p className="text-meta" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          The requested transaction record could not be found or has been archived.
        </p>
        <button onClick={() => navigate('/provider/transactions')} className="btn btn-secondary">
          Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="provider-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/provider/transactions" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-navy)', fontSize: '14px', textDecoration: 'none', marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to All Transactions
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="h3" style={{ margin: 0, fontFamily: 'monospace' }}>{transaction.reference}</h1>
            <p className="text-meta" style={{ marginTop: '4px' }}>
              Recorded on {transaction.date} • {transaction.type.toUpperCase()} Settlement
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '13px', 
              fontWeight: 600,
              backgroundColor: transaction.status === 'completed' ? 'rgba(52, 112, 87, 0.1)' : 'rgba(165, 108, 39, 0.1)',
              color: transaction.status === 'completed' ? 'var(--color-success-forest)' : 'var(--color-warning-ochre)'
            }}>
              {transaction.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              {transaction.status === 'completed' ? 'Settled & Completed' : 'Pending Settlement'}
            </span>
            <button className="btn btn-secondary text-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => alert('Demo receipt download simulation.')}>
              <Download size={14} /> Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div style={{ backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h2 className="h4" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border-limestone)' }}>
          Financial Settlement Breakdown
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-meta">Gross Contract Amount</span>
            <strong style={{ fontFamily: 'monospace', fontSize: '18px' }}>
              {formatPrice(transaction.grossAmount, transaction.currency)}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="text-meta">Auremont Platform Commission</span>
              {transaction.isConfigured && transaction.commissionRate !== undefined && (
                <span className="text-meta" style={{ color: 'var(--color-text-ash)', marginLeft: '8px' }}>
                  ({transaction.commissionRate * 100}% rate)
                </span>
              )}
            </div>
            {transaction.isConfigured && transaction.commissionAmount !== undefined ? (
              <strong style={{ fontFamily: 'monospace', fontSize: '16px', color: 'var(--color-error-brick)' }}>
                -{formatPrice(transaction.commissionAmount, transaction.currency)}
              </strong>
            ) : (
              <span style={{ color: 'var(--color-warning-ochre)', fontSize: '13px', fontWeight: 600 }}>
                {transaction.commissionMessage || 'Requires configuration'}
              </span>
            )}
          </div>

          <div style={{ borderTop: '2px solid var(--color-border-limestone)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-primary-navy)' }}>
              Net Payout to Provider
            </span>
            <strong style={{ fontFamily: 'monospace', fontSize: '22px', color: 'var(--color-success-forest)' }}>
              {transaction.isConfigured && transaction.netAmount !== undefined ? formatPrice(transaction.netAmount, transaction.currency) : '—'}
            </strong>
          </div>
        </div>
      </div>

      {/* Counterparty & Property Details */}
      <div className="grid grid-cols-12" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="col-span-12 md-col-span-6" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="h5" style={{ marginBottom: 'var(--space-3)' }}>Property Subject</h3>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{transaction.propertyTitle}</div>
          <div className="text-meta" style={{ marginTop: '4px', textTransform: 'capitalize' }}>
            Category: {transaction.type} Residence
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link to="/provider/properties" className="text-small" style={{ color: 'var(--color-primary-navy)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Open Property in Listings <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        <div className="col-span-12 md-col-span-6" style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-ivory)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="h5" style={{ marginBottom: 'var(--space-3)' }}>Counterparty & Settlement</h3>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{transaction.customerName}</div>
          <div className="text-meta" style={{ marginTop: '4px' }}>
            Payment Method: {transaction.paymentMethod || 'Escrow Client Account'}
          </div>
          <div className="text-meta" style={{ marginTop: '4px', fontSize: '12px', color: 'var(--color-text-ash)' }}>
            Fiat Currency: {transaction.currency} (No FX conversion applied)
          </div>
        </div>
      </div>

      {/* Compliance & Audit Footer */}
      <div style={{ padding: 'var(--space-4) var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <ShieldCheck size={20} color="var(--color-success-forest)" />
        <span className="text-meta" style={{ fontSize: '12px', color: 'var(--color-text-slate)' }}>
          Auremont Trust & Escrow: Settlement records are cryptographically verified and immutable for compliance reporting.
        </span>
      </div>
    </div>
  );
}

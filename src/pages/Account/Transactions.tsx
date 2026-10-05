import { formatPrice } from '../../data/mockProperties';

export default function Transactions() {
  const transactions = [
    {
      id: 'TX-89A4B2',
      date: '10 Oct 2023',
      item: 'Alfama Courtyard House',
      type: 'Rental Booking',
      amount: 4800,
      currency: '€',
      status: 'Successful',
      paymentMethod: 'Visa ending in 4242'
    },
    {
      id: 'TX-32C9F1',
      date: '15 Sep 2023',
      item: 'Porsche Taycan Cross Turismo',
      type: 'Vehicle Booking',
      amount: 1350,
      currency: '€',
      status: 'Successful',
      paymentMethod: 'Mastercard ending in 8812'
    }
  ];

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3">Transactions</h1>
        <p className="text-meta">Your recent booking and payment history.</p>
      </div>

      <div className="panel-body">
        {transactions.length > 0 ? (
          <div className="transaction-list" style={{display: 'flex', flexDirection: 'column'}}>
            {transactions.map(tx => (
              <div key={tx.id} className="transaction-row" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--space-4) 0',
                borderBottom: '1px solid var(--color-border-limestone)'
              }}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '15px'}}>{tx.item}</div>
                  <div className="text-meta" style={{marginTop: '4px'}}>
                    {tx.date} • {tx.type} • {tx.paymentMethod}
                  </div>
                  <div className="text-meta" style={{marginTop: '4px', fontSize: '12px'}}>Ref: {tx.id}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontWeight: 600, fontFamily: 'monospace', fontSize: '16px'}}>{formatPrice(tx.amount, tx.currency)}</div>
                  <div style={{fontSize: '13px', color: 'var(--color-success-forest)', marginTop: '4px'}}>{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{padding: 'var(--space-8)'}}>
            <h3 className="h4">No transactions found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

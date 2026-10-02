import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockCars } from '../data/mockCars';
import { mockProperties, formatPrice } from '../data/mockProperties';
import { ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import './Checkout.css';

type CheckoutState = 'ready' | 'processing' | 'success' | 'failed';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('ready');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [error, setError] = useState('');

  // Extract booking item context passed via route state
  const itemType = location.state?.itemType as 'property' | 'vehicle' | undefined;
  const itemId = location.state?.itemId as string | undefined;

  const item = itemType === 'vehicle' 
    ? mockCars.find(c => c.id === itemId)
    : mockProperties.find(p => p.id === itemId);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
    if (!item) {
      navigate('/search');
    }
  }, [isAuthenticated, item, navigate, location]);

  if (!item || !isAuthenticated) return null;

  const basePrice = item.price;
  const isVehicle = itemType === 'vehicle';
  
  // Mock explicit user-facing taxes/fees (no invented commissions)
  const tax = basePrice * 0.20; // 20% VAT example
  const total = basePrice + tax;
  const currency = item.currency;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutState === 'processing') return;
    
    setCheckoutState('processing');
    setError('');

    // Simulate payment gateway delay
    setTimeout(() => {
      // 90% success rate for demo purposes
      if (Math.random() > 0.1) {
        setCheckoutState('success');
      } else {
        setCheckoutState('failed');
        setError('Your card was declined. Please try a different payment method (Frontend Mock).');
      }
    }, 2000);
  };

  if (checkoutState === 'success') {
    const txRef = 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    return (
      <div className="checkout-page success-state">
        <div className="checkout-success-container">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h1 className="h2">Payment successful</h1>
          <p className="large text-slate">Your booking has been confirmed. Transaction reference: <strong>{txRef}</strong></p>
          
          <div className="success-summary">
            <div className="summary-row">
              <span className="text-meta">Item</span>
              <span>{itemType === 'vehicle' ? `${(item as any).make} ${(item as any).model}` : (item as any).title}</span>
            </div>
            <div className="summary-row">
              <span className="text-meta">Amount paid</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>
          
          <div className="success-actions">
            <Link to="/account/transactions" className="btn btn-primary">View in account</Link>
            <Link to={isVehicle ? '/cars' : '/search'} className="btn btn-secondary">Return to marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header container">
        <button className="icon-btn-labeled" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Back to details
        </button>
        <div className="secure-badge">
          <Lock size={14} /> Secure Checkout
        </div>
      </div>

      <div className="container checkout-split">
        <div className="checkout-main">
          <h1 className="h2" style={{marginBottom: 'var(--space-8)'}}>Complete your booking</h1>
          
          {error && <div className="checkout-error">{error}</div>}

          <form onSubmit={handlePayment}>
            <div className="checkout-section">
              <h2 className="h3">Your details</h2>
              <div className="form-row grid-2">
                <div className="form-group">
                  <label>First name</label>
                  <input type="text" className="input-field" defaultValue={user?.firstName} required />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input type="text" className="input-field" defaultValue={user?.lastName} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="input-field" defaultValue={user?.email} required />
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="h3">Payment method</h2>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span>Credit / Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span>PayPal</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details-mock">
                  <div className="form-group">
                    <label>Card number</label>
                    <input type="text" className="input-field" placeholder="0000 0000 0000 0000" required={paymentMethod === 'card'} maxLength={19} />
                  </div>
                  <div className="form-row grid-2">
                    <div className="form-group">
                      <label>Expiry (MM/YY)</label>
                      <input type="text" className="input-field" placeholder="MM/YY" required={paymentMethod === 'card'} maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label>CVC</label>
                      <input type="text" className="input-field" placeholder="123" required={paymentMethod === 'card'} maxLength={4} />
                    </div>
                  </div>
                  <p className="text-meta" style={{marginTop: 'var(--space-2)'}}>This is a demonstration environment. Do not enter real card details.</p>
                </div>
              )}
            </div>

            <div className="checkout-section">
              <button 
                type="submit" 
                className="btn btn-primary w-full" 
                disabled={checkoutState === 'processing'}
                style={{height: '56px', fontSize: '16px'}}
              >
                {checkoutState === 'processing' ? 'Processing secure payment...' : `Pay ${formatPrice(total, currency)}`}
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-panel">
            <h2 className="h3">Order summary</h2>
            
            <div className="summary-item-card">
              <img src={item.mainImage} alt="Item" className="summary-image" />
              <div className="summary-item-details">
                <div className="text-meta">{itemType === 'vehicle' ? 'Vehicle booking' : 'Property booking'}</div>
                <div style={{fontWeight: 600}}>{itemType === 'vehicle' ? `${(item as any).make} ${(item as any).model}` : (item as any).title}</div>
                <div className="text-meta">{(item as any).location || (item as any).city}</div>
              </div>
            </div>

            <div className="summary-financials">
              <div className="summary-line">
                <span>Base amount</span>
                <span>{formatPrice(basePrice, currency)}</span>
              </div>
              <div className="summary-line">
                <span>Taxes & fees (VAT)</span>
                <span>{formatPrice(tax, currency)}</span>
              </div>
              <div className="summary-line total-line">
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

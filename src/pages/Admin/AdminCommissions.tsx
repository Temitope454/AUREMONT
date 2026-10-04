import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Calculator, 
  ShieldAlert
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { calculateCommission } from '../../utils/commission';
import './AdminCommissions.css';

export default function AdminCommissions() {
  const { 
    commissionPolicy, 
    updateCommissionPolicy, 
    addRegionalOverride, 
    removeRegionalOverride, 
    toggleRegionalOverride 
  } = useAdmin();

  // Local form state for editing global rates
  const [saleRateInput, setSaleRateInput] = useState((commissionPolicy.defaultSaleRate * 100).toString());
  const [rentRateInput, setRentRateInput] = useState((commissionPolicy.defaultRentRate * 100).toString());
  const [leaseConfigured, setLeaseConfigured] = useState(commissionPolicy.leaseConfigured);
  const [leaseRateInput, setLeaseRateInput] = useState((commissionPolicy.defaultLeaseRate * 100).toString());
  const [carsConfigured, setCarsConfigured] = useState(commissionPolicy.carsConfigured);
  const [carsRateInput, setCarsRateInput] = useState((commissionPolicy.defaultCarsRate * 100).toString());
  const [isSaved, setIsSaved] = useState(false);

  // New Regional Override Form Modal/Drawer
  const [isAddingOverride, setIsAddingOverride] = useState(false);
  const [newRegion, setNewRegion] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newSaleRate, setNewSaleRate] = useState('8');
  const [newRentRate, setNewRentRate] = useState('4');
  const [newNotes, setNewNotes] = useState('');

  // Interactive Live Commission Calculator
  const [calcAmount, setCalcAmount] = useState<number>(2500000);
  const [calcType, setCalcType] = useState<string>('sale');
  const [calcRegion, setCalcRegion] = useState<string>('global');

  // Handle saving global baseline rates
  const handleSaveGlobalRates = (e: React.FormEvent) => {
    e.preventDefault();
    const saleNum = parseFloat(saleRateInput) / 100;
    const rentNum = parseFloat(rentRateInput) / 100;
    const leaseNum = parseFloat(leaseRateInput) / 100;
    const carsNum = parseFloat(carsRateInput) / 100;

    if (isNaN(saleNum) || isNaN(rentNum)) return;

    updateCommissionPolicy({
      defaultSaleRate: saleNum,
      defaultRentRate: rentNum,
      leaseConfigured,
      defaultLeaseRate: isNaN(leaseNum) ? 0.075 : leaseNum,
      carsConfigured,
      defaultCarsRate: isNaN(carsNum) ? 0.12 : carsNum
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Handle adding a regional override rule
  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegion.trim() || !newCountry.trim()) return;

    addRegionalOverride({
      region: newRegion.trim(),
      country: newCountry.trim(),
      saleCommissionRate: parseFloat(newSaleRate) / 100,
      rentCommissionRate: parseFloat(newRentRate) / 100,
      notes: newNotes.trim() || 'Custom regional market rate alignment',
      isActive: true
    });

    setNewRegion('');
    setNewCountry('');
    setNewSaleRate('8');
    setNewRentRate('4');
    setNewNotes('');
    setIsAddingOverride(false);
  };

  // Perform Calculation taking into account regional overrides if selected
  const activeOverride = calcRegion !== 'global' 
    ? commissionPolicy.regionalOverrides.find(r => r.id === calcRegion)
    : null;

  let effectiveRate = 0;
  let calculationResult: ReturnType<typeof calculateCommission>;

  if (activeOverride && (calcType === 'sale' || calcType === 'rent')) {
    effectiveRate = calcType === 'sale' ? activeOverride.saleCommissionRate : activeOverride.rentCommissionRate;
    const commission = Math.round(calcAmount * effectiveRate * 100) / 100;
    const net = Math.round((calcAmount - commission) * 100) / 100;
    calculationResult = {
      isConfigured: true,
      rate: effectiveRate,
      commission,
      net,
      message: `Calculated with ${activeOverride.region} regional override (${(effectiveRate * 100).toFixed(1)}%)`
    };
  } else if (calcType === 'lease' && leaseConfigured) {
    effectiveRate = commissionPolicy.defaultLeaseRate;
    const commission = Math.round(calcAmount * effectiveRate * 100) / 100;
    const net = Math.round((calcAmount - commission) * 100) / 100;
    calculationResult = {
      isConfigured: true,
      rate: effectiveRate,
      commission,
      net,
      message: `Calculated with Phase 5 configured Lease rate (${(effectiveRate * 100).toFixed(1)}%)`
    };
  } else if (calcType === 'cars' && carsConfigured) {
    effectiveRate = commissionPolicy.defaultCarsRate;
    const commission = Math.round(calcAmount * effectiveRate * 100) / 100;
    const net = Math.round((calcAmount - commission) * 100) / 100;
    calculationResult = {
      isConfigured: true,
      rate: effectiveRate,
      commission,
      net,
      message: `Calculated with Phase 5 configured Mobility fee (${(effectiveRate * 100).toFixed(1)}%)`
    };
  } else {
    calculationResult = calculateCommission(calcAmount, calcType);
  }

  const formatPrice = (val: number, cur: string = '€') => {
    return `${cur}${val.toLocaleString('en-US')}`;
  };

  return (
    <div className="admin-commissions-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-breadcrumb">OPERATIONS CONSOLE &gt; COMMISSION &amp; FINANCIAL POLICIES</span>
          <h1 className="admin-page-title">Global Commission &amp; Fee Governance</h1>
          <p className="admin-page-subtitle">
            Configure institutional platform commission splits, define regional market overrides (e.g. Dubai, Monaco, London), and enforce automated financial rounding standards.
          </p>
        </div>
      </div>

      {/* Main Grid: Policy Editor + Interactive Simulator */}
      <div className="commissions-two-col">
        {/* Left: Global Policy Settings */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2 className="admin-panel-title">Baseline International Fee Schedule</h2>
              <p className="admin-panel-subtitle">Primary platform take rates applied to all standard marketplace transactions</p>
            </div>
          </div>

          <form onSubmit={handleSaveGlobalRates} className="admin-panel-body policy-form">
            <div className="form-row-2">
              <div className="policy-field-box">
                <label className="policy-label">
                  Property Sale Commission Rate
                  <span className="policy-tip">Auremont standard: 10.0%</span>
                </label>
                <div className="input-affix-wrap">
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="50"
                    value={saleRateInput}
                    onChange={e => setSaleRateInput(e.target.value)}
                    className="policy-input"
                    required
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>

              <div className="policy-field-box">
                <label className="policy-label">
                  Long-Term Rental Commission Rate
                  <span className="policy-tip">Auremont standard: 5.0%</span>
                </label>
                <div className="input-affix-wrap">
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="50"
                    value={rentRateInput}
                    onChange={e => setRentRateInput(e.target.value)}
                    className="policy-input"
                    required
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Configurable Asset Classes (Lease & Cars) */}
            <div className="asset-classes-config">
              <h3 className="section-label">Additional Asset Classes</h3>
              
              <div className="toggle-config-row">
                <div className="toggle-info">
                  <strong>Commercial / Architectural Lease</strong>
                  <p className="text-meta">Currently {leaseConfigured ? 'Active' : 'Unconfigured by default'}</p>
                </div>
                <div className="toggle-action-group">
                  <label className="switch-label">
                    <input 
                      type="checkbox" 
                      checked={leaseConfigured} 
                      onChange={e => setLeaseConfigured(e.target.checked)} 
                    />
                    <span className="switch-slider"></span>
                  </label>
                  {leaseConfigured && (
                    <div className="input-affix-wrap affix-sm">
                      <input 
                        type="number" 
                        step="0.1" 
                        value={leaseRateInput} 
                        onChange={e => setLeaseRateInput(e.target.value)} 
                        className="policy-input" 
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="toggle-config-row">
                <div className="toggle-info">
                  <strong>Luxury Automotive / Mobility Bookings</strong>
                  <p className="text-meta">Currently {carsConfigured ? 'Active' : 'Unconfigured by default'}</p>
                </div>
                <div className="toggle-action-group">
                  <label className="switch-label">
                    <input 
                      type="checkbox" 
                      checked={carsConfigured} 
                      onChange={e => setCarsConfigured(e.target.checked)} 
                    />
                    <span className="switch-slider"></span>
                  </label>
                  {carsConfigured && (
                    <div className="input-affix-wrap affix-sm">
                      <input 
                        type="number" 
                        step="0.1" 
                        value={carsRateInput} 
                        onChange={e => setCarsRateInput(e.target.value)} 
                        className="policy-input" 
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="policy-footer">
              <div className="policy-meta-text">
                Last modified: {new Date(commissionPolicy.lastUpdated).toLocaleDateString()} by {commissionPolicy.updatedBy}
              </div>
              <button type="submit" className="btn btn-primary">
                {isSaved ? <><Check size={16} /> Saved to Core Policy</> : 'Update Global Policy'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Interactive Commission Simulator */}
        <div className="admin-panel simulator-panel">
          <div className="admin-panel-header">
            <div className="panel-title-group">
              <Calculator size={18} className="text-gold" />
              <div>
                <h2 className="admin-panel-title">Institutional Commission Simulator</h2>
                <p className="admin-panel-subtitle">Test and audit real-time fee splits against live policy rules</p>
              </div>
            </div>
          </div>

          <div className="admin-panel-body">
            <div className="calc-inputs-grid">
              <div className="calc-field">
                <label>Gross Transaction Amount (€)</label>
                <input 
                  type="number" 
                  value={calcAmount} 
                  onChange={e => setCalcAmount(Number(e.target.value))}
                  step="10000"
                  className="admin-input"
                />
              </div>

              <div className="calc-field">
                <label>Transaction Asset Class</label>
                <select value={calcType} onChange={e => setCalcType(e.target.value)} className="admin-select">
                  <option value="sale">Property Sale</option>
                  <option value="rent">Rental Lease</option>
                  <option value="lease">Commercial Lease</option>
                  <option value="cars">Mobility Fleet</option>
                </select>
              </div>

              <div className="calc-field">
                <label>Jurisdiction Rule</label>
                <select value={calcRegion} onChange={e => setCalcRegion(e.target.value)} className="admin-select">
                  <option value="global">Baseline International Rule</option>
                  {commissionPolicy.regionalOverrides.filter(r => r.isActive).map(r => (
                    <option key={r.id} value={r.id}>{r.region} ({r.country})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculation Result Breakdown Card */}
            <div className={`calc-result-card ${calculationResult.isConfigured ? 'result-configured' : 'result-unconfigured'}`}>
              {calculationResult.isConfigured ? (
                <>
                  <div className="result-metric-row">
                    <span className="res-lbl">Platform Commission Rate:</span>
                    <span className="res-rate font-serif">{((calculationResult.rate || 0) * 100).toFixed(1)}%</span>
                  </div>

                  <div className="result-split-visual">
                    <div className="split-line">
                      <span>Platform Fee (Retained)</span>
                      <strong className="text-gold font-serif">{formatPrice(calculationResult.commission || 0)}</strong>
                    </div>
                    <div className="split-line">
                      <span>Provider Net Disbursal</span>
                      <strong className="text-forest font-serif">{formatPrice(calculationResult.net || 0)}</strong>
                    </div>
                  </div>

                  <p className="res-message text-meta">{calculationResult.message}</p>
                </>
              ) : (
                <div className="unconfigured-warning">
                  <ShieldAlert size={24} className="text-amber" />
                  <div>
                    <strong>Unconfigured Asset Class</strong>
                    <p>{calculationResult.message}. Transactions for {calcType.toUpperCase()} cannot settle until an explicit rate policy is activated.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Overrides Matrix */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Regional Market Overrides</h2>
            <p className="admin-panel-subtitle">Specialized rate structures tailored to specific local regulatory or luxury broker corridors</p>
          </div>
          <button 
            onClick={() => setIsAddingOverride(true)} 
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} /> Add Regional Override
          </button>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Region / Corridor</th>
                <th>Country</th>
                <th>Sale Take Rate</th>
                <th>Rent Take Rate</th>
                <th>Justification & Notes</th>
                <th>Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissionPolicy.regionalOverrides.map(override => (
                <tr key={override.id}>
                  <td>
                    <strong>{override.region}</strong>
                  </td>
                  <td>{override.country}</td>
                  <td>
                    <span className="rate-chip font-serif">{(override.saleCommissionRate * 100).toFixed(1)}%</span>
                  </td>
                  <td>
                    <span className="rate-chip font-serif">{(override.rentCommissionRate * 100).toFixed(1)}%</span>
                  </td>
                  <td>
                    <span className="text-secondary">{override.notes}</span>
                  </td>
                  <td>
                    <label className="switch-label">
                      <input 
                        type="checkbox" 
                        checked={override.isActive} 
                        onChange={() => toggleRegionalOverride(override.id)} 
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => removeRegionalOverride(override.id)} 
                      className="btn-icon-delete"
                      title="Remove Override"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Regional Override Modal */}
      {isAddingOverride && (
        <div className="admin-modal-overlay" onClick={() => setIsAddingOverride(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Regional Override Rule</h2>
              <button onClick={() => setIsAddingOverride(false)} className="icon-btn-close">
                <Trash2 size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOverride} className="modal-body-scroll">
              <div className="form-group">
                <label className="admin-label">Region Name (e.g. Geneva Lakeside, Dubai Marina)</label>
                <input 
                  type="text" 
                  value={newRegion} 
                  onChange={e => setNewRegion(e.target.value)} 
                  className="admin-input" 
                  placeholder="e.g. Dubai DIFC"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="admin-label">Country Jurisdiction</label>
                <input 
                  type="text" 
                  value={newCountry} 
                  onChange={e => setNewCountry(e.target.value)} 
                  className="admin-input" 
                  placeholder="e.g. United Arab Emirates"
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="admin-label">Sale Commission Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={newSaleRate} 
                    onChange={e => setNewSaleRate(e.target.value)} 
                    className="admin-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label">Rental Commission Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={newRentRate} 
                    onChange={e => setNewRentRate(e.target.value)} 
                    className="admin-input" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="admin-label">Regulatory Justification</label>
                <textarea 
                  value={newNotes} 
                  onChange={e => setNewNotes(e.target.value)} 
                  rows={3} 
                  className="admin-textarea"
                  placeholder="Explain legal or competitive rationale..."
                />
              </div>

              <div className="modal-footer" style={{ padding: 'var(--space-4) 0 0 0' }}>
                <button type="button" onClick={() => setIsAddingOverride(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Regional Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

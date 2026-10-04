import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProviderState } from '../../context/ProviderContext';
import type { Lead } from '../../context/ProviderContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, MessageSquare, Phone, Mail, X } from 'lucide-react';

export default function ProviderLeads() {
  const { user, switchRole } = useAuth();
  const { leads, updateLeadStatus } = useProviderState();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const navigate = useNavigate();

  const isAgent = user?.providerRole === 'agent';

  // Role Gate for direct navigation by Landlords
  if (!isAgent) {
    return (
      <div className="provider-panel" style={{ maxWidth: '640px', margin: 'var(--space-12) auto', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', padding: 'var(--space-8)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <ShieldAlert size={44} color="var(--color-warning-ochre)" style={{ margin: '0 auto var(--space-4)' }} />
        <h2 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Agent Workspace Restricted</h2>
        <p className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-6)' }}>
          Buyer Leads are only accessible to Licensed Agent accounts. As a registered Landlord, prospective tenancy requests are managed under Rental Requests.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/provider/requests" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Go to Rental Requests <ArrowRight size={16} />
          </Link>
          <button onClick={() => switchRole('agent')} className="btn btn-secondary">
            Switch Demo Role to Agent
          </button>
        </div>
        <p className="text-meta" style={{ marginTop: 'var(--space-6)', fontSize: '11px', color: 'var(--color-text-ash)' }}>
          Auremont Demo Authorization: Role-gated route enforcement.
        </p>
      </div>
    );
  }

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Buyer Inquiries & Leads</h1>
          <p className="text-meta">Review inquiries from verified prospective buyers and schedule follow-ups.</p>
        </div>
        <div style={{ padding: '4px 12px', borderRadius: '16px', backgroundColor: 'var(--color-bg-sand)', fontSize: '12px', fontWeight: 600 }}>
          {leads.length} active leads
        </div>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Date / Customer</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Target Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Inquiry Message</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr key={lead.id} style={{ borderBottom: i === leads.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{lead.customerName}</div>
                  <div className="text-meta" style={{ color: 'var(--color-text-ash)', fontSize: '12px' }}>{lead.date}</div>
                </td>
                <td style={{ padding: 'var(--space-4)' }} className="text-small">
                  <strong>{lead.propertyTitle}</strong>
                  {lead.budget && <div className="text-meta" style={{ fontSize: '11px' }}>Budget: {lead.budget}</div>}
                </td>
                <td style={{ padding: 'var(--space-4)', maxWidth: '280px' }}>
                  <p className="text-small" style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-slate)' }}>
                    "{lead.message}"
                  </p>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: '1px solid var(--color-border-limestone)',
                      backgroundColor: lead.status === 'new' ? 'rgba(169, 104, 79, 0.1)' : 'var(--color-bg-sand)',
                      color: lead.status === 'new' ? 'var(--color-primary-navy)' : 'var(--color-text-slate)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="new">NEW INQUIRY</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="viewing_requested">VIEWING REQUESTED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setSelectedLead(lead)} 
                      className="btn btn-secondary text-small"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => navigate('/provider/messages')} 
                      className="btn btn-primary text-small"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MessageSquare size={14} /> Message
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>No active buyer leads found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'var(--space-4)'
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            maxWidth: '540px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)', paddingBottom: 'var(--space-3)' }}>
              <h3 className="h4" style={{ margin: 0 }}>Lead Dossier</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <span className="text-meta">Prospective Buyer</span>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{selectedLead.customerName}</div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: '4px', fontSize: '13px', color: 'var(--color-text-slate)' }}>
                  {selectedLead.customerEmail && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {selectedLead.customerEmail}</span>}
                  {selectedLead.customerPhone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {selectedLead.customerPhone}</span>}
                </div>
              </div>

              <div>
                <span className="text-meta">Subject Property</span>
                <div style={{ fontWeight: 500 }}>{selectedLead.propertyTitle}</div>
              </div>

              {selectedLead.budget && (
                <div>
                  <span className="text-meta">Declared Budget</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{selectedLead.budget}</div>
                </div>
              )}

              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-ivory)', borderRadius: 'var(--radius-md)' }}>
                <span className="text-meta" style={{ display: 'block', marginBottom: '4px' }}>Inquiry Message</span>
                <p className="text-small" style={{ margin: 0, fontStyle: 'italic' }}>"{selectedLead.message}"</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-limestone)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="text-meta">Status:</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => {
                      updateLeadStatus(selectedLead.id, e.target.value as Lead['status']);
                      setSelectedLead(prev => prev ? { ...prev, status: e.target.value as Lead['status'] } : null);
                    }}
                    className="input-field"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    <option value="new">New Inquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="viewing_requested">Viewing Requested</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    setSelectedLead(null);
                    navigate('/provider/messages');
                  }} 
                  className="btn btn-primary text-small"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <MessageSquare size={14} /> Open Message Thread
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

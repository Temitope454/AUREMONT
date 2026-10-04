import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProviderState } from '../../context/ProviderContext';
import type { Request } from '../../context/ProviderContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, MessageSquare, Calendar, X } from 'lucide-react';

export default function ProviderRequests() {
  const { user, switchRole } = useAuth();
  const { requests, updateRequestStatus } = useProviderState();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const navigate = useNavigate();

  const isAgent = user?.providerRole === 'agent';

  // Role Gate for direct navigation by Agents
  if (isAgent) {
    return (
      <div className="provider-panel" style={{ maxWidth: '640px', margin: 'var(--space-12) auto', textAlign: 'center', backgroundColor: 'var(--color-surface-white)', padding: 'var(--space-8)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <ShieldAlert size={44} color="var(--color-warning-ochre)" style={{ margin: '0 auto var(--space-4)' }} />
        <h2 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Landlord Workspace Restricted</h2>
        <p className="text-meta" style={{ color: 'var(--color-text-slate)', marginBottom: 'var(--space-6)' }}>
          Tenancy Rental Requests are managed exclusively by Property Landlords. As a Licensed Agent, prospective client inquiries are managed under Buyer Leads.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/provider/leads" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Go to Agent Leads <ArrowRight size={16} />
          </Link>
          <button onClick={() => switchRole('landlord')} className="btn btn-secondary">
            Switch Demo Role to Landlord
          </button>
        </div>
        <p className="text-meta" style={{ marginTop: 'var(--space-6)', fontSize: '11px', color: 'var(--color-text-ash)' }}>
          Auremont Demo Authorization: Role-gated route enforcement.
        </p>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleDecline = (id: string) => {
    updateRequestStatus(id, 'declined');
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: 'declined' } : null);
    }
  };

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Tenancy Rental Requests</h1>
          <p className="text-meta">Review, screen, and approve verified tenant booking requests for your properties.</p>
        </div>
        <div style={{ padding: '4px 12px', borderRadius: '16px', backgroundColor: 'var(--color-bg-sand)', fontSize: '12px', fontWeight: 600 }}>
          {requests.filter(r => r.status === 'pending').length} pending approval
        </div>
      </div>

      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Applicant</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Requested Dates</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={req.id} style={{ borderBottom: i === requests.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{req.customerName}</div>
                  <div className="text-meta" style={{ color: 'var(--color-text-ash)', fontSize: '12px' }}>Verified Consumer</div>
                </td>
                <td style={{ padding: 'var(--space-4)' }} className="text-small">
                  <strong>{req.propertyTitle}</strong>
                </td>
                <td style={{ padding: 'var(--space-4)' }} className="text-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {req.dates}
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                    backgroundColor: req.status === 'pending' ? 'rgba(165, 108, 39, 0.1)' : req.status === 'approved' ? 'rgba(52, 112, 87, 0.1)' : 'rgba(217, 83, 79, 0.1)',
                    color: req.status === 'pending' ? 'var(--color-warning-ochre)' : req.status === 'approved' ? 'var(--color-success-forest)' : 'var(--color-error-brick)'
                  }}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                    <button onClick={() => setSelectedRequest(req)} className="btn btn-secondary text-small">
                      Review
                    </button>
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(req.id)} className="btn btn-primary text-small">
                          Approve
                        </button>
                        <button onClick={() => handleDecline(req.id)} className="btn btn-secondary text-small" style={{ color: 'var(--color-error-brick)' }}>
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>No active rental requests found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tenancy Request Review Modal */}
      {selectedRequest && (
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
              <h3 className="h4" style={{ margin: 0 }}>Tenancy Application Review</h3>
              <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <span className="text-meta">Applicant Profile</span>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{selectedRequest.customerName}</div>
                <div className="text-small" style={{ color: 'var(--color-text-slate)', marginTop: '2px' }}>
                  {selectedRequest.employmentStatus || 'Verified Professional'} • {selectedRequest.occupants || 2} Occupant(s)
                </div>
              </div>

              <div>
                <span className="text-meta">Residence & Dates</span>
                <div style={{ fontWeight: 500 }}>{selectedRequest.propertyTitle}</div>
                <div className="text-meta" style={{ color: 'var(--color-text-slate)', marginTop: '2px' }}>
                  Term: {selectedRequest.dates}
                </div>
              </div>

              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-ivory)', borderRadius: 'var(--radius-md)' }}>
                <span className="text-meta" style={{ display: 'block', marginBottom: '4px' }}>Tenant Introduction Note</span>
                <p className="text-small" style={{ margin: 0 }}>"{selectedRequest.message}"</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-limestone)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <button 
                  onClick={() => {
                    setSelectedRequest(null);
                    navigate('/provider/messages');
                  }} 
                  className="btn btn-secondary text-small"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <MessageSquare size={14} /> Message Applicant
                </button>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {selectedRequest.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleDecline(selectedRequest.id)} 
                        className="btn btn-secondary text-small"
                        style={{ color: 'var(--color-error-brick)' }}
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleApprove(selectedRequest.id)} 
                        className="btn btn-primary text-small"
                      >
                        Approve Tenancy
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: selectedRequest.status === 'approved' ? 'var(--color-success-forest)' : 'var(--color-error-brick)' }}>
                      Application {selectedRequest.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

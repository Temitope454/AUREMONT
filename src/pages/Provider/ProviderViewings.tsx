import { useState } from 'react';
import { useProviderState } from '../../context/ProviderContext';
import type { ProviderViewing } from '../../context/ProviderContext';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MessageSquare, ExternalLink, Calendar, Phone, Mail, X } from 'lucide-react';

export default function ProviderViewings() {
  const { viewings, updateViewingStatus } = useProviderState();
  const [filterTab, setFilterTab] = useState<'all' | 'requested' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [activeViewing, setActiveViewing] = useState<ProviderViewing | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{ date: string; time: string }>({ date: '', time: '' });
  const [isRescheduling, setIsRescheduling] = useState(false);
  const navigate = useNavigate();

  const filteredViewings = viewings.filter(v => {
    if (filterTab === 'all') return true;
    return v.status === filterTab;
  });

  const handleConfirm = (id: string) => {
    updateViewingStatus(id, 'upcoming');
    if (activeViewing?.id === id) {
      setActiveViewing(prev => prev ? { ...prev, status: 'upcoming' } : null);
    }
  };

  const handleComplete = (id: string) => {
    updateViewingStatus(id, 'completed');
    if (activeViewing?.id === id) {
      setActiveViewing(prev => prev ? { ...prev, status: 'completed' } : null);
    }
  };

  const handleCancel = (id: string) => {
    updateViewingStatus(id, 'cancelled');
    if (activeViewing?.id === id) {
      setActiveViewing(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
  };

  const handleSaveReschedule = (id: string) => {
    if (!rescheduleData.date || !rescheduleData.time) return;
    updateViewingStatus(id, 'upcoming', rescheduleData.date, rescheduleData.time);
    setIsRescheduling(false);
    if (activeViewing?.id === id) {
      setActiveViewing(prev => prev ? { ...prev, status: 'upcoming', date: rescheduleData.date, timeSlot: rescheduleData.time } : null);
    }
  };

  return (
    <div className="provider-panel">
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Property Viewings</h1>
          <p className="text-meta">Coordinate scheduled private visits, confirm appointments, and follow up with prospective clients.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <span style={{ padding: '4px 12px', borderRadius: '16px', backgroundColor: 'var(--color-bg-sand)', fontSize: '12px', fontWeight: 600 }}>
            {viewings.filter(v => v.status === 'requested').length} Requested
          </span>
          <span style={{ padding: '4px 12px', borderRadius: '16px', backgroundColor: 'rgba(52, 112, 87, 0.1)', color: 'var(--color-success-forest)', fontSize: '12px', fontWeight: 600 }}>
            {viewings.filter(v => v.status === 'upcoming').length} Upcoming
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', paddingBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
        {(['all', 'requested', 'upcoming', 'completed', 'cancelled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: filterTab === tab ? 'var(--color-primary-navy)' : 'transparent',
              color: filterTab === tab ? 'var(--color-surface-white)' : 'var(--color-text-slate)',
              fontWeight: filterTab === tab ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab} ({tab === 'all' ? viewings.length : viewings.filter(v => v.status === tab).length})
          </button>
        ))}
      </div>

      {/* Viewings Table */}
      <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-bg-ivory)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Date & Time</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Client</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Property</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-slate)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredViewings.map((viewing, i) => (
              <tr key={viewing.id} style={{ borderBottom: i === filteredViewings.length - 1 ? 'none' : '1px solid var(--color-border-limestone)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--color-primary-navy)" /> {viewing.date}
                  </div>
                  <div className="text-meta" style={{ color: 'var(--color-text-ash)', fontSize: '12px', marginTop: '2px' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{viewing.timeSlot}
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>{viewing.customerName}</div>
                  <div className="text-meta" style={{ color: 'var(--color-text-slate)', fontSize: '12px' }}>{viewing.customerPhone}</div>
                </td>
                <td style={{ padding: 'var(--space-4)' }} className="text-small">
                  <strong>{viewing.propertyTitle}</strong>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                    backgroundColor: 
                      viewing.status === 'requested' ? 'rgba(165, 108, 39, 0.1)' :
                      viewing.status === 'upcoming' ? 'rgba(52, 112, 87, 0.1)' :
                      viewing.status === 'completed' ? 'var(--color-bg-sand)' : 'rgba(217, 83, 79, 0.1)',
                    color: 
                      viewing.status === 'requested' ? 'var(--color-warning-ochre)' :
                      viewing.status === 'upcoming' ? 'var(--color-success-forest)' :
                      viewing.status === 'completed' ? 'var(--color-text-slate)' : 'var(--color-error-brick)'
                  }}>
                    {viewing.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => {
                        setActiveViewing(viewing);
                        setRescheduleData({ date: viewing.date, time: viewing.timeSlot });
                        setIsRescheduling(false);
                      }} 
                      className="btn btn-secondary text-small"
                    >
                      Details
                    </button>
                    {viewing.status === 'requested' && (
                      <button onClick={() => handleConfirm(viewing.id)} className="btn btn-primary text-small">
                        Confirm
                      </button>
                    )}
                    {viewing.status === 'upcoming' && (
                      <button onClick={() => handleComplete(viewing.id)} className="btn btn-secondary text-small" style={{ color: 'var(--color-success-forest)' }}>
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredViewings.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>No {filterTab} viewings</h3>
                  <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>Appointments and customer viewing requests will populate this schedule.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Viewing Details & Reschedule Modal */}
      {activeViewing && (
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
              <h3 className="h4" style={{ margin: 0 }}>Viewing Appointment Dossier</h3>
              <button onClick={() => setActiveViewing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <span className="text-meta">Prospective Buyer / Tenant</span>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{activeViewing.customerName}</div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: '4px', fontSize: '13px', color: 'var(--color-text-slate)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {activeViewing.customerEmail}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {activeViewing.customerPhone}</span>
                </div>
              </div>

              <div>
                <span className="text-meta">Subject Property</span>
                <div style={{ fontWeight: 500 }}>{activeViewing.propertyTitle}</div>
                <Link to="/provider/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-primary-navy)', marginTop: '2px' }}>
                  Open in Property Listings <ExternalLink size={12} />
                </Link>
              </div>

              <div>
                <span className="text-meta">Scheduled Slot</span>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{activeViewing.date} • {activeViewing.timeSlot}</div>
              </div>

              {activeViewing.notes && (
                <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-ivory)', borderRadius: 'var(--radius-md)' }}>
                  <span className="text-meta" style={{ display: 'block', marginBottom: '4px' }}>Client Viewing Notes</span>
                  <p className="text-small" style={{ margin: 0 }}>"{activeViewing.notes}"</p>
                </div>
              )}

              {/* Reschedule Drawer within Modal */}
              {isRescheduling ? (
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-sand)' }}>
                  <h4 className="h5" style={{ marginBottom: 'var(--space-3)' }}>Reschedule Viewing</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <div className="input-group">
                      <label className="text-meta">New Date</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={rescheduleData.date} 
                        onChange={e => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. Oct 25, 2026" 
                      />
                    </div>
                    <div className="input-group">
                      <label className="text-meta">New Time Slot</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={rescheduleData.time} 
                        onChange={e => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="e.g. 15:00 - 15:45" 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                    <button onClick={() => setIsRescheduling(false)} className="btn btn-secondary text-small">Cancel</button>
                    <button onClick={() => handleSaveReschedule(activeViewing.id)} className="btn btn-primary text-small">Confirm New Slot</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-limestone)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <button 
                    onClick={() => {
                      setActiveViewing(null);
                      navigate('/provider/messages');
                    }} 
                    className="btn btn-secondary text-small"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageSquare size={14} /> Message Client
                  </button>

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {activeViewing.status !== 'cancelled' && (
                      <button onClick={() => setIsRescheduling(true)} className="btn btn-secondary text-small">
                        Reschedule
                      </button>
                    )}
                    {activeViewing.status === 'requested' && (
                      <button onClick={() => handleConfirm(activeViewing.id)} className="btn btn-primary text-small">
                        Confirm Appointment
                      </button>
                    )}
                    {activeViewing.status === 'upcoming' && (
                      <button onClick={() => handleComplete(activeViewing.id)} className="btn btn-primary text-small">
                        Mark Completed
                      </button>
                    )}
                    {activeViewing.status !== 'cancelled' && activeViewing.status !== 'completed' && (
                      <button onClick={() => handleCancel(activeViewing.id)} className="btn btn-secondary text-small" style={{ color: 'var(--color-error-brick)' }}>
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

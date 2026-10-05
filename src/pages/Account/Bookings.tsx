import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User, CheckCircle2, AlertCircle, XCircle, RotateCcw, CalendarPlus } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import type { ConsumerBooking } from '../../context/ConsumerContext';
import './Bookings.css';

export default function Bookings() {
  const { bookings, cancelBooking, rescheduleBooking } = useConsumerState();
  const [filterTab, setFilterTab] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<ConsumerBooking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('15:00');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending Confirmation';
    if (filterTab === 'Completed') return b.status === 'Completed';
    if (filterTab === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  const handleCancel = (id: string, title: string) => {
    if (window.confirm(`Are you certain you wish to cancel your scheduled appointment for ${title}?`)) {
      cancelBooking(id, 'Client initiated cancellation via dashboard');
      setToastMessage(`Booking for ${title} has been cancelled.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReschedule || !newDate) return;

    rescheduleBooking(selectedBookingForReschedule.id, newDate, newTime);
    setSelectedBookingForReschedule(null);
    setToastMessage(`Appointment rescheduled to ${newDate} at ${newTime}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCalendar = (booking: ConsumerBooking) => {
    // Generate simulated iCalendar event download
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Auremont Luxury Concierge//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:${booking.itemTitle} - Auremont ${booking.type}
DESCRIPTION:Accompanied by ${booking.agentName}. Notes: ${booking.notes || 'None'}
DTSTART:${booking.scheduledDate.replace(/-/g, '')}T${booking.scheduledTime.replace(/:/g, '')}00Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auremont_appointment_${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Calendar file generated for ${booking.itemTitle}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="account-panel">
      <div className="panel-header flex-between">
        <div>
          <h1 className="h3">Viewings & Reservations</h1>
          <p className="text-meta">Manage scheduled property viewings and vehicle reservations.</p>
        </div>
        <Link to="/search" className="btn btn-secondary btn-sm">
          Browse Residences
        </Link>
      </div>

      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) var(--space-6) 0' }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bookings-tabs">
        {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
          <button
            key={tab}
            className={`booking-tab-btn ${filterTab === tab ? 'active' : ''}`}
            onClick={() => setFilterTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="panel-body">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <Calendar size={40} className="empty-icon" />
            <h3 className="h4">No scheduled viewings</h3>
            <p className="text-meta">You currently have no viewings or mobility reservations in this category.</p>
          </div>
        ) : (
          <div className="bookings-cards-list">
            {filteredBookings.map(booking => {
              const isUpcoming = booking.status === 'Confirmed' || booking.status === 'Pending Confirmation';

              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-img-wrap">
                    <img src={booking.itemImage} alt={booking.itemTitle} />
                    <span className={`booking-status-tag ${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status === 'Confirmed' && <CheckCircle2 size={12} />}
                      {booking.status === 'Pending Confirmation' && <AlertCircle size={12} />}
                      {booking.status === 'Cancelled' && <XCircle size={12} />}
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-content">
                    <div className="booking-header-row">
                      <div>
                        <span className="booking-type-label">
                          {booking.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <h3 className="booking-title">{booking.itemTitle}</h3>
                        <p className="booking-subtitle">
                          <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                          {booking.itemSubtitle}
                        </p>
                      </div>

                      <div className="booking-datetime-badge">
                        <div className="datetime-date">
                          <Calendar size={14} />
                          <span>{booking.scheduledDate}</span>
                        </div>
                        <div className="datetime-time">
                          <Clock size={14} />
                          <span>{booking.scheduledTime} CET</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Tour Format</span>
                        <span className="detail-value">{booking.format}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Assigned Representative</span>
                        <span className="detail-value">
                          <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {booking.agentName}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Direct Concierge Line</span>
                        <span className="detail-value">
                          <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {booking.agentPhone}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="booking-notes-box">
                        <strong>Logistics Notes:</strong> {booking.notes}
                      </div>
                    )}

                    {isUpcoming && (
                      <div className="booking-actions">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleAddToCalendar(booking)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <CalendarPlus size={14} /> Add to Calendar (.ics)
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedBookingForReschedule(booking);
                            setNewDate(booking.scheduledDate);
                            setNewTime(booking.scheduledTime);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <RotateCcw size={14} /> Reschedule
                        </button>
                        <button 
                          className="btn-text-danger"
                          onClick={() => handleCancel(booking.id, booking.itemTitle)}
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {selectedBookingForReschedule && (
        <div className="modal-backdrop" onClick={() => setSelectedBookingForReschedule(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h4">Reschedule Appointment</h3>
              <button className="icon-btn" onClick={() => setSelectedBookingForReschedule(null)}>✕</button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="modal-form">
              <p className="text-meta">
                Select a new preferred appointment slot for <strong>{selectedBookingForReschedule.itemTitle}</strong>.
              </p>
              
              <div className="form-group">
                <label>New Date</label>
                <input 
                  type="date" 
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setNewDate(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Preferred Time Slot (CET)</label>
                <select value={newTime} onChange={e => setNewTime(e.target.value)}>
                  <option value="10:00">10:00 CET (Morning Session)</option>
                  <option value="11:30">11:30 CET</option>
                  <option value="14:00">14:00 CET (Afternoon Session)</option>
                  <option value="15:30">15:30 CET</option>
                  <option value="17:00">17:00 CET (Golden Hour Tour)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBookingForReschedule(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

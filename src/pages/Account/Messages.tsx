import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Building, ShieldCheck, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import './Messages.css';

export default function Messages() {
  const { messageThreads, sendMessage, createBooking } = useConsumerState();
  const [activeThreadId, setActiveThreadId] = useState<string>(messageThreads[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = messageThreads.find(t => t.id === activeThreadId) || messageThreads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    sendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const handleQuickViewingRequest = () => {
    if (!activeThread?.propertyId) return;

    createBooking({
      type: 'property_viewing',
      itemTitle: activeThread.propertyTitle || 'Prime Residence',
      itemSubtitle: 'Inquired Residence',
      itemImage: activeThread.propertyImage || '/images/paris_apartment.jpg',
      referenceId: activeThread.propertyId,
      scheduledDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      scheduledTime: '14:00',
      format: 'In-Person Accompanied',
      agentName: activeThread.recipientName,
      agentPhone: '+33 1 42 68 55 00',
      notes: 'Requested directly from messaging thread.',
    });

    sendMessage(activeThread.id, 'I have formally submitted a viewing request for this residence via my Auremont portal. Looking forward to your confirmation.');
    setToastMessage('Viewing scheduled. Recorded in Bookings.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="account-panel messages-panel-container">
      {/* Toast */}
      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) var(--space-6) 0' }}>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="messages-layout">
        {/* Threads Rail */}
        <aside className={`threads-rail ${activeThreadId ? 'hide-on-mobile' : ''}`}>
          <div className="threads-header">
            <h2 className="h4">Inquiries & Threads</h2>
            <span className="threads-count">{messageThreads.length} Active</span>
          </div>

          <div className="threads-list">
            {messageThreads.map(thread => (
              <button
                key={thread.id}
                className={`thread-item ${thread.id === activeThread?.id ? 'active' : ''}`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="thread-avatar-wrap">
                  {thread.propertyImage ? (
                    <img src={thread.propertyImage} alt="Property" className="thread-thumb" />
                  ) : (
                    <div className="thread-avatar-placeholder">{thread.recipientName.charAt(0)}</div>
                  )}
                  {thread.unreadCount > 0 && <span className="unread-dot"></span>}
                </div>

                <div className="thread-preview-info">
                  <div className="thread-top-row">
                    <span className="thread-recipient">{thread.recipientName}</span>
                    <span className="thread-time">{thread.updatedAt}</span>
                  </div>
                  {thread.recipientAgency && (
                    <span className="thread-agency">{thread.recipientAgency}</span>
                  )}
                  <p className="thread-last-msg">{thread.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Conversation Pane */}
        {activeThread ? (
          <section className="conversation-pane">
            {/* Conversation Header */}
            <div className="conversation-header">
              <button 
                className="back-to-threads-btn mobile-only"
                onClick={() => setActiveThreadId('')}
                aria-label="Back to threads"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="conversation-recipient-meta">
                <div className="recipient-title-wrap">
                  <h3 className="recipient-name">{activeThread.recipientName}</h3>
                  <span className="verification-badge">
                    <ShieldCheck size={14} /> Verified Partner
                  </span>
                </div>
                <p className="recipient-role">
                  <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {activeThread.recipientRole} · {activeThread.recipientAgency}
                </p>
              </div>

              {activeThread.propertyId && (
                <div className="header-action-buttons">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleQuickViewingRequest}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Calendar size={13} /> Request Viewing
                  </button>
                  <Link 
                    to={`/property/${activeThread.propertyId}`} 
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Dossier <ExternalLink size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* Linked Property Banner */}
            {activeThread.propertyTitle && (
              <div className="linked-property-banner">
                {activeThread.propertyImage && (
                  <img src={activeThread.propertyImage} alt="Property" className="banner-img" />
                )}
                <div className="banner-text">
                  <span className="banner-label">Associated Listing</span>
                  <span className="banner-title">{activeThread.propertyTitle}</span>
                </div>
              </div>
            )}

            {/* Message Stream */}
            <div className="messages-stream">
              {activeThread.messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.sender}`}>
                  <div className={`msg-bubble ${msg.sender}`}>
                    <span className="msg-sender-name">{msg.senderName}</span>
                    <p className="msg-text">{msg.text}</p>
                    <span className="msg-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSend} className="message-composer">
              <input 
                type="text" 
                placeholder={`Reply to ${activeThread.recipientName}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="composer-input"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()} 
                className="composer-send-btn"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </section>
        ) : (
          <div className="no-conversation-selected">
            <h3 className="h4">Select an inquiry thread</h3>
            <p className="text-meta">Choose a conversation to review broker messages or coordinate viewings.</p>
          </div>
        )}
      </div>
    </div>
  );
}

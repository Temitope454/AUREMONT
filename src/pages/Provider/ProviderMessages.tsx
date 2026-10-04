import { useState } from 'react';
import { useProviderState } from '../../context/ProviderContext';
import { Send, AlertCircle, RefreshCw, ExternalLink, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderMessages() {
  const { conversations, sendMessage } = useProviderState();
  const [activeConvId, setActiveConvId] = useState<number>(conversations[0]?.id || 1);
  const [inputText, setInputText] = useState('');
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'failed'>('idle');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSend = () => {
    if (!inputText.trim() || sendState === 'sending') return;

    setSendState('sending');
    const textToSend = inputText;
    setInputText('');

    setTimeout(() => {
      // 95% success simulation
      sendMessage(activeConv.id, textToSend);
      setSendState('idle');
    }, 700);
  };

  const handleSimulateFailure = () => {
    setSendState('sending');
    setTimeout(() => {
      setSendState('failed');
    }, 800);
  };

  return (
    <div className="provider-panel" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-4)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h1 className="h3">Communications & Messages</h1>
          <p className="text-meta">Simulated messaging channel between verified clients and providers.</p>
        </div>
        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', backgroundColor: 'var(--color-bg-sand)', color: 'var(--color-text-slate)', fontWeight: 600 }}>
          Demo Messaging Simulation
        </span>
      </div>
      
      <div style={{ display: 'flex', flex: 1, border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface-white)' }}>
        
        {/* Thread Sidebar */}
        <div style={{ width: '320px', borderRight: '1px solid var(--color-border-limestone)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-ivory)', flexShrink: 0 }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border-limestone)', fontWeight: 600, fontSize: '13px', color: 'var(--color-text-slate)' }}>
            Active Discussions ({conversations.length})
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => {
                  setActiveConvId(conv.id);
                  setSendState('idle');
                }}
                style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: '1px solid var(--color-border-limestone)', 
                  cursor: 'pointer', 
                  backgroundColor: activeConv?.id === conv.id ? 'var(--color-surface-white)' : 'transparent',
                  borderLeft: activeConv?.id === conv.id ? '3px solid var(--color-primary-navy)' : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px', fontWeight: conv.unread ? 700 : 500 }}>{conv.customer}</strong>
                  <span className="text-meta" style={{ fontSize: '11px', color: 'var(--color-text-ash)' }}>{conv.time}</span>
                </div>
                <div className="text-meta" style={{ color: 'var(--color-primary-navy)', fontSize: '12px', marginBottom: '4px' }}>
                  {conv.property}
                </div>
                <div className="text-small" style={{ color: 'var(--color-text-slate)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: conv.unread ? 600 : 400 }}>
                  {conv.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Active Conversation Thread */}
        {activeConv ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-white)' }}>
            
            {/* Thread Header */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border-limestone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-white)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--color-primary-navy)" />
                  <strong style={{ fontSize: '15px' }}>{activeConv.customer}</strong>
                  <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '8px', backgroundColor: 'rgba(52, 112, 87, 0.1)', color: 'var(--color-success-forest)', fontWeight: 600 }}>
                    Verified Inquirer
                  </span>
                </div>
                <div className="text-meta" style={{ fontSize: '12px', marginTop: '2px' }}>
                  Regarding: <strong>{activeConv.property}</strong>
                </div>
              </div>
              <Link to="/provider/properties" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-primary-navy)', textDecoration: 'none' }}>
                Listing <ExternalLink size={12} />
              </Link>
            </div>

            {/* Message Bubble Feed */}
            <div style={{ flex: 1, padding: 'var(--space-6)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: 'var(--color-bg-sand)' }}>
              {activeConv.messages.map((msg) => {
                const isProvider = msg.sender === 'provider';
                return (
                  <div 
                    key={msg.id} 
                    style={{ 
                      alignSelf: isProvider ? 'flex-end' : 'flex-start',
                      maxWidth: '70%'
                    }}
                  >
                    <div style={{ 
                      padding: 'var(--space-3) var(--space-4)', 
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isProvider ? 'var(--color-primary-navy)' : 'var(--color-surface-white)',
                      color: isProvider ? '#ffffff' : 'var(--color-text-dark)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--color-text-ash)', 
                      marginTop: '3px',
                      textAlign: isProvider ? 'right' : 'left'
                    }}>
                      {isProvider ? 'You' : activeConv.customer} • {msg.timestamp}
                    </div>
                  </div>
                );
              })}

              {sendState === 'sending' && (
                <div style={{ alignSelf: 'flex-end', fontSize: '12px', color: 'var(--color-text-ash)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={12} className="spin" /> Sending message...
                </div>
              )}

              {sendState === 'failed' && (
                <div style={{ alignSelf: 'flex-end', padding: '6px 12px', backgroundColor: 'rgba(217, 83, 79, 0.1)', border: '1px solid var(--color-error-brick)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--color-error-brick)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={14} /> Send failed (simulation)
                  <button onClick={handleSend} style={{ background: 'none', border: 'none', color: 'var(--color-primary-navy)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
                </div>
              )}
            </div>

            {/* Message Composer */}
            <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border-limestone)', backgroundColor: 'var(--color-surface-white)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder={`Write a message to ${activeConv.customer}...`}
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={handleSend} 
                  disabled={!inputText.trim() || sendState === 'sending'} 
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={16} /> Send
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span className="text-meta" style={{ fontSize: '11px', color: 'var(--color-text-ash)' }}>
                  Auremont Simulated Messaging System
                </span>
                <button 
                  onClick={handleSimulateFailure} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-ash)', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  [Simulate Network Error]
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', margin: 'auto' }}>
            <h3 className="h4" style={{ marginBottom: 'var(--space-4)' }}>Select a conversation</h3>
            <p className="text-meta" style={{ color: 'var(--color-text-slate)' }}>Choose a thread from the list to view your communications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

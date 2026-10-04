import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, X, Send, Mic, RefreshCw, Calendar, 
  ExternalLink, CheckCircle2, Shield,
  ArrowRight
} from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import type { Property } from '../data/mockProperties';
import { mockCars } from '../data/mockCars';
import type { Vehicle } from '../data/mockCars';
import { useConsumerState } from '../context/ConsumerContext';
import { useI18n } from '../context/I18nContext';
import './ConciergeDrawer.css';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  timestamp: string;
  matchedProperties?: Property[];
  matchedCars?: Vehicle[];
  actionPrompt?: string;
}

export default function ConciergeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { createBooking, toggleFavorite, isFavorite, createInquiryThread } = useConsumerState();
  const { t, language } = useI18n();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('auremont_concierge_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse concierge history', e);
      }
    }
    return [
      {
        id: 'msg-init',
        sender: 'concierge',
        text: t.concierge.welcomeMsg,
        timestamp: 'Just now',
        matchedProperties: [mockProperties[0], mockProperties[1]],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('auremont_concierge_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Concierge Natural Language Parsing & Match Engine
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matchedProps: Property[] = [];
      let matchedVehicles: Vehicle[] = [];
      let replyText = '';

      // City matching
      if (lower.includes('paris')) {
        matchedProps = mockProperties.filter(p => p.city.toLowerCase() === 'paris');
        matchedVehicles = mockCars.filter(c => c.location.toLowerCase().includes('paris'));
      } else if (lower.includes('london') || lower.includes('mayfair')) {
        matchedProps = mockProperties.filter(p => p.city.toLowerCase() === 'london' || p.neighborhood.toLowerCase().includes('mayfair'));
      } else if (lower.includes('madrid')) {
        matchedProps = mockProperties.filter(p => p.city.toLowerCase() === 'madrid');
      } else if (lower.includes('milan') || lower.includes('milano')) {
        matchedProps = mockProperties.filter(p => p.city.toLowerCase() === 'milan');
      } else if (lower.includes('dubai')) {
        matchedProps = mockProperties.filter(p => p.city.toLowerCase() === 'dubai');
      }

      // Property type matching
      if (lower.includes('penthouse') || lower.includes('apartment')) {
        if (matchedProps.length === 0) {
          matchedProps = mockProperties.filter(p => p.propertyType === 'Apartment');
        }
      } else if (lower.includes('villa') || lower.includes('house')) {
        if (matchedProps.length === 0) {
          matchedProps = mockProperties.filter(p => p.propertyType === 'Villa' || p.propertyType === 'House');
        }
      }

      // Car or Mobility matching
      if (lower.includes('car') || lower.includes('mobility') || lower.includes('vehicle') || lower.includes('suv') || lower.includes('fleet')) {
        matchedVehicles = mockCars.slice(0, 2);
      }

      // If no specific city found, provide curated highlights
      if (matchedProps.length === 0 && matchedVehicles.length === 0) {
        matchedProps = mockProperties.slice(0, 2);
        matchedVehicles = [mockCars[0]];
      }

      // Generate localized response
      if (language === 'fr') {
        if (matchedProps.length > 0 && matchedVehicles.length > 0) {
          replyText = `J’ai sélectionné ces résidences d’exception ainsi qu’un véhicule de notre flotte privée correspondant à vos critères d’exclusivité. Souhaitez-vous que j’organise une visite privée accompagnée ?`;
        } else if (matchedProps.length > 0) {
          replyText = `Voici les opportunités résidentielles les plus prestigieuses actuellement disponibles dans notre catalogue vérifié. Tous les titres de propriété et diagnostics ont été audités par notre direction juridique.`;
        } else {
          replyText = `Voici notre sélection de véhicules de prestige prêts pour une mise à disposition immédiate avec service chauffeur ou accueil aéroportuaire.`;
        }
      } else if (language === 'es') {
        if (matchedProps.length > 0 && matchedVehicles.length > 0) {
          replyText = `He seleccionado estas residencias singulares junto con un vehículo de nuestra flota privada. ¿Desea que coordine una visita privada o una prueba de conducción personalizada?`;
        } else if (matchedProps.length > 0) {
          replyText = `He localizado estas propiedades exclusivas que coinciden con su estándar de inversión. Todos los expedientes cuentan con certificación notarial completa.`;
        } else {
          replyText = `A continuación le presento opciones destacadas de nuestra flota privada de movilidad de alto standing.`;
        }
      } else {
        if (matchedProps.length > 0 && matchedVehicles.length > 0) {
          replyText = `I have curated these prime residences along with an ultra-luxury vehicle pairing. Would you like me to schedule a private accompanied viewing or arrange VIP airport delivery?`;
        } else if (matchedProps.length > 0) {
          replyText = `Here are the premier residences that match your architectural preferences and investment profile. Each asset is fully verified with verified title deeds and direct broker representation.`;
        } else {
          replyText = `Here is our private fleet allocation available for seamless delivery to your residence or private aviation terminal.`;
        }
      }

      const conciergeMsg: ChatMessage = {
        id: `cnc-${Date.now()}`,
        sender: 'concierge',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedProperties: matchedProps.slice(0, 2),
        matchedCars: matchedVehicles.slice(0, 1),
      };

      setMessages(prev => [...prev, conciergeMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  const handleBookViewing = (property: Property) => {
    createBooking({
      type: 'property_viewing',
      itemTitle: property.title,
      itemSubtitle: `${property.neighborhood}, ${property.city}`,
      itemImage: property.mainImage,
      referenceId: property.id,
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      scheduledTime: '15:00',
      format: 'In-Person Accompanied',
      agentName: property.provider.name,
      agentPhone: '+33 1 42 68 55 00',
      notes: 'Arranged via Auremont Concierge.',
    });

    setActionSuccess(`Viewing request submitted for ${property.title}. Dossier updated in Bookings.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleReserveCar = (car: Vehicle) => {
    createBooking({
      type: 'mobility_reservation',
      itemTitle: `${car.make} ${car.model}`,
      itemSubtitle: `${car.location} · ${car.powertrain}`,
      itemImage: car.mainImage,
      referenceId: car.id,
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      scheduledTime: '10:00',
      format: 'Chauffeur Delivery',
      agentName: car.provider.name,
      agentPhone: '+33 1 70 80 90 00',
      notes: 'Reserved via Auremont Concierge.',
    });

    setActionSuccess(`Reservation requested for ${car.make} ${car.model}. Logistics notified.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleConnectBroker = (property: Property) => {
    createInquiryThread({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.mainImage,
      agentName: property.provider.name,
      agentAgency: property.provider.agency,
      message: `Hello ${property.provider.name}, I am inquiring about this property via Auremont Concierge and would like to review further architectural and availability details.`,
    });

    setActionSuccess(`Inquiry channel opened with ${property.provider.name}. Available in Messages.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend("Find me a luxury penthouse in Paris with panoramic views under 5 million euros");
    }, 2500);
  };

  const handleClear = () => {
    const initial: ChatMessage[] = [
      {
        id: `msg-fresh-${Date.now()}`,
        sender: 'concierge',
        text: t.concierge.welcomeMsg,
        timestamp: 'Just now',
        matchedProperties: [mockProperties[0], mockProperties[1]],
      },
    ];
    setMessages(initial);
    localStorage.removeItem('auremont_concierge_history');
  };

  const quickPrompts = [
    { label: 'Paris Penthouses < €5M', query: 'Find me luxury penthouses in Paris under 5 million euros' },
    { label: 'Mayfair Townhouses', query: 'Show me Prime Central London residences in Mayfair' },
    { label: 'Pair Villa + SUV', query: 'I need a luxury villa paired with an electric SUV' },
    { label: 'Dubai Waterfront', query: 'Show me waterfront properties in Dubai' },
  ];

  return (
    <>
      {/* Floating Concierge Trigger Pill */}
      <button 
        className={`concierge-floating-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Auremont Concierge"
        id="concierge-trigger-btn"
      >
        <div className="concierge-trigger-icon-wrap">
          <Sparkles size={20} className="concierge-sparkle-icon" />
          <span className="concierge-status-dot"></span>
        </div>
        <div className="concierge-trigger-text">
          <span className="concierge-brand-title">Ask Auremont</span>
          <span className="concierge-brand-sub">Auremont Concierge</span>
        </div>
      </button>

      {/* Slide-out Concierge Drawer */}
      <div className={`concierge-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
        <aside 
          className={`concierge-drawer ${isOpen ? 'open' : ''}`}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label="Auremont Concierge Interface"
        >
          {/* Header */}
          <div className="concierge-header">
            <div className="concierge-header-info">
              <div className="concierge-crest">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="concierge-heading">{t.concierge.title}</h3>
                <p className="concierge-subheading">
                  <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {t.concierge.subtitle}
                </p>
              </div>
            </div>
            
            <div className="concierge-header-actions">
              <button 
                onClick={handleClear} 
                className="concierge-icon-action" 
                title={t.concierge.clearChat}
                aria-label={t.concierge.clearChat}
              >
                <RefreshCw size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="concierge-icon-action"
                title="Close Concierge"
                aria-label="Close Concierge"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {actionSuccess && (
            <div className="concierge-toast">
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Chat Body */}
          <div className="concierge-body">
            {messages.map(msg => (
              <div key={msg.id} className={`concierge-msg-row ${msg.sender}`}>
                {msg.sender === 'concierge' && (
                  <div className="concierge-avatar">
                    <span>A</span>
                  </div>
                )}
                
                <div className="concierge-bubble-wrapper">
                  <div className={`concierge-bubble ${msg.sender}`}>
                    <p className="concierge-bubble-text">{msg.text}</p>
                    <span className="concierge-bubble-time">{msg.timestamp}</span>
                  </div>

                  {/* Inline Matched Properties */}
                  {msg.matchedProperties && msg.matchedProperties.length > 0 && (
                    <div className="concierge-cards-grid">
                      {msg.matchedProperties.map(prop => (
                        <div key={prop.id} className="concierge-mini-card">
                          <div className="mini-card-img-wrap">
                            <img src={prop.mainImage} alt={prop.title} />
                            <span className="mini-card-badge">{prop.city}</span>
                            <button 
                              className={`mini-fav-btn ${isFavorite(prop.id) ? 'favorited' : ''}`}
                              onClick={() => toggleFavorite(prop.id)}
                              aria-label="Save to favorites"
                            >
                              ★
                            </button>
                          </div>
                          <div className="mini-card-info">
                            <span className="mini-card-price">
                              {prop.currency}{prop.price.toLocaleString()}
                            </span>
                            <h4 className="mini-card-title">{prop.title}</h4>
                            <p className="mini-card-meta">
                              {prop.beds} Beds · {prop.baths} Baths · {prop.size} {prop.sizeUnit}
                            </p>
                            
                            <div className="mini-card-actions">
                              <Link 
                                to={`/property/${prop.id}`} 
                                className="mini-btn-secondary"
                                onClick={() => setIsOpen(false)}
                              >
                                {t.concierge.viewDossier} <ExternalLink size={12} />
                              </Link>
                              <button 
                                className="mini-btn-primary"
                                onClick={() => handleBookViewing(prop)}
                              >
                                <Calendar size={12} /> {t.concierge.scheduleViewing}
                              </button>
                              <button 
                                className="mini-btn-link"
                                onClick={() => handleConnectBroker(prop)}
                              >
                                {t.concierge.speakAdvisor} <ArrowRight size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Matched Luxury Vehicles */}
                  {msg.matchedCars && msg.matchedCars.length > 0 && (
                    <div className="concierge-cards-grid">
                      {msg.matchedCars.map(car => (
                        <div key={car.id} className="concierge-mini-card mobility-card">
                          <div className="mini-card-img-wrap">
                            <img src={car.mainImage} alt={`${car.make} ${car.model}`} />
                            <span className="mini-card-badge">{car.powertrain}</span>
                          </div>
                          <div className="mini-card-info">
                            <span className="mini-card-price">
                              {car.currency}{car.price.toLocaleString()} <small>{car.pricingCadence}</small>
                            </span>
                            <h4 className="mini-card-title">{car.make} {car.model}</h4>
                            <p className="mini-card-meta">
                              {car.category} · {car.seats} Seats · {car.transmission}
                            </p>
                            
                            <div className="mini-card-actions">
                              <Link 
                                to={`/cars/${car.slug}`} 
                                className="mini-btn-secondary"
                                onClick={() => setIsOpen(false)}
                              >
                                {t.concierge.viewDossier} <ExternalLink size={12} />
                              </Link>
                              <button 
                                className="mini-btn-primary"
                                onClick={() => handleReserveCar(car)}
                              >
                                <Calendar size={12} /> {t.concierge.bookVehicle}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="concierge-msg-row concierge">
                <div className="concierge-avatar"><span>A</span></div>
                <div className="concierge-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="concierge-quick-prompts">
            <span className="quick-prompts-label">{t.concierge.suggestedTitle}:</span>
            <div className="quick-prompts-scroll">
              {quickPrompts.map((qp, idx) => (
                <button 
                  key={idx} 
                  className="quick-prompt-chip"
                  onClick={() => handleQuickPrompt(qp.query)}
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vocal Listening Animation Banner */}
          {isListening && (
            <div className="concierge-voice-banner">
              <div className="voice-waves">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <span className="voice-text">{t.concierge.listening}</span>
            </div>
          )}

          {/* Composer Footer */}
          <div className="concierge-footer">
            <form 
              className="concierge-composer" 
              onSubmit={e => { e.preventDefault(); handleSend(); }}
            >
              <button 
                type="button" 
                className={`concierge-mic-btn ${isListening ? 'active' : ''}`}
                onClick={handleSimulateVoice}
                title="Voice inquiry simulation"
                aria-label="Simulate voice inquiry"
              >
                <Mic size={18} />
              </button>
              
              <input
                ref={inputRef}
                type="text"
                className="concierge-input"
                placeholder={t.concierge.placeholder}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              
              <button 
                type="submit" 
                className="concierge-send-btn" 
                disabled={!input.trim()}
                aria-label={t.concierge.send}
              >
                <Send size={16} />
              </button>
            </form>
            
            <p className="concierge-disclaimer">
              {t.concierge.disclaimer}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

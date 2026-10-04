import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, ShieldCheck, Mail, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import './About.css';

export default function About() {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('general');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittedToast, setSubmittedToast] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) return;

    setSubmittedToast(true);
    setInquiryName('');
    setInquiryEmail('');
    setInquiryMessage('');
    setTimeout(() => setSubmittedToast(false), 5000);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="section-kicker">About Auremont</span>
            <h1 className="h1 about-title">Architectural Real Estate & Mobility, Clearly Presented.</h1>
            <p className="large about-lead">
              Auremont is an international property and mobility platform built around architectural clarity, measured documentation, and direct connections between prospective clients, licensed agencies, and private landlords.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="about-section">
        <div className="container">
          <div className="section-grid-header">
            <h2 className="h2">Platform Principles</h2>
            <p className="text-meta">How Auremont structures its public catalog and client interactions.</p>
          </div>

          <div className="principles-grid">
            <div className="principle-card">
              <div className="principle-icon-wrap">
                <Compass size={24} />
              </div>
              <h3 className="h4">Measured Architectural Data</h3>
              <p>
                Every listing prioritizes floorplans, exact floor areas, natural light exposure, and structural materials. We focus on architectural substance rather than generic marketing superlatives.
              </p>
            </div>

            <div className="principle-card">
              <div className="principle-icon-wrap">
                <Building2 size={24} />
              </div>
              <h3 className="h4">Clear Transaction Boundaries</h3>
              <p>
                Auremont provides dedicated workflows for acquisitions (Buy), medium-to-long term tenancies (Rent), and commercial ateliers (Lease), each with appropriate financial terms and scheduling models.
              </p>
            </div>

            <div className="principle-card">
              <div className="principle-icon-wrap">
                <ShieldCheck size={24} />
              </div>
              <h3 className="h4">Provider Accountability</h3>
              <p>
                Properties are submitted directly by licensed real estate agencies or verified property owners. Inbound inquiries connect directly to the responsible listing representative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scope & Metropolitan Coverage */}
      <section className="about-section alt-bg" id="coverage">
        <div className="container">
          <div className="scope-layout">
            <div className="scope-text">
              <h2 className="h2">Eight Focused Metropolises</h2>
              <p>
                Rather than sprawling across thousands of unverified locations, Auremont focuses its catalog across eight recognized international centers:
              </p>
              <ul className="hubs-list">
                <li><strong>Paris</strong> — Classic Haussmannian residences & courtyard ateliers</li>
                <li><strong>London</strong> — Historic mews houses, canal conversions & Mayfair suites</li>
                <li><strong>Madrid</strong> — Stone heritage flats & boulevard corporate studios</li>
                <li><strong>Lisbon</strong> — Waterfront residences & restored Pombaline architecture</li>
                <li><strong>Milan</strong> — Artisan lofts in Brera & high-rises in Porta Nuova</li>
                <li><strong>Dubai</strong> — Contemporary marina residences & shoreline villas</li>
                <li><strong>New York</strong> — Cast-iron lofts in Tribeca/SoHo & Village townhouses</li>
                <li><strong>Singapore</strong> — Tropical modern residences & Marina Bay suites</li>
              </ul>
              <Link to="/explore" className="btn btn-secondary" style={{ marginTop: 'var(--space-4)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Explore All Eight Hubs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="scope-card">
              <h3 className="h4">Integrated Mobility</h3>
              <p>
                In addition to residential discovery, Auremont integrates private mobility bookings. Clients can coordinate executive sedans, grand tourers, and luxury SUVs for accompanied site visits or independent transport in major European and Gulf hubs.
              </p>
              <Link to="/cars" className="btn btn-primary" style={{ marginTop: 'var(--space-3)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Browse Fleet <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="about-section" id="trust">
        <div className="container">
          <div className="section-grid-header">
            <h2 className="h2">Trust, Verifications & Security</h2>
            <p className="text-meta">Our guidelines for listings, accounts, and client communications.</p>
          </div>

          <div className="trust-details-grid">
            <div className="trust-detail-item">
              <h3 className="h4">Listing Accuracy Standards</h3>
              <p>
                All listings published on Auremont must reflect verified property dimensions, truthful photographic representations without deceptive wide-angle manipulation, and current availability status.
              </p>
            </div>

            <div className="trust-detail-item">
              <h3 className="h4">Direct Broker Representation</h3>
              <p>
                When inquiring about a property or vehicle, you communicate directly with the individual or agency named on the listing dossier. We do not sell prospective client information to third-party telemarketing networks.
              </p>
            </div>

            <div className="trust-detail-item">
              <h3 className="h4">Provider Oversight</h3>
              <p>
                Listing providers verify their professional identity, agency affiliation, and authority to market each asset. Inquiries and viewing requests are tracked within the provider workspace.
              </p>
            </div>

            <div className="trust-detail-item">
              <h3 className="h4">Client Privacy & Data</h3>
              <p>
                Client inquiries, viewing schedules, and saved searches are kept confidential within user account consoles. Clients can update communication preferences or request personal data exports at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-section alt-bg" id="contact">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info-col">
              <h2 className="h2">Contact & Inquiries</h2>
              <p className="large" style={{ color: 'var(--color-text-slate)' }}>
                Have questions regarding residential listings, provider onboarding, or mobility bookings? Get in touch with our team.
              </p>

              <div className="contact-channel-list">
                <div className="contact-channel">
                  <Mail size={18} className="channel-icon" />
                  <div>
                    <span className="channel-label">General & Inquiries</span>
                    <a href="mailto:inquiries@auremont.com" className="channel-link">inquiries@auremont.com</a>
                  </div>
                </div>

                <div className="contact-channel">
                  <MapPin size={18} className="channel-icon" />
                  <div>
                    <span className="channel-label">Platform Directorate</span>
                    <span className="channel-text">Auremont Marketplace Operations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-col">
              {submittedToast && (
                <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>
                  <CheckCircle2 size={16} />
                  <span>Thank you. Your message has been received by our platform team.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="contact-form-card">
                <h3 className="h4" style={{ marginBottom: 'var(--space-2)' }}>Send a Direct Inquiry</h3>
                <p className="text-meta" style={{ marginBottom: 'var(--space-4)' }}>We respond to all platform messages within one business day.</p>

                <div className="form-group">
                  <label htmlFor="contact-name">Your Full Name</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    required 
                    value={inquiryName} 
                    onChange={e => setInquiryName(e.target.value)}
                    placeholder="e.g. Jean-Luc Vane" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    required 
                    value={inquiryEmail} 
                    onChange={e => setInquiryEmail(e.target.value)}
                    placeholder="you@domain.com" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-topic">Inquiry Nature</label>
                  <select 
                    id="contact-topic"
                    value={inquiryTopic} 
                    onChange={e => setInquiryTopic(e.target.value)}
                  >
                    <option value="general">General Marketplace Inquiry</option>
                    <option value="acquisition">Property Acquisition / Sale</option>
                    <option value="tenancy">Rental / Tenancy Inquiry</option>
                    <option value="provider">Provider / Listing Onboarding</option>
                    <option value="mobility">Mobility Fleet Reservation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea 
                    id="contact-message"
                    rows={4} 
                    required 
                    value={inquiryMessage} 
                    onChange={e => setInquiryMessage(e.target.value)}
                    placeholder="Please specify your query or requirements..."
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 'var(--space-2)' }}>
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import './About.css';

export default function Privacy() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="section-kicker">Data Protection & Privacy</span>
            <h1 className="h1 about-title">Privacy Policy</h1>
            <p className="large about-lead">
              Our principles and practices governing the collection, handling, and confidential transmission of client and partner data.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h2 className="h4">1. Collection of Client Information</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Auremont collects information provided directly by clients during account registration, inquiry submissions, and viewing requests. This includes contact details, verified communication preferences, and explicit search parameters required to facilitate transactions.
              </p>
            </div>

            <div>
              <h2 className="h4">2. Utilization of Inquiries and Listing Data</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Listing inquiries are transmitted strictly to the verified listing agent, broker, or fleet operator responsible for the requested asset. We do not sell, rent, or trade private client inquiry records to third-party advertising networks.
              </p>
            </div>

            <div>
              <h2 className="h4">3. Data Retention and Storage</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Account records and communication histories are stored in accordance with applicable European and international data protection standards (including GDPR). Clients maintain the right to inspect, update, or request the deletion of their personal records at any time.
              </p>
            </div>

            <div>
              <h2 className="h4">4. Cookies and Local Session Persistence</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                We utilize essential browser storage and cookies exclusively to maintain authentication sessions, currency preferences, saved bookmarks, and active language selections (English, Français, Español).
              </p>
            </div>

            <div>
              <h2 className="h4">5. Inquiries & Data Rights Requests</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                For data protection inquiries, access requests, or regulatory questions, please contact our data governance team via the platform contact channel.
              </p>
            </div>

            <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-limestone)' }}>
              <Link to="/about#contact" className="btn btn-secondary">Contact Data Protection Officer</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

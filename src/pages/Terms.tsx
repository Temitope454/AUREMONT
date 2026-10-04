import { Link } from 'react-router-dom';
import './About.css';

export default function Terms() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="section-kicker">Legal & Governance</span>
            <h1 className="h1 about-title">Terms of Service</h1>
            <p className="large about-lead">
              General conditions governing access to and use of the Auremont international marketplace platform.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <h2 className="h4">1. Scope of the Platform</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Auremont operates an architectural residential discovery and luxury automotive mobility platform connecting prospective clients, licensed real estate agencies, and verified property owners across specified international metropolitan hubs. Auremont does not act as an escrow agent or title insurer.
              </p>
            </div>

            <div>
              <h2 className="h4">2. Property Inquiries & Viewings</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Inquiries submitted through the platform are directed to the designated listing agent or property owner. Scheduling an accompanied viewing or virtual walkthrough represents a mutual arrangement between the client and provider, subject to confirmation of availability.
              </p>
            </div>

            <div>
              <h2 className="h4">3. Provider Responsibilities</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Providers publishing residential, commercial, or automotive listings warrant that they hold valid marketing rights, accurate property dimensions, and compliance documentation under the legal regulations of the applicable jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="h4">4. Platform Modifications</h2>
              <p style={{ color: 'var(--color-text-slate)', lineHeight: 1.6 }}>
                Auremont reserves the right to withdraw unverified listings, adjust feature availability, and revise terms to maintain platform integrity and regulatory compliance.
              </p>
            </div>

            <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-limestone)' }}>
              <Link to="/about#contact" className="btn btn-secondary">Contact Platform Legal</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

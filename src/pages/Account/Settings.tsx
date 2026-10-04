import { useState } from 'react';
import { Shield, Key, Smartphone, Globe, Lock, Download, Check } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import { useI18n } from '../../context/I18nContext';
import type { Language } from '../../context/I18nContext';
import './Settings.css';

export default function Settings() {
  const { security, updateSecurity, profile } = useConsumerState();
  const { language, setLanguage } = useI18n();

  const [currency, setCurrency] = useState('EUR');
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle2FA = () => {
    if (security.twoFactorEnabled) {
      if (window.confirm('Are you certain you wish to disable institutional Two-Factor Authentication?')) {
        updateSecurity({ twoFactorEnabled: false });
        setToastMessage('Two-Factor Authentication disabled.');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } else {
      setIs2FAModalOpen(true);
    }
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit verification code.');
      return;
    }

    updateSecurity({ twoFactorEnabled: true });
    setIs2FAModalOpen(false);
    setVerificationCode('');
    setToastMessage('Two-Factor Authentication activated successfully.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters with numbers and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setToastMessage('Credentials updated. Active session tokens refreshed.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportData = () => {
    const exportData = {
      client: profile,
      securitySettings: security,
      exportTimestamp: new Date().toISOString(),
      complianceAuthority: 'Auremont Private Directorate — Geneva HQ',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auremont_client_dossier_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('GDPR Dossier export downloaded.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3">Security, Access & International Preferences</h1>
        <p className="text-meta">Configure multi-factor authentication, active cryptographic sessions, and regional currency settings.</p>
      </div>

      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) var(--space-6) 0' }}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="panel-body settings-body-sections">
        {/* Regional & Currency Preferences */}
        <div className="settings-section">
          <div className="section-header-wrap">
            <Globe size={20} className="section-icon" />
            <div>
              <h2 className="h4">Regional & Language Preferences</h2>
              <p className="text-meta">Adjust global currency display and interface language tokens.</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Interface Language</label>
              <select 
                value={language}
                onChange={e => {
                  setLanguage(e.target.value as Language);
                  setToastMessage(`Language switched to ${e.target.value.toUpperCase()}.`);
                  setTimeout(() => setToastMessage(null), 2500);
                }}
              >
                <option value="en">English (International)</option>
                <option value="fr">Français (France / Suisse / Monaco)</option>
                <option value="es">Español (España / América Latina)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Default Currency Display</label>
              <select 
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="EUR">EUR (€) — Eurozone Baseline</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="AED">AED (د.إ) — UAE Dirham</option>
                <option value="SGD">SGD (S$) — Singapore Dollar</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-divider"></div>

        {/* Two-Factor Authentication */}
        <div className="settings-section">
          <div className="section-header-wrap">
            <Shield size={20} className="section-icon" />
            <div>
              <h2 className="h4">Two-Factor Authentication (2FA)</h2>
              <p className="text-meta">Require biometric or cryptographic hardware token clearance on every session initialization.</p>
            </div>
          </div>

          <div className="two-factor-control-card">
            <div className="two-factor-info">
              <div className="two-factor-status-row">
                <span className="two-factor-label">Current Protection:</span>
                <span className={`status-pill ${security.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                  {security.twoFactorEnabled ? 'Institutional 2FA Active' : 'Unprotected'}
                </span>
              </div>
              <p className="two-factor-desc">
                {security.twoFactorEnabled 
                  ? 'Your account is secured via Time-based One-Time Password (TOTP) clearance.'
                  : 'We strongly advise activating 2FA to protect high-value acquisition dossiers.'}
              </p>
            </div>

            <button 
              className={`btn ${security.twoFactorEnabled ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleToggle2FA}
            >
              {security.twoFactorEnabled ? 'Disable 2FA' : 'Activate 2FA'}
            </button>
          </div>
        </div>

        <div className="settings-divider"></div>

        {/* Change Password Form */}
        <div className="settings-section">
          <div className="section-header-wrap">
            <Lock size={20} className="section-icon" />
            <div>
              <h2 className="h4">Update Password</h2>
              <p className="text-meta">Ensure your private credentials meet institutional cryptographic complexity standards.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required 
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required 
                />
              </div>
            </div>

            <div className="password-actions">
              <button type="submit" className="btn btn-secondary">
                Update Password
              </button>
            </div>
          </form>
        </div>

        <div className="settings-divider"></div>

        {/* Active Sessions */}
        <div className="settings-section">
          <div className="section-header-wrap">
            <Smartphone size={20} className="section-icon" />
            <div>
              <h2 className="h4">Active Cryptographic Sessions</h2>
              <p className="text-meta">Audit authorized devices and revoke stale session tokens.</p>
            </div>
          </div>

          <div className="sessions-list">
            <div className="session-item current">
              <div className="session-meta">
                <span className="session-device">MacBook Pro 16″ (macOS Sonoma) — Current Session</span>
                <span className="session-location">Geneva, Switzerland · IP 194.230.145.xx · Chrome 130</span>
              </div>
              <span className="session-current-tag">This Device</span>
            </div>

            <div className="session-item">
              <div className="session-meta">
                <span className="session-device">iPhone 16 Pro (iOS 18)</span>
                <span className="session-location">Paris, France · IP 82.64.120.xx · Mobile Safari</span>
              </div>
              <button 
                className="btn-revoke"
                onClick={() => {
                  setToastMessage('Session revoked.');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>

        <div className="settings-divider"></div>

        {/* Data & Compliance */}
        <div className="settings-section">
          <div className="section-header-wrap">
            <Download size={20} className="section-icon" />
            <div>
              <h2 className="h4">GDPR Dossier & Privacy Compliance</h2>
              <p className="text-meta">Download an encrypted export of your personal information, viewing records, and saved searches.</p>
            </div>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={handleExportData}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Export Personal Data (JSON)
          </button>
        </div>
      </div>

      {/* 2FA Modal */}
      {is2FAModalOpen && (
        <div className="modal-backdrop" onClick={() => setIs2FAModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} /> Configure Two-Factor Authentication
              </h3>
              <button className="icon-btn" onClick={() => setIs2FAModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleConfirm2FA} className="modal-form">
              <p className="text-meta">
                Scan this QR code with an institutional authenticator application (Google Authenticator, 1Password, or YubiKey Authenticator).
              </p>

              {/* QR Simulator */}
              <div className="qr-simulator-wrap">
                <div className="qr-mock-box">
                  <div className="qr-cell top-left"></div>
                  <div className="qr-cell top-right"></div>
                  <div className="qr-cell bottom-left"></div>
                  <div className="qr-inner-pattern"></div>
                </div>
                <div className="qr-manual-key">
                  <span className="key-label">Manual Setup Key:</span>
                  <code className="key-code">AURM-9948-2831-SEC-KYC</code>
                </div>
              </div>

              <div className="form-group">
                <label>Enter 6-Digit Code from Authenticator</label>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000 000"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="code-input"
                  required 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIs2FAModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={verificationCode.length !== 6}>
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

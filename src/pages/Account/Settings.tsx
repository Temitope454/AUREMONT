import { useState } from 'react';
import { Globe, Lock, Shield, Smartphone, Download, Check } from 'lucide-react';
import { useConsumerState } from '../../context/ConsumerContext';
import { useI18n } from '../../context/I18nContext';
import type { Language } from '../../context/I18nContext';
import './Settings.css';

export default function Settings() {
  const { security, updateSecurity, profile } = useConsumerState();
  const { language, setLanguage } = useI18n();

  const [currency, setCurrency] = useState('EUR');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle2FA = () => {
    const nextState = !security.twoFactorEnabled;
    updateSecurity({ twoFactorEnabled: nextState });
    setToastMessage(nextState ? 'Demo two-step verification enabled.' : 'Two-step verification disabled.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setToastMessage('Password updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    const exportData = {
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        nationality: profile.nationality,
        preferredCity: profile.preferredCity,
      },
      preferences: {
        language,
        currency,
        twoFactorDemo: security.twoFactorEnabled,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auremont_account_data_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Account data export downloaded.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="account-panel">
      <div className="panel-header">
        <h1 className="h3">Account Settings</h1>
        <p className="text-meta">Manage your interface preferences, password, and account security.</p>
      </div>

      {toastMessage && (
        <div className="alert alert-success" style={{ margin: 'var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="panel-body settings-body-sections">
        {/* Regional & Currency Preferences */}
        <section className="settings-section">
          <div className="section-header-wrap">
            <Globe size={18} className="section-icon" />
            <div>
              <h2 className="h4">Preferences</h2>
              <p className="text-meta">Configure your display language and preferred currency.</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="settings-language">Interface Language</label>
              <select 
                id="settings-language"
                value={language}
                onChange={e => {
                  setLanguage(e.target.value as Language);
                  setToastMessage(`Language updated to ${e.target.value.toUpperCase()}.`);
                  setTimeout(() => setToastMessage(null), 2500);
                }}
              >
                <option value="en">English (International)</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="settings-currency">Default Currency</label>
              <select 
                id="settings-currency"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="SGD">SGD (S$) — Singapore Dollar</option>
              </select>
            </div>
          </div>
        </section>

        <div className="settings-divider"></div>

        {/* Password Form */}
        <section className="settings-section">
          <div className="section-header-wrap">
            <Lock size={18} className="section-icon" />
            <div>
              <h2 className="h4">Password</h2>
              <p className="text-meta">Update the password used to access your Auremont account.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input 
                id="current-password"
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required 
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input 
                  id="new-password"
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input 
                  id="confirm-password"
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
        </section>

        <div className="settings-divider"></div>

        {/* Two-Step Verification */}
        <section className="settings-section">
          <div className="section-header-wrap">
            <Shield size={18} className="section-icon" />
            <div>
              <h2 className="h4">Two-Step Verification</h2>
              <p className="text-meta">Add an extra verification step when signing in to your account.</p>
            </div>
          </div>

          <div className="two-factor-control-card">
            <div className="two-factor-info">
              <div className="two-factor-status-row">
                <span className="two-factor-label">Verification Status:</span>
                <span className={`status-pill ${security.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                  {security.twoFactorEnabled ? 'Active (Demo)' : 'Off'}
                </span>
              </div>
              <p className="two-factor-desc">
                Production verification will connect to SMS or authenticator apps once backend services are enabled.
              </p>
            </div>

            <button 
              type="button"
              className={`btn ${security.twoFactorEnabled ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleToggle2FA}
            >
              {security.twoFactorEnabled ? 'Disable Verification' : 'Enable Verification'}
            </button>
          </div>
        </section>

        <div className="settings-divider"></div>

        {/* Sessions & Data */}
        <section className="settings-section">
          <div className="section-header-wrap">
            <Smartphone size={18} className="section-icon" />
            <div>
              <h2 className="h4">Active Session</h2>
              <p className="text-meta">Current session stored in your browser.</p>
            </div>
          </div>

          <div className="sessions-list">
            <div className="session-item current">
              <div className="session-meta">
                <span className="session-device">Current Browser Session</span>
                <span className="session-location">Local browser session · Active now</span>
              </div>
              <span className="session-current-tag">Active</span>
            </div>
          </div>
        </section>

        <div className="settings-divider"></div>

        {/* Data Export */}
        <section className="settings-section">
          <div className="section-header-wrap">
            <Download size={18} className="section-icon" />
            <div>
              <h2 className="h4">Account Data</h2>
              <p className="text-meta">Download a copy of your profile information and saved preferences.</p>
            </div>
          </div>

          <div>
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={handleExportData}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} /> Download Account Data (JSON)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

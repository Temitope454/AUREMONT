import { useState } from 'react';
import { Save, Check, Shield, Bell, Globe } from 'lucide-react';

interface SettingsState {
  language: string;
  defaultCurrency: string;
  notifyInquiries: boolean;
  notifyViewings: boolean;
  notifyWeeklyReport: boolean;
  hideExactAddressDefault: boolean;
  twoFactorEnabled: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  language: 'English',
  defaultCurrency: 'EUR (€)',
  notifyInquiries: true,
  notifyViewings: true,
  notifyWeeklyReport: false,
  hideExactAddressDefault: true,
  twoFactorEnabled: true
};

export default function ProviderSettings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('auremont_provider_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('auremont_provider_settings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="provider-panel" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="panel-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="h3">Provider Workspace Settings</h1>
          <p className="text-meta">Manage your account preferences, localization, and notifications.</p>
        </div>
        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', backgroundColor: 'var(--color-bg-sand)', color: 'var(--color-text-slate)', fontWeight: 600 }}>
          Local Preferences Sync
        </span>
      </div>
      
      <form onSubmit={handleSave}>
        {/* Localization & Preferences */}
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Globe size={18} color="var(--color-primary-navy)" />
            <h3 className="h4" style={{ margin: 0 }}>Marketplace Preferences</h3>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label>Interface Language</label>
              <select 
                className="input-field" 
                value={settings.language} 
                onChange={e => setSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="English">English (Global)</option>
                <option value="Français">Français (French)</option>
                <option value="Español">Español (Spanish)</option>
                <option value="Deutsch">Deutsch (German)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Default Currency</label>
              <select 
                className="input-field" 
                value={settings.defaultCurrency} 
                onChange={e => setSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
              >
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="SGD (S$)">SGD (S$) - Singapore Dollar</option>
              </select>
            </div>
            <div className="input-group form-full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.hideExactAddressDefault} 
                  onChange={e => setSettings(prev => ({ ...prev, hideExactAddressDefault: e.target.checked }))} 
                />
                <span className="text-small">Hide exact street address on newly created drafts (Neighborhood privacy mode)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Bell size={18} color="var(--color-primary-navy)" />
            <h3 className="h4" style={{ margin: 0 }}>Notification Dispatch</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notifyInquiries} 
                onChange={e => setSettings(prev => ({ ...prev, notifyInquiries: e.target.checked }))} 
              /> 
              <span className="text-small">Immediate email alert when a new inquiry or rental request is received</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notifyViewings} 
                onChange={e => setSettings(prev => ({ ...prev, notifyViewings: e.target.checked }))} 
              /> 
              <span className="text-small">Viewing appointment schedule changes and calendar updates</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notifyWeeklyReport} 
                onChange={e => setSettings(prev => ({ ...prev, notifyWeeklyReport: e.target.checked }))} 
              /> 
              <span className="text-small">Weekly portfolio performance and inquiry analytics report</span>
            </label>
          </div>
        </div>

        {/* Security & Authentication Simulation */}
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface-white)', border: '1px solid var(--color-border-limestone)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
            <Shield size={18} color="var(--color-primary-navy)" />
            <h3 className="h4" style={{ margin: 0 }}>Security Integration</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Two-Factor Authentication (2FA)</div>
              <div className="text-meta" style={{ fontSize: '12px', color: 'var(--color-text-slate)', marginTop: '2px' }}>
                FIDO2 / WebAuthn Hardware Key or Authenticator App.
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))} 
              className={`btn ${settings.twoFactorEnabled ? 'btn-secondary' : 'btn-primary'} text-small`}
            >
              {settings.twoFactorEnabled ? 'Enabled (Demo)' : 'Enable 2FA'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} /> Save Preferences
          </button>
          {isSaved && (
            <span style={{ color: 'var(--color-success-forest)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={16} /> Preferences persisted
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

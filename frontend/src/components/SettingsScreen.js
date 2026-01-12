import React, { useState } from 'react';
import './SettingsScreen.css';

function SettingsScreen({ theme, setTheme, language, setLanguage }) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    transactions: true,
    priceAlerts: true,
    news: false
  });

  const [security, setSecurity] = useState({
    biometric: true,
    pinEnabled: true,
    autoLock: '5min'
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your app preferences</p>
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        
        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">🌙</span>
            <div className="settings-info">
              <div className="settings-label">Theme</div>
              <div className="settings-desc">Choose your preferred theme</div>
            </div>
          </div>
          <div className="theme-toggle">
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              ☀️ Light
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="settings-section">
        <h3 className="settings-section-title">Language & Region</h3>
        
        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">🌐</span>
            <div className="settings-info">
              <div className="settings-label">Language</div>
              <div className="settings-desc">Select your language</div>
            </div>
          </div>
          <select
            className="settings-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">💱</span>
            <div className="settings-info">
              <div className="settings-label">Currency</div>
              <div className="settings-desc">Display currency</div>
            </div>
          </div>
          <select className="settings-select">
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3 className="settings-section-title">Notifications</h3>
        
        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">🔔</span>
            <div className="settings-info">
              <div className="settings-label">Push Notifications</div>
              <div className="settings-desc">Receive push notifications</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">✉️</span>
            <div className="settings-info">
              <div className="settings-label">Email Notifications</div>
              <div className="settings-desc">Receive email updates</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">💸</span>
            <div className="settings-info">
              <div className="settings-label">Transaction Alerts</div>
              <div className="settings-desc">Get notified of transactions</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications.transactions}
              onChange={(e) => setNotifications({...notifications, transactions: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">📈</span>
            <div className="settings-info">
              <div className="settings-label">Price Alerts</div>
              <div className="settings-desc">Token price notifications</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications.priceAlerts}
              onChange={(e) => setNotifications({...notifications, priceAlerts: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="settings-section">
        <h3 className="settings-section-title">Security & Privacy</h3>
        
        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">👆</span>
            <div className="settings-info">
              <div className="settings-label">Biometric Authentication</div>
              <div className="settings-desc">Use fingerprint/face ID</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={security.biometric}
              onChange={(e) => setSecurity({...security, biometric: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">🔒</span>
            <div className="settings-info">
              <div className="settings-label">Change PIN</div>
              <div className="settings-desc">Update your security PIN</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>

        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-icon">⏱️</span>
            <div className="settings-info">
              <div className="settings-label">Auto-Lock</div>
              <div className="settings-desc">Lock after inactivity</div>
            </div>
          </div>
          <select
            className="settings-select"
            value={security.autoLock}
            onChange={(e) => setSecurity({...security, autoLock: e.target.value})}
          >
            <option value="1min">1 minute</option>
            <option value="5min">5 minutes</option>
            <option value="15min">15 minutes</option>
            <option value="30min">30 minutes</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">🔑</span>
            <div className="settings-info">
              <div className="settings-label">Backup Wallet</div>
              <div className="settings-desc">Export recovery phrase</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>
      </div>

      {/* Advanced */}
      <div className="settings-section">
        <h3 className="settings-section-title">Advanced</h3>
        
        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">⚙️</span>
            <div className="settings-info">
              <div className="settings-label">Network Settings</div>
              <div className="settings-desc">Manage RPC endpoints</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>

        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">🗑️</span>
            <div className="settings-info">
              <div className="settings-label">Clear Cache</div>
              <div className="settings-desc">Free up storage space</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <h3 className="settings-section-title">About</h3>
        
        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">ℹ️</span>
            <div className="settings-info">
              <div className="settings-label">App Version</div>
              <div className="settings-desc">v1.0.0 (Build 100)</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>

        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">📄</span>
            <div className="settings-info">
              <div className="settings-label">Terms of Service</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>

        <div className="settings-item clickable">
          <div className="settings-item-left">
            <span className="settings-icon">🔐</span>
            <div className="settings-info">
              <div className="settings-label">Privacy Policy</div>
            </div>
          </div>
          <span className="settings-arrow">›</span>
        </div>
      </div>

      <div className="danger-zone">
        <button className="logout-btn">
          <span>🚪</span> Logout from Wallet
        </button>
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default SettingsScreen;

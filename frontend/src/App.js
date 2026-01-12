import React, { useState } from 'react';
import './App.css';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { chains, wagmiConfig } from './config/wagmi';
import VictimDashboard from './components/VictimDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MobileApp from './components/MobileApp';
import WalletConnect from './components/WalletConnect';
import { useAccount } from 'wagmi';
import { useWebSocket } from './hooks/useWebSocket';

function AppContent() {
  const [userType, setUserType] = useState('victim'); // victim, merchant, admin, analytics
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, mobile
  const { address } = useAccount();
  const { notifications, clearNotification } = useWebSocket(address, userType);
// Mobile App view - no header/footer
  if (viewMode === 'mobile') {
    return <MobileApp account={address} setAccount={() => {}} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🛡️ AEGIS</h1>
          <p className="tagline">Blockchain-Powered Disaster Relief</p>
          <div className="connection-status">
            {address ? (
              <span className="status connected">
                🟢 Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            ) : (
              <span className="status disconnected">
                🔴 Not Connected
              </span>
            )}
          </div>
        </div>
        
        <WalletConnect userType={userType} />
        
        <nav className="user-type-nav">
          <button 
            className={userType === 'victim' ? 'active' : ''}
            onClick={() => setUserType('victim')}
          >
            Victim Portal
          </button>
          <button 
            className={userType === 'merchant' ? 'active' : ''}
            onClick={() => setUserType('merchant')}
          >
            Merchant Portal
          </button>
          <button 
            className={userType === 'admin' ? 'active' : ''}
            onClick={() => setUserType('admin')}
          >
            Admin Portal
          </button>
          <button 
            className={userType === 'analytics' ? 'active' : ''}
            onClick={() => setUserType('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className="mobile-mode-btn"
            onClick={() => setViewMode('mobile')}
            title="Switch to Mobile Wallet View"
          >
            📱 Mobile App
            📊 Analytics
          </button>
        </nav>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="notifications-panel">
            <h4>🔔 Real-time Notifications ({notifications.length})</h4>
            {notifications.slice(0, 3).map((notif, index) => (
              <div key={index} className="notification-item">
                <span>{notif.type === 'transfer' ? '💸' : notif.type === 'disaster' ? '🌪️' : '📝'}</span>
                <span>{JSON.stringify(notif.data).slice(0, 50)}...</span>
                <button onClick={() => clearNotification(index)}>✖</button>
              </div>
            ))}
          </div>
        )}
      </header>

      <main className="main-content">
        {userType === 'victim' && <VictimDashboard />}
        {userType === 'merchant' && <MerchantDashboard />}
        {userType === 'admin' && <AdminDashboard />}
        {userType === 'analytics' && <AnalyticsDashboard />}
      </main>

      <footer className="App-footer">
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <h3>Purpose-Bound Tokens</h3>
            <p>Spend only on essentials</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Instant Settlement</h3>
            <p>Merchants get paid in seconds</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📡</span>
            <h3>Offline Capable</h3>
            <p>Works without internet</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔐</span>
            <h3>Privacy First</h3>
            <p>Zero-knowledge proofs</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🏛️</span>
            <h3>DAO Governance</h3>
            <p>Community-driven decisions</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎁</span>
            <h3>Staking Rewards</h3>
            <p>Earn while you help</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <h3>NFT Badges</h3>
            <p>Recognition for contributions</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <h3>Real-Time Analytics</h3>
            <p>Live platform insights</p>
          </div>
        </div>
        <div className="footer-info">
          <p>Supported Networks: Ethereum • Polygon • Arbitrum • Optimism • BSC</p>
          <p className="footer-copyright">© 2024 AEGIS - Decentralized Disaster Relief</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        theme={darkTheme({
          accentColor: '#667eea',
          accentColorForeground: 'white',
        })}
      >
        <AppContent />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

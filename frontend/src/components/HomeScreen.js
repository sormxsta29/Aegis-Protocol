import React, { useState, useEffect } from 'react';
import './HomeScreen.css';

function HomeScreen({ account, tokenContracts }) {
  const [balances, setBalances] = useState({
    USDT: '1,234.56',
    USDC: '890.12',
    DAI: '567.89',
    BUSD: '345.67'
  });

  const [totalBalance, setTotalBalance] = useState('3,038.24');
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'receive', token: 'USDT', amount: '+125.00', from: '0x742d...4f2a', time: '2m ago', status: 'confirmed' },
    { id: 2, type: 'send', token: 'USDC', amount: '-50.00', to: '0x9876...1234', time: '15m ago', status: 'confirmed' },
    { id: 3, type: 'receive', token: 'DAI', amount: '+200.00', from: '0x1234...5678', time: '1h ago', status: 'confirmed' },
    { id: 4, type: 'send', token: 'USDT', amount: '-75.50', to: '0x5678...9abc', time: '3h ago', status: 'pending' }
  ]);

  const [refreshing, setRefreshing] = useState(false);

  // Real-time balance refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setBalances(prev => ({
        USDT: (parseFloat(prev.USDT.replace(',', '')) + Math.random() * 10).toFixed(2),
        USDC: (parseFloat(prev.USDC.replace(',', '')) + Math.random() * 5).toFixed(2),
        DAI: (parseFloat(prev.DAI.replace(',', '')) + Math.random() * 3).toFixed(2),
        BUSD: (parseFloat(prev.BUSD.replace(',', '')) + Math.random() * 2).toFixed(2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // Simulate balance update
      setBalances(prev => ({
        USDT: (parseFloat(prev.USDT.replace(',', '')) + Math.random() * 20).toFixed(2),
        USDC: (parseFloat(prev.USDC.replace(',', '')) + Math.random() * 10).toFixed(2),
        DAI: (parseFloat(prev.DAI.replace(',', '')) + Math.random() * 5).toFixed(2),
        BUSD: (parseFloat(prev.BUSD.replace(',', '')) + Math.random() * 3).toFixed(2)
      }));
    }, 1500);
  };

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-header">
        <div className="header-top">
          <div className="greeting">
            <h2>Welcome back! 👋</h2>
            <p className="wallet-address">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</p>
          </div>
          <button className="notification-btn">
            <span className="notification-badge">3</span>
            🔔
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <span className="balance-label">Total Balance</span>
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
          >
            🔄
          </button>
        </div>
        <div className="balance-amount">
          <span className="currency-symbol">$</span>
          <span className="amount">{totalBalance}</span>
          <span className="currency-code">USD</span>
        </div>
        <div className="balance-change">
          <span className="change-positive">↑ +$142.50 (4.92%)</span>
          <span className="change-period">Last 24h</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn primary">
          <span className="action-icon">📤</span>
          <span>Send</span>
        </button>
        <button className="action-btn primary">
          <span className="action-icon">📥</span>
          <span>Receive</span>
        </button>
        <button className="action-btn secondary">
          <span className="action-icon">💱</span>
          <span>Swap</span>
        </button>
        <button className="action-btn secondary">
          <span className="action-icon">➕</span>
          <span>Buy</span>
        </button>
      </div>

      {/* Token Cards */}
      <div className="section-header">
        <h3>Your Assets</h3>
        <button className="view-all-btn">View All →</button>
      </div>

      <div className="token-cards">
        {Object.entries(balances).map(([token, balance]) => (
          <div key={token} className="token-card">
            <div className="token-left">
              <div className="token-icon">{token === 'USDT' ? '₮' : token === 'USDC' ? '◎' : token === 'DAI' ? '◆' : '●'}</div>
              <div className="token-info">
                <div className="token-name">{token}</div>
                <div className="token-price">$1.00</div>
              </div>
            </div>
            <div className="token-right">
              <div className="token-balance">{balance}</div>
              <div className="token-value">${balance}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="section-header">
        <h3>Recent Activity</h3>
        <button className="view-all-btn">See All →</button>
      </div>

      <div className="activity-feed">
        {recentActivity.map(activity => (
          <div key={activity.id} className={`activity-item ${activity.status}`}>
            <div className="activity-icon-wrapper">
              <div className={`activity-icon ${activity.type}`}>
                {activity.type === 'receive' ? '↓' : '↑'}
              </div>
            </div>
            <div className="activity-details">
              <div className="activity-title">
                {activity.type === 'receive' ? 'Received' : 'Sent'} {activity.token}
              </div>
              <div className="activity-address">
                {activity.type === 'receive' ? `From ${activity.from}` : `To ${activity.to}`}
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
            <div className="activity-amount-wrapper">
              <div className={`activity-amount ${activity.type === 'receive' ? 'positive' : 'negative'}`}>
                {activity.amount}
              </div>
              {activity.status === 'pending' && (
                <div className="status-indicator pending">
                  <div className="spinner-small"></div>
                  Pending
                </div>
              )}
              {activity.status === 'confirmed' && (
                <div className="status-indicator confirmed">✓</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add padding at bottom for bottom nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default HomeScreen;

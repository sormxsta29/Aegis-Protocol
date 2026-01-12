import React, { useState, useEffect } from 'react';
import './MerchantDashboard.css';

function MerchantDashboard() {
  const [registered, setRegistered] = useState(false);
  const [category, setCategory] = useState('');
  const [earnings, setEarnings] = useState(15420);
  const [pendingTokens, setPendingTokens] = useState({
    food: 150,
    medical: 80,
    education: 0,
    shelter: 0,
    utilities: 0
  });
  const [liveMetrics, setLiveMetrics] = useState({
    todayEarnings: 450,
    todayTransactions: 23,
    conversionRate: 98.5,
    avgTransaction: 19.57
  });
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, customer: '0x1a2b...3c4d', amount: 25, type: 'Food', status: 'settled', time: '2 mins ago' },
    { id: 2, customer: '0x5e6f...7g8h', amount: 50, type: 'Medical', status: 'pending', time: '8 mins ago' },
    { id: 3, customer: '0x9i0j...1k2l', amount: 30, type: 'Food', status: 'settled', time: '15 mins ago' },
  ]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [settlementQueue, setSettlementQueue] = useState(3);

  // Real-time updates
  useEffect(() => {
    if (!registered) return;

    // Simulate live earnings updates
    const earningsInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newAmount = Math.floor(Math.random() * 30) + 10;
        const tokenType = category === 'grocery' ? 'food' : category === 'pharmacy' ? 'medical' : 'food';
        
        setLiveMetrics(prev => ({
          ...prev,
          todayEarnings: prev.todayEarnings + newAmount,
          todayTransactions: prev.todayTransactions + 1
        }));

        setPendingTokens(prev => ({
          ...prev,
          [tokenType]: prev[tokenType] + newAmount
        }));

        const newTx = {
          id: Date.now(),
          customer: '0x' + Math.random().toString(16).substr(2, 4) + '...' + Math.random().toString(16).substr(2, 4),
          amount: newAmount,
          type: tokenType.charAt(0).toUpperCase() + tokenType.slice(1),
          status: 'pending',
          time: 'Just now'
        };

        setRecentTransactions(prev => [newTx, ...prev.slice(0, 9)]);
        setSettlementQueue(prev => prev + 1);

        // Auto-settle after 5 seconds
        setTimeout(() => {
          setRecentTransactions(prev => prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'settled', time: '1 min ago' } : tx
          ));
          setSettlementQueue(prev => Math.max(0, prev - 1));
        }, 5000);
      }
    }, 7000);

    // Live activity feed
    const activityInterval = setInterval(() => {
      const activities = [
        '💰 Settlement processed: $125.00 USDC',
        '🔔 New customer scanned QR code',
        '✅ Transaction verified on-chain',
        '📊 Daily sales milestone reached',
        '⚡ Instant settlement available',
        '🌐 Network congestion: Low'
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivity(prev => [{
        text: randomActivity,
        time: new Date().toLocaleTimeString(),
        id: Date.now()
      }, ...prev.slice(0, 3)]);
    }, 6000);

    // Update metrics
    const metricsInterval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        conversionRate: (Math.random() * 2 + 97).toFixed(1),
        avgTransaction: (Math.random() * 10 + 15).toFixed(2)
      }));
    }, 4000);

    return () => {
      clearInterval(earningsInterval);
      clearInterval(activityInterval);
      clearInterval(metricsInterval);
    };
  }, [registered, category]);

  const registerMerchant = () => {
    if (!category) {
      alert('Please select a merchant category');
      return;
    }
    setRegistered(true);
  };

  const redeemTokens = () => {
    const total = Object.values(pendingTokens).reduce((a, b) => a + b, 0);
    if (total === 0) {
      alert('No tokens to redeem!');
      return;
    }
    setEarnings(earnings + total);
    setPendingTokens({
      food: 0,
      medical: 0,
      education: 0,
      shelter: 0,
      utilities: 0
    });
    setSettlementQueue(0);
    alert(`Successfully redeemed ${total} tokens for ${total} USDC! Funds transferred instantly to your wallet.`);
  };

  const scanQRCode = () => {
    alert('QR Scanner activated! Scan victim\'s offline payment code.');
    setPendingTokens({
      ...pendingTokens,
      food: pendingTokens.food + 50
    });
  };

  const getPendingTotal = () => {
    return Object.values(pendingTokens).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="dashboard merchant-dashboard">
      {registered && (
        <div className="realtime-status-bar">
          <div className="status-item">
            <span className="status-indicator pulse"></span>
            <span className="status-label">Live Payments</span>
          </div>
          <div className="status-item">
            <span className="status-icon">💵</span>
            <span className="status-value">${liveMetrics.todayEarnings.toFixed(2)}</span>
          </div>
          <div className="status-item">
            <span className="status-icon">📊</span>
            <span className="status-value">{liveMetrics.todayTransactions} Txs</span>
          </div>
          <div className="status-item">
            <span className="status-icon">⚡</span>
            <span className="status-value">{settlementQueue} Pending</span>
          </div>
          <div className="status-item">
            <span className="status-icon">✅</span>
            <span className="status-value">{liveMetrics.conversionRate}%</span>
          </div>
        </div>
      )}

      <h2>🏪 Merchant Dashboard</h2>
      
      {!registered ? (
        <div className="registration-section">
          <h3>Merchant Registration</h3>
          <p>Register your business to start accepting relief tokens</p>
          
          <div className="form-group">
            <label>Business Category</label>
            <select 
              className="form-select"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="grocery">🍎 Grocery Store</option>
              <option value="pharmacy">💊 Pharmacy</option>
              <option value="school">📚 School Supplies</option>
              <option value="landlord">🏠 Housing/Landlord</option>
              <option value="utilities">⚡ Utility Provider</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={registerMerchant}>
            Register as Merchant
          </button>
        </div>
      ) : (
        <>
          {/* Live Activity Feed */}
          {liveActivity.length > 0 && (
            <div className="live-activity-banner">
              <div className="activity-scroll">
                {liveActivity.map(activity => (
                  <div key={activity.id} className="activity-item fade-in">
                    <span className="activity-pulse">●</span>
                    {activity.text}
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Metrics Dashboard */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">💰</span>
                <span className="metric-trend up">↑ 12.5%</span>
              </div>
              <div className="metric-value">${liveMetrics.todayEarnings.toLocaleString()}</div>
              <div className="metric-label">Today's Earnings</div>
              <div className="metric-chart">▁▂▃▅▇█</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">🔢</span>
                <span className="metric-trend up">↑ 8.3%</span>
              </div>
              <div className="metric-value">{liveMetrics.todayTransactions}</div>
              <div className="metric-label">Transactions Today</div>
              <div className="metric-chart">▁▃▂▄▆▅</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">💵</span>
                <span className="metric-trend neutral">—</span>
              </div>
              <div className="metric-value">${liveMetrics.avgTransaction}</div>
              <div className="metric-label">Avg Transaction</div>
              <div className="metric-chart">▃▃▃▃▃▃</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">✅</span>
                <span className="metric-trend up">↑ 0.5%</span>
              </div>
              <div className="metric-value">{liveMetrics.conversionRate}%</div>
              <div className="metric-label">Settlement Rate</div>
              <div className="metric-chart">▅▆▇▇▇█</div>
            </div>
          </div>

          {/* Business Info */}
          <div className="business-section">
            <div className="section-header">
              <h3>Business Information</h3>
              <span className="status-badge verified">✓ Verified</span>
            </div>
            <div className="business-info">
              <div className="info-row">
                <span className="info-label">Category:</span>
                <span className="info-value">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value wallet-address">
                  0x9f8c6EA3C7B5B5F8D9B6A1C2D3E4F5G6H7I8J9K0
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText('0x9f8c6EA3C7B5B5F8D9B6A1C2D3E4F5G6H7I8J9K0')}>📋</button>
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Earnings:</span>
                <span className="info-value highlight">${earnings.toLocaleString()} USDC</span>
              </div>
            </div>
          </div>

          {/* Pending Tokens */}
          <div className="section-header">
            <h3>Pending Settlements</h3>
            <span className="live-badge">🔴 Real-time</span>
          </div>

          <div className="tokens-grid">
            {Object.entries(pendingTokens).map(([type, amount]) => (
              <div key={type} className={`token-card ${type} ${amount > 0 ? 'has-balance' : ''}`}>
                <div className="token-icon">
                  {type === 'food' ? '🍎' : type === 'medical' ? '💊' : type === 'education' ? '📚' : type === 'shelter' ? '🏠' : '⚡'}
                </div>
                <div className="token-amount">{amount}</div>
                <div className="token-label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div className="token-value">${(amount * 1).toFixed(2)} USDC</div>
              </div>
            ))}
          </div>

          <div className="settlement-summary">
            <div className="summary-row">
              <span>Total Pending Tokens:</span>
              <span className="summary-value">{getPendingTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Settlement Amount (1:1):</span>
              <span className="summary-value highlight">${getPendingTotal().toFixed(2)} USDC</span>
            </div>
            <div className="summary-row">
              <span>Settlement Speed:</span>
              <span className="summary-badge instant">⚡ Instant</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <span className="refresh-indicator">🔄 Auto-updating</span>
          </div>

          <div className="transaction-list">
            {recentTransactions.map(tx => (
              <div key={tx.id} className={`transaction-item ${tx.status}`}>
                <div className="tx-icon">
                  {tx.type === 'Food' ? '🍎' : '💊'}
                </div>
                <div className="tx-details">
                  <div className="tx-main">
                    <span className="tx-customer">{tx.customer}</span>
                    <span className="tx-amount">+{tx.amount} {tx.type}</span>
                  </div>
                  <div className="tx-meta">
                    <span className="tx-value">${tx.amount.toFixed(2)} USDC</span>
                    <span className="tx-time">{tx.time}</span>
                  </div>
                </div>
                <div className="tx-status">
                  {tx.status === 'pending' ? (
                    <span className="status-badge pending">
                      <span className="spinner"></span> Settling...
                    </span>
                  ) : (
                    <span className="status-badge settled">✓ Settled</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn btn-primary pulse-btn" 
              onClick={redeemTokens}
              disabled={getPendingTotal() === 0}
            >
              ⚡ Redeem for USDC (${getPendingTotal().toFixed(2)})
            </button>
            <button className="btn btn-secondary" onClick={scanQRCode}>
              📷 Scan QR Code
            </button>
            <button className="btn btn-outline" onClick={() => window.open('https://etherscan.io', '_blank')}>
              📊 View Analytics
            </button>
          </div>

          {/* Live Stats Footer */}
          <div className="live-stats-footer">
            <div className="stat">
              <span className="stat-icon">💎</span>
              <div>
                <div className="stat-value">{getPendingTotal()}</div>
                <div className="stat-label">Pending Tokens</div>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">💰</span>
              <div>
                <div className="stat-value">${earnings.toLocaleString()}</div>
                <div className="stat-label">Total Earned</div>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">📈</span>
              <div>
                <div className="stat-value">{recentTransactions.length}</div>
                <div className="stat-label">Recent Txs</div>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">⚡</span>
              <div>
                <div className="stat-value">Instant</div>
                <div className="stat-label">Settlement</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MerchantDashboard;

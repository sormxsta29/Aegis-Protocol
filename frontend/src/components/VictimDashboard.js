import React, { useState, useEffect } from 'react';
import './VictimDashboard.css';

function VictimDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [tokens, setTokens] = useState({
    food: 500,
    medical: 300,
    education: 200,
    shelter: 400,
    utilities: 250
  });
  const [realtimeData, setRealtimeData] = useState({
    gasPrice: 0,
    blockNumber: 0,
    networkStatus: 'connected',
    lastUpdate: new Date()
  });
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'received', token: 'Food', amount: 100, time: '2 mins ago', status: 'confirmed', hash: '0x1a2b...3c4d' },
    { id: 2, type: 'spent', token: 'Medical', amount: 50, time: '15 mins ago', status: 'confirmed', hash: '0x5e6f...7g8h' },
    { id: 3, type: 'received', token: 'Shelter', amount: 200, time: '1 hour ago', status: 'confirmed', hash: '0x9i0j...1k2l' },
  ]);
  const [pendingTx, setPendingTx] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);

  // Real-time updates simulation
  useEffect(() => {
    if (!walletConnected) return;

    // Simulate live gas price updates
    const gasInterval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        gasPrice: (Math.random() * 50 + 10).toFixed(2),
        blockNumber: prev.blockNumber + 1,
        lastUpdate: new Date()
      }));
    }, 3000);
const getTotalValue = () => {
    return Object.values(tokens).reduce((sum, val) => sum + val, 0);
  };

  return (
    <div className="dashboard victim-dashboard">
      {/* Real-time Network Status Bar */}
      {walletConnected && (
        <div className="realtime-status-bar">
          <div className="status-item">
            <span className="status-indicator pulse"></span>
            <span className="status-label">Live</span>
          </div>
          <div className="status-item">
            <span className="status-icon">⛽</span>
            <span className="status-value">{realtimeData.gasPrice} Gwei</span>
          </div>
          <div className="status-item">
            <span className="status-icon">📦</span>
            <span className="status-value">Block #{realtimeData.blockNumber.toLocaleString()}</span>
          </div>
          <div className="status-item">
            <span className="status-icon">🔄</span>
            <span className="status-value">{pendingTx.length} Pending</span>
          </div>
          <div className="status-item">
            <span className="status-icon">🕐</span>
            <span className="status-value">{realtimeData.lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      <h2>👤 Victim Dashboard</h2>
      
      {!walletConnected ? (
        <div className="wallet-section">
          <h3>Connect Your Wallet</h3>
          <p>Connect to access your relief tokens and view live updates</p>
          <button className="btn btn-primary" onClick={connectWallet}>
            🔗Transaction confirmed on-chain'
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivity(prev => [{
        text: randomActivity,
        time: new Date().toLocaleTimeString(),
        id: Date.now()
      }, ...prev.slice(0, 4)]);
    }, 5000);

    // Simulate random token balance changes
    const balanceInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const tokenTypes = ['food', 'medical', 'education', 'shelter', 'utilities'];
        const randomToken = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
        const change = Math.floor(Math.random() * 20) + 5;
        
        setTokens(prev => ({
          ...prev,
          [randomToken]: prev[randomToken] + change
        }));

        // Add to transaction history
        const newTx = {
          id: Date.now(),
          type: 'received',
          token: randomToken.charAt(0).toUpperCase() + randomToken.slice(1),
          amount: change,
          time: 'Just now',
          status: 'pending',
          hash: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4)
        };
        setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
        setPendingTx(prev => [...prev, newTx.id]);

        // Confirm after 3 seconds
        setTimeout(() => {
          setTransactions(prev => prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'confirmed', time: '1 min ago' } : tx
          ));
          setPendingTx(prev => prev.filter(id => id !== newTx.id));
        }, 3000);
      }
    }, 8000);

    return () => {
      clearInterval(gasInterval);
      clearInterval(activityInterval);
      clearInterval(balanceInterval);
    };
  }, [walletConnected]);

  const connectWallet = () => {
    setWal{/* Live Activity Feed */}
          {liveActivity.length > 0 && (
            <div className="live-activity-banner">
              <div className="activity-scroll">
                {liveActivity.map(activity => (
                  <div key={activity.id} className="activity-item fade-in">
                    <span className="activity-pulse">●</span>
                    {activity.text}
                    <span className="activi shimmer">
              <div className="token-header">
                <h3>🍎 Food</h3>
                <span className="token-change positive">+5.2%</span>
              </div>
              <p className="token-balance">
                {tokens.food.toLocaleString()}
                <span className="token-usd">${(tokens.food * 1.2).toFixed(2)}</span>
              </p>
              <div className="token-footer">
                <small>For groceries & food</small>
                <div className="token-chart">📈</div>
              </div>
            </div>
            <div className="token-card medical shimmer">
              <div className="token-header">
                <h3>💊 Medical</h3>
                <span className="token-change positive">+3.1%</span>
              </div>
              <p className="token-balance">
                {tokens.medical.toLocaleString()}
                <span className="token-usd">${(tokens.medical * 1.2).toFixed(2)}</span>
              </p>
              <div className="token-footer">
                <small>For pharmacy & healthcare</small>
                <div className="token-chart">📈</div>
              </div>
            </div>
            <div className="token-card education shimmer">
              <div className="token-header">
                <h3>📚 Education</h3>
                <span className="token-change neutral">0%</span>
              </div>
              <p className="token-balance">
                {tokens.education.toLocaleString()}
                <span className="token-usd">${(tokens.education * 1.2).toFixed(2)}</span>
              </p>
              <div className="token-footer">
                <small>For school supplies</small>
                <div className="token-chart">—</div>
              </div>
            </div>
            <div className="token-card shelter shimmer">
              <div className="token-header">
                <h3>🏠 Shelter</h3>
                <span className="token-change positive">+8.7%</span>
              </div>
              <p className="token-balance">
                {tokens.shelter.toLocaleString()}
                <span className="token-usd">${(tokens.shelter * 1.2).toFixed(2)}</span>
              </p>
              <div className="token-footer">
                <small>For housing & rent</small>
                <div className="token-chart">📈</div>
              </div>
            </div>
            <div className="token-card utilities shimmer">
              <div className="token-header">
                <h3>⚡ Utilities</h3>
                <span className="token-change positive">+2.4%</span>
              </div>
              <p className="token-balance">
                {tokens.utilities.toLocaleString()}
                <span className="token-usd">${(tokens.utilities * 1.2).toFixed(2)}</span>
              </p>
              <div className="token-footer">
                <small>For water & electricity</small>
                <div className="token-chart">📈</div>
              </div>
            </div>
          </div>

          {/* Real-time Transaction History */}
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <span className="refresh-indicator">🔄 Auto-updating</span>
          </div>
          <div className="transaction-list">
            {transactions.map(tx => (
              <div key={tx.id} className={`transaction-item ${tx.status}`}>
                <div className="tx-icon">
                  {tx.type === 'received' ? '📥' : '📤'}
                </div>
                <div className="tx-details">
                  <div className="tx-main">
                    <span className="tx-type">{tx.type === 'received' ? 'Received' : 'Spent'}</span>
                    <span className="tx-amount">{tx.amount} {tx.token}</span>
                  </div>
                  <div className="tx-meta">
                    <span className="tx-hash">{tx.hash}</span>
                    <span className="tx-time">{tx.time}</span>
                  </div>
                </div>
                <div className="tx-status">
                  {tx.status === 'pending' ? (
                    <span className="status-badge pending">
                      <span className="spinner"></span> Pending
                    </span>
                  ) : (
                    <span className="status-badge confirmed">✓ Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary pulse-btnve Updates</span>
          </div

  const generateQRCode = () => {
    alert('QR Code generated for offline transactions! Show this to merchants.');
  };

  const requestRelief = () => {
    alert('Relief request submitted! Funds will be released upon disaster verification.');
  };

  return (
    <div className="dashboard victim-dashboard">
      <h2>👤 Victim Dashboard</h2>
      
      {!walletConnected ? (
        <div className="wallet-section">
          <h3>Connect Your Wallet</h3>
          <p>Connect to access your relief tokens</p>
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="wallet-section">
            <h3>Your Wallet</h3>
            <div className="wallet-address">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</div>
            <div className="status-badge verified">✓ Verified Recipient</div>
          </div>

          <h3>Your Relief Tokens</h3>
          <div className="tokens-grid">
            <div className="token-card food">
              <h3>🍎 Food</h3>
              <p className="token-balance">{tokens.food}</p>
              <small>For groceries & food</small>
            </div>
            <div className="token-card medical">
              <h3>💊 Medical</h3>
              <p className="token-balance">{tokens.medical}</p>
              <small>For pharmacy & healthcare</small>
            </div>
            <div className="token-card education">
              <h3>📚 Education</h3>
              <p className="token-balance">{tokens.education}</p>
              <small>For school supplies</small>
            </div>
            <div className="token-card shelter">
              <h3>🏠 Shelter</h3>
              <p className="token-balance">{tokens.shelter}</p>
              <small>For housing & rent</small>
            </div>
            <div className="token-card utilities">
              <h3>⚡ Utilities</h3>
              <p className="token-balance">{tokens.utilities}</p>
              <small>For water & electricity</small>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={generateQRCode}>
              📱 Generate Offline QR Code
            </button>
            <button className="btn btn-secondary" onClick={requestRelief}>
              🆘 Request Emergency Relief
            </button>
          </div>

          <div className="info-card">
            <h3>📡 Offline Mode Available</h3>
            <p>No internet? No problem! Generate a QR code or NFC card to make purchases even without connectivity. Merchants will relay your transactions to the blockchain.</p>
          </div>

          <div className="info-card">
            <h3>🔐 Your Privacy is Protected</h3>
            <p>All transactions use zero-knowledge proofs. Your personal information is never revealed on the blockchain.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default VictimDashboard;

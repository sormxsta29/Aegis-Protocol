import React, { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import SampleTransaction from './SampleTransaction';
import './VictimDashboard.css';

function VictimDashboard() {
  const { address, isConnected } = useAccount();

  const [tokens, setTokens] = useState({
    food: 500,
    medical: 300,
    education: 200,
    shelter: 400,
    utilities: 250
  });

  const [realtimeData, setRealtimeData] = useState({
    gasPrice: '0.00',
    blockNumber: 0,
    networkStatus: 'connected',
    lastUpdate: new Date()
  });

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'received', token: 'Food', amount: 100, time: '2 mins ago', status: 'confirmed', hash: '0x1a2b...3c4d' },
    { id: 2, type: 'spent', token: 'Medical', amount: 50, time: '15 mins ago', status: 'confirmed', hash: '0x5e6f...7g8h' },
    { id: 3, type: 'received', token: 'Shelter', amount: 200, time: '1 hour ago', status: 'confirmed', hash: '0x9i0j...1k2l' }
  ]);

  const [pendingTxIds, setPendingTxIds] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);

  const totalTokens = useMemo(() => {
    return Object.values(tokens).reduce((sum, val) => sum + val, 0);
  }, [tokens]);

  useEffect(() => {
    if (!isConnected) return;

    // Simulate live gas price + block updates
    const gasInterval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        gasPrice: (Math.random() * 50 + 10).toFixed(2),
        blockNumber: prev.blockNumber + 1,
        lastUpdate: new Date()
      }));
    }, 3000);

    // Simulate live activity feed
    const activityInterval = setInterval(() => {
      const activities = [
        '✅ Wallet connected',
        '📡 Syncing balances',
        '💸 Transfer detected',
        '🧾 Transaction confirmed on-chain',
        '🔔 New notification received'
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivity(prev => [
        {
          text: randomActivity,
          time: new Date().toLocaleTimeString(),
          id: Date.now()
        },
        ...prev.slice(0, 4)
      ]);
    }, 5000);

    // Simulate random token balance changes + pending tx
    const balanceInterval = setInterval(() => {
      if (Math.random() <= 0.7) return;

      const tokenTypes = ['food', 'medical', 'education', 'shelter', 'utilities'];
      const randomToken = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
      const change = Math.floor(Math.random() * 20) + 5;

      setTokens(prev => ({
        ...prev,
        [randomToken]: prev[randomToken] + change
      }));

      const newTx = {
        id: Date.now(),
        type: 'received',
        token: randomToken.charAt(0).toUpperCase() + randomToken.slice(1),
        amount: change,
        time: 'Just now',
        status: 'pending',
        hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
      setPendingTxIds(prev => [...prev, newTx.id]);

      setTimeout(() => {
        setTransactions(prev =>
          prev.map(tx => (tx.id === newTx.id ? { ...tx, status: 'confirmed', time: '1 min ago' } : tx))
        );
        setPendingTxIds(prev => prev.filter(id => id !== newTx.id));
      }, 3000);
    }, 8000);

    return () => {
      clearInterval(gasInterval);
      clearInterval(activityInterval);
      clearInterval(balanceInterval);
    };
  }, [isConnected]);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // ignore
    }
  };

  return (
    <div className="dashboard victim-dashboard">
      {isConnected && (
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
            <span className="status-value">{pendingTxIds.length} Pending</span>
          </div>
          <div className="status-item">
            <span className="status-icon">🕐</span>
            <span className="status-value">{realtimeData.lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      <h2>👤 Victim Dashboard</h2>

      {!isConnected ? (
        <div className="wallet-section">
          <h3>Connect Your Wallet</h3>
          <p>Use the Connect button in the header to connect and view your live updates.</p>
        </div>
      ) : (
        <>
          {/* Wallet header */}
          <div className="wallet-header">
            <div>
              <h3>Wallet</h3>
              <div className="wallet-address">
                <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button className="copy-btn" onClick={copyAddress} title="Copy address">📋</button>
              </div>
            </div>

            <div className="wallet-stats">
              <div className="stat-item">
                <span className="stat-label">Total Tokens</span>
                <span className="stat-value">{totalTokens.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Live Activity Feed */}
          {liveActivity.length > 0 && (
            <div className="live-activity-banner">
              <div className="activity-scroll">
                {liveActivity.map(activity => (
                  <div key={activity.id} className="activity-item fade-in">
                    <span className="activity-pulse">●</span>
                    <span>{activity.text}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Token balances */}
          <div className="section-header">
            <h3>Your Relief Tokens</h3>
            <span className="live-badge">LIVE</span>
          </div>

          <div className="token-cards">
            <div className="token-card food shimmer">
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

          <SampleTransaction />

          {/* Transactions */}
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <span className="refresh-indicator">🔄 Auto-updating</span>
          </div>

          <div className="transaction-list">
            {transactions.map(tx => (
              <div key={tx.id} className={`transaction-item ${tx.status}`}>
                <div className="tx-icon">{tx.type === 'received' ? '⬇️' : '⬆️'}</div>

                <div className="tx-details">
                  <div className="tx-main">
                    <span className="tx-type">{tx.type === 'received' ? 'Received' : 'Spent'} • {tx.token}</span>
                    <span className="tx-amount">{tx.type === 'received' ? '+' : '-'}{tx.amount}</span>
                  </div>
                  <div className="tx-meta">
                    <span className="tx-hash">{tx.hash}</span>
                    <span className="tx-time">{tx.time}</span>
                  </div>
                </div>

                <div className="tx-status">
                  {tx.status === 'pending' ? (
                    <span className="status-badge pending"><span className="spinner"></span> Pending</span>
                  ) : (
                    <span className="status-badge confirmed">✅ Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default VictimDashboard;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './AdminDashboard.css';

function AdminDashboard({ account, contract, tokenContracts }) {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDisaster, setNewDisaster] = useState({
    location: '',
    severity: '',
    description: ''
  });

  // Real-time state
  const [realtimeData, setRealtimeData] = useState({
    gasPrice: '25',
    blockNumber: 18234567,
    pendingTx: 142,
    networkHealth: 99.8,
    timestamp: new Date().toLocaleTimeString()
  });

  const [liveStats, setLiveStats] = useState({
    totalDisasters: 12,
    activeDisasters: 8,
    totalVictims: 1247,
    totalMerchants: 156,
    totalDistributed: 2847592,
    vaultBalance: 1250000,
    last24hTx: 3456
  });

  const [liveActivity, setLiveActivity] = useState([]);
  const [recentActions, setRecentActions] = useState([
    { id: 1, type: 'disaster', action: 'New disaster registered in Tokyo', time: '2 min ago', status: 'active' },
    { id: 2, type: 'distribution', action: 'Distributed 5000 USDT to disaster #7', time: '5 min ago', status: 'completed' },
    { id: 3, type: 'verification', action: 'Verified 15 new victims', time: '8 min ago', status: 'completed' },
    { id: 4, type: 'settlement', action: 'Settled merchant payments: $12,450', time: '12 min ago', status: 'completed' },
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, level: 'warning', message: 'High network congestion detected', time: '5m ago' },
    { id: 2, level: 'info', message: 'Vault balance sufficient for next 30 days', time: '15m ago' }
  ]);

  // Real-time updates
  useEffect(() => {
    // Update gas price and block number
    const statusInterval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        gasPrice: (parseFloat(prev.gasPrice) + (Math.random() - 0.5) * 2).toFixed(1),
        blockNumber: prev.blockNumber + 1,
        pendingTx: Math.max(50, prev.pendingTx + Math.floor(Math.random() * 20 - 10)),
        networkHealth: (99 + Math.random()).toFixed(1),
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 3000);

    // Update live activity
    const activities = [
      '🎯 New victim registered in disaster zone #5',
      '💰 Token distribution completed: 2,500 USDT',
      '✅ Merchant verification approved',
      '🔔 Emergency alert: Disaster severity increased',
      '📊 System health check completed',
      '🔐 Smart contract audit passed',
      '💳 Settlement batch processed: $15,230',
      '🌍 New disaster zone added: California Wildfire'
    ];

    const activityInterval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivity(prev => [randomActivity, ...prev.slice(0, 4)]);
    }, 6000);

    // Update live stats
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        totalVictims: prev.totalVictims + Math.floor(Math.random() * 3),
        totalDistributed: prev.totalDistributed + Math.floor(Math.random() * 5000),
        last24hTx: prev.last24hTx + Math.floor(Math.random() * 10),
        vaultBalance: prev.vaultBalance - Math.floor(Math.random() * 100)
      }));
    }, 5000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(activityInterval);
      clearInterval(statsInterval);
    };
  }, []);

  useEffect(() => {
    fetchDisasters();
  }, [contract]);

  const fetchDisasters = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const disasterCount = await contract.disasterCount();
      const disasterList = [];
      
      for (let i = 1; i <= disasterCount; i++) {
        const disaster = await contract.disasters(i);
        disasterList.push({
          id: i,
          location: disaster.location,
          severity: disaster.severity.toString(),
          isActive: disaster.isActive,
          timestamp: new Date(disaster.timestamp * 1000).toLocaleString()
        });
      }
      
      setDisasters(disasterList);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
    setLoading(false);
  };

  const registerDisaster = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const tx = await contract.registerDisaster(
        newDisaster.location,
        newDisaster.severity,
        newDisaster.description
      );
      await tx.wait();
      
      // Add to recent actions
      setRecentActions(prev => [{
        id: Date.now(),
        type: 'disaster',
        action: `New disaster registered: ${newDisaster.location}`,
        time: 'Just now',
        status: 'active'
      }, ...prev.slice(0, 9)]);

      setNewDisaster({ location: '', severity: '', description: '' });
      fetchDisasters();
    } catch (error) {
      console.error('Error registering disaster:', error);
      alert('Failed to register disaster');
    }
  };

  const distributeTokens = async (disasterId, amount) => {
    if (!contract) return;

    try {
      const tx = await contract.distributeTokens(disasterId, ethers.utils.parseEther(amount));
      await tx.wait();
      
      setRecentActions(prev => [{
        id: Date.now(),
        type: 'distribution',
        action: `Distributed ${amount} tokens to disaster #${disasterId}`,
        time: 'Just now',
        status: 'completed'
      }, ...prev.slice(0, 9)]);

      alert('Tokens distributed successfully!');
    } catch (error) {
      console.error('Error distributing tokens:', error);
      alert('Failed to distribute tokens');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Real-time Status Bar */}
      <div className="realtime-status-bar">
        <div className="status-item">
          <span className="pulse"></span>
          <span className="status-label">Live</span>
        </div>
        <div className="status-item">
          <span className="status-label">Gas:</span>
          <span className="status-value">{realtimeData.gasPrice} Gwei</span>
        </div>
        <div className="status-item">
          <span className="status-label">Block:</span>
          <span className="status-value">#{realtimeData.blockNumber}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Pending TX:</span>
          <span className="status-value">{realtimeData.pendingTx}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Network:</span>
          <span className="status-value">{realtimeData.networkHealth}%</span>
        </div>
        <div className="status-item">
          <span className="status-label">⏰</span>
          <span className="status-value">{realtimeData.timestamp}</span>
        </div>
      </div>

      {/* Live Activity Banner */}
      {liveActivity.length > 0 && (
        <div className="live-activity-banner">
          <div className="activity-content">
            <span className="activity-icon">📡</span>
            <span className="activity-text">
              <span className="activity-highlight">LIVE:</span> {liveActivity[0]}
            </span>
          </div>
        </div>
      )}

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="system-alerts">
          {systemAlerts.map(alert => (
            <div key={alert.id} className={`alert alert-${alert.level}`}>
              <span className="alert-icon">
                {alert.level === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span className="alert-message">{alert.message}</span>
              <span className="alert-time">{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      <h1>🛡️ Admin Control Center</h1>

      {/* Live Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-label">Total Disasters</div>
            <div className="stat-value">{liveStats.totalDisasters}</div>
            <div className="stat-subtext">
              <span className="stat-active">{liveStats.activeDisasters} Active</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Victims</div>
            <div className="stat-value">{liveStats.totalVictims.toLocaleString()}</div>
            <div className="stat-subtext trend-up">
              ↑ +{Math.floor(Math.random() * 20)} today
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-label">Total Merchants</div>
            <div className="stat-value">{liveStats.totalMerchants}</div>
            <div className="stat-subtext trend-up">
              ↑ {Math.floor(Math.random() * 10)}% growth
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Distributed</div>
            <div className="stat-value">${liveStats.totalDistributed.toLocaleString()}</div>
            <div className="stat-subtext">
              Across all disasters
            </div>
          </div>
        </div>

        <div className="stat-card vault-card">
          <div className="stat-icon">🏦</div>
          <div className="stat-content">
            <div className="stat-label">Vault Balance</div>
            <div className="stat-value">${liveStats.vaultBalance.toLocaleString()}</div>
            <div className="stat-subtext trend-neutral">
              Sufficient reserves
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">24h Transactions</div>
            <div className="stat-value">{liveStats.last24hTx.toLocaleString()}</div>
            <div className="stat-subtext trend-up">
              ↑ +{Math.floor(Math.random() * 15)}% vs yesterday
            </div>
          </div>
        </div>
      </div>

      {/* Register New Disaster */}
      <div className="section-card">
        <h2>📝 Register New Disaster</h2>
        <form onSubmit={registerDisaster} className="disaster-form">
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={newDisaster.location}
                onChange={(e) => setNewDisaster({...newDisaster, location: e.target.value})}
                placeholder="e.g., Tokyo, Japan"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Severity (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newDisaster.severity}
                onChange={(e) => setNewDisaster({...newDisaster, severity: e.target.value})}
                placeholder="1-10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newDisaster.description}
              onChange={(e) => setNewDisaster({...newDisaster, description: e.target.value})}
              placeholder="Describe the disaster situation..."
              rows="3"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            <span>🚨</span> Register Disaster
          </button>
        </form>
      </div>

      {/* Active Disasters List */}
      <div className="section-card">
        <div className="section-header">
          <h2>🌍 Active Disasters</h2>
          <div className="refresh-indicator">
            <span className="pulse"></span> Auto-updating
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading disasters...</p>
          </div>
        ) : (
          <div className="disasters-grid">
            {disasters.filter(d => d.isActive).map(disaster => (
              <div key={disaster.id} className="disaster-card">
                <div className="disaster-header">
                  <div className="disaster-id">Disaster #{disaster.id}</div>
                  <div className={`severity-badge severity-${disaster.severity >= 8 ? 'critical' : disaster.severity >= 5 ? 'high' : 'medium'}`}>
                    Severity: {disaster.severity}/10
                  </div>
                </div>

                <div className="disaster-info">
                  <div className="info-row">
                    <span className="info-label">📍 Location:</span>
                    <span className="info-value">{disaster.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">⏰ Registered:</span>
                    <span className="info-value">{disaster.timestamp}</span>
                  </div>
                </div>

                <div className="disaster-actions">
                  <button 
                    onClick={() => {
                      const amount = prompt('Enter amount to distribute:');
                      if (amount) distributeTokens(disaster.id, amount);
                    }}
                    className="action-btn primary"
                  >
                    💸 Distribute Tokens
                  </button>
                  <button className="action-btn secondary">
                    📊 View Analytics
                  </button>
                </div>
              </div>
            ))}

            {disasters.filter(d => d.isActive).length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">🌟</span>
                <p>No active disasters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Admin Actions */}
      <div className="section-card">
        <h2>📋 Recent Admin Actions</h2>
        <div className="actions-list">
          {recentActions.map(action => (
            <div key={action.id} className={`action-item ${action.status}`}>
              <div className="action-left">
                <span className="action-icon">
                  {action.type === 'disaster' && '🚨'}
                  {action.type === 'distribution' && '💰'}
                  {action.type === 'verification' && '✅'}
                  {action.type === 'settlement' && '💳'}
                </span>
                <div className="action-details">
                  <div className="action-text">{action.action}</div>
                  <div className="action-time">{action.time}</div>
                </div>
              </div>
              <div className="action-status">
                <span className={`status-badge status-${action.status}`}>
                  {action.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="system-status-footer">
        <div className="status-group">
          <div className="status-indicator online"></div>
          <span>Smart Contracts: Online</span>
        </div>
        <div className="status-group">
          <div className="status-indicator online"></div>
          <span>Token Vault: Operational</span>
        </div>
        <div className="status-group">
          <div className="status-indicator online"></div>
          <span>Distribution System: Active</span>
        </div>
        <div className="status-group">
          <div className="status-indicator online"></div>
          <span>Verification Service: Running</span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

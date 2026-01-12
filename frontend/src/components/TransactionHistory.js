import React, { useState } from 'react';
import './TransactionHistory.css';

function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, sent, received, pending
  const [sortBy, setSortBy] = useState('date'); // date, amount

  const [transactions] = useState([
    { id: '1', type: 'receive', token: 'USDT', amount: 125.00, from: '0x742d35Cc6634C0532925a3b844Bc9e7595f4f2a', to: 'You', time: '2024-01-12 14:30', status: 'confirmed', hash: '0x7f3a9b2c...' },
    { id: '2', type: 'send', token: 'USDC', amount: 50.00, from: 'You', to: '0x9876543210abcdef1234567890abcdef12345678', time: '2024-01-12 13:15', status: 'confirmed', hash: '0x8e4b8c3d...' },
    { id: '3', type: 'receive', token: 'DAI', amount: 200.00, from: '0x1234567890abcdef1234567890abcdef12345678', to: 'You', time: '2024-01-12 11:00', status: 'confirmed', hash: '0x9f5c9d4e...' },
    { id: '4', type: 'send', token: 'USDT', amount: 75.50, from: 'You', to: '0x567890abcdef1234567890abcdef1234567890ab', time: '2024-01-12 09:45', status: 'pending', hash: '0xa06d0e5f...' },
    { id: '5', type: 'send', token: 'BUSD', amount: 30.25, from: 'You', to: '0xabcdef1234567890abcdef1234567890abcdef12', time: '2024-01-11 16:20', status: 'confirmed', hash: '0xb17e1f60...' },
    { id: '6', type: 'receive', token: 'USDT', amount: 500.00, from: '0xfedcba0987654321fedcba0987654321fedcba09', to: 'You', time: '2024-01-11 10:30', status: 'confirmed', hash: '0xc28f2071...' },
    { id: '7', type: 'send', token: 'USDC', amount: 150.75, from: 'You', to: '0x234567890abcdef1234567890abcdef1234567890', time: '2024-01-10 14:15', status: 'confirmed', hash: '0xd39032a2...' },
    { id: '8', type: 'receive', token: 'DAI', amount: 85.60, from: '0x34567890abcdef1234567890abcdef123456789012', to: 'You', time: '2024-01-10 09:00', status: 'confirmed', hash: '0xe4a143b3...' }
  ]);

  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = transactions
    .filter(tx => {
      if (filterType === 'all') return true;
      if (filterType === 'pending') return tx.status === 'pending';
      return tx.type === filterType;
    })
    .filter(tx => {
      if (!searchQuery) return true;
      return (
        tx.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.time) - new Date(a.time);
      }
      return b.amount - a.amount;
    });

  if (selectedTx) {
    return (
      <div className="transaction-history">
        <div className="detail-header">
          <button className="back-btn" onClick={() => setSelectedTx(null)}>
            ← Back
          </button>
          <h2>Transaction Details</h2>
          <div></div>
        </div>

        <div className="transaction-detail">
          {/* Status Badge */}
          <div className="detail-status-section">
            <div className={`detail-status-badge ${selectedTx.status}`}>
              {selectedTx.status === 'confirmed' ? '✓ Confirmed' : '⏱ Pending'}
            </div>
          </div>

          {/* Amount */}
          <div className="detail-amount-section">
            <div className={`detail-amount ${selectedTx.type}`}>
              {selectedTx.type === 'receive' ? '+' : '-'}{selectedTx.amount} {selectedTx.token}
            </div>
            <div className="detail-usd">≈ ${selectedTx.amount.toFixed(2)} USD</div>
          </div>

          {/* Details Card */}
          <div className="detail-card">
            <div className="detail-row">
              <span className="detail-label">Type</span>
              <span className="detail-value capitalize">{selectedTx.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">From</span>
              <span className="detail-value address">{selectedTx.from}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">To</span>
              <span className="detail-value address">{selectedTx.to}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Transaction Hash</span>
              <span className="detail-value address">{selectedTx.hash}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Token</span>
              <span className="detail-value">{selectedTx.token}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Network Fee</span>
              <span className="detail-value">0.002 ETH</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Timestamp</span>
              <span className="detail-value">{selectedTx.time}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Block Number</span>
              <span className="detail-value">18,234,567</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Confirmations</span>
              <span className="detail-value">124</span>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button className="action-btn-detail primary">
              View on Explorer
            </button>
            <button className="action-btn-detail secondary">
              Share Transaction
            </button>
            <button className="action-btn-detail secondary">
              Download Receipt
            </button>
          </div>
        </div>

        <div style={{ height: '80px' }}></div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="history-header">
        <h1>Transaction History</h1>
        <p>{filteredTransactions.length} transactions</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by token, hash, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-chips">
          {['all', 'sent', 'received', 'pending'].map(type => (
            <button
              key={type}
              className={`filter-chip ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="history-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📭</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div
              key={tx.id}
              className={`history-item ${tx.status}`}
              onClick={() => setSelectedTx(tx)}
            >
              <div className="history-icon-wrapper">
                <div className={`history-icon ${tx.type}`}>
                  {tx.type === 'receive' ? '↓' : '↑'}
                </div>
              </div>
              
              <div className="history-info">
                <div className="history-title">
                  {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.token}
                </div>
                <div className="history-address">
                  {tx.type === 'receive' 
                    ? `From ${tx.from.slice(0, 10)}...${tx.from.slice(-8)}`
                    : `To ${tx.to.slice(0, 10)}...${tx.to.slice(-8)}`
                  }
                </div>
                <div className="history-time">{tx.time}</div>
              </div>

              <div className="history-right">
                <div className={`history-amount ${tx.type}`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount}
                </div>
                {tx.status === 'pending' && (
                  <div className="history-status pending">
                    <div className="spinner-tiny"></div>
                    Pending
                  </div>
                )}
                {tx.status === 'confirmed' && (
                  <div className="history-status confirmed">✓</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default TransactionHistory;

import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './SendReceiveScreen.css';

function SendScreen({ account, tokenContracts }) {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    token: 'USDT',
    note: ''
  });

  const [step, setStep] = useState('form'); // form, confirm, processing, success, error
  const [estimatedFee, setEstimatedFee] = useState('0.002');
  const [scannedAddress, setScannedAddress] = useState('');

  const tokens = [
    { symbol: 'USDT', balance: '1,234.56', icon: '₮' },
    { symbol: 'USDC', balance: '890.12', icon: '◎' },
    { symbol: 'DAI', balance: '567.89', icon: '◆' },
    { symbol: 'BUSD', balance: '345.67', icon: '●' }
  ];

  const handleSend = () => {
    if (!formData.recipient || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    setStep('confirm');
  };

  const confirmTransaction = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const resetForm = () => {
    setFormData({ recipient: '', amount: '', token: 'USDT', note: '' });
    setStep('form');
  };

  if (step === 'processing') {
    return (
      <div className="send-screen">
        <div className="processing-screen">
          <div className="loading-spinner-large"></div>
          <h2>Processing Transaction...</h2>
          <p>Please wait while your transaction is being processed</p>
          <div className="transaction-details-box">
            <div className="detail-row">
              <span>Sending</span>
              <span>{formData.amount} {formData.token}</span>
            </div>
            <div className="detail-row">
              <span>To</span>
              <span>{formData.recipient.slice(0, 10)}...{formData.recipient.slice(-8)}</span>
            </div>
            <div className="detail-row">
              <span>Network Fee</span>
              <span>{estimatedFee} ETH</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="send-screen">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2>Transaction Successful!</h2>
          <p>Your {formData.token} has been sent successfully</p>
          
          <div className="success-details">
            <div className="success-amount">{formData.amount} {formData.token}</div>
            <div className="success-label">Sent to</div>
            <div className="success-address">{formData.recipient.slice(0, 12)}...{formData.recipient.slice(-10)}</div>
            
            <div className="transaction-info">
              <div className="info-item">
                <span className="info-label">Transaction Hash</span>
                <span className="info-value">0x7f3a...9b2c</span>
              </div>
              <div className="info-item">
                <span className="info-label">Network Fee</span>
                <span className="info-value">{estimatedFee} ETH</span>
              </div>
              <div className="info-item">
                <span className="info-label">Timestamp</span>
                <span className="info-value">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button className="primary-btn" onClick={resetForm}>
              Send Another
            </button>
            <button className="secondary-btn">
              View on Explorer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="send-screen">
        <div className="confirm-screen">
          <h2>Confirm Transaction</h2>
          <p>Please review the details before confirming</p>

          <div className="confirm-card">
            <div className="confirm-amount-section">
              <div className="confirm-label">You're sending</div>
              <div className="confirm-amount">{formData.amount} {formData.token}</div>
              <div className="confirm-usd">≈ ${formData.amount}</div>
            </div>

            <div className="confirm-divider">↓</div>

            <div className="confirm-details">
              <div className="detail-row">
                <span className="detail-label">To</span>
                <span className="detail-value">{formData.recipient.slice(0, 10)}...{formData.recipient.slice(-8)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Network Fee</span>
                <span className="detail-value">{estimatedFee} ETH</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Cost</span>
                <span className="detail-value strong">{formData.amount} {formData.token}</span>
              </div>
              {formData.note && (
                <div className="detail-row">
                  <span className="detail-label">Note</span>
                  <span className="detail-value">{formData.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="confirm-actions">
            <button className="secondary-btn" onClick={() => setStep('form')}>
              Cancel
            </button>
            <button className="primary-btn" onClick={confirmTransaction}>
              Confirm & Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="send-screen">
      <div className="screen-header">
        <h1>Send Tokens</h1>
        <p>Transfer tokens to any address</p>
      </div>

      <div className="send-form">
        {/* Token Selection */}
        <div className="form-section">
          <label>Select Token</label>
          <div className="token-selector">
            {tokens.map(token => (
              <button
                key={token.symbol}
                className={`token-option ${formData.token === token.symbol ? 'selected' : ''}`}
                onClick={() => setFormData({...formData, token: token.symbol})}
              >
                <span className="token-icon">{token.icon}</span>
                <div className="token-option-info">
                  <div className="token-symbol">{token.symbol}</div>
                  <div className="token-balance">Balance: {token.balance}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Address */}
        <div className="form-section">
          <label>Recipient Address</label>
          <div className="input-with-button">
            <input
              type="text"
              placeholder="0x... or ENS name"
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              className="form-input"
            />
            <button className="scan-btn" title="Scan QR Code">📷</button>
          </div>
        </div>

        {/* Amount */}
        <div className="form-section">
          <label>Amount</label>
          <div className="amount-input-wrapper">
            <input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="form-input amount-input"
            />
            <button className="max-btn">MAX</button>
          </div>
          <div className="amount-usd">≈ ${formData.amount || '0.00'} USD</div>
        </div>

        {/* Note (Optional) */}
        <div className="form-section">
          <label>Note (Optional)</label>
          <input
            type="text"
            placeholder="Add a note..."
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
            className="form-input"
          />
        </div>

        {/* Transaction Summary */}
        <div className="transaction-summary">
          <div className="summary-row">
            <span>Network Fee</span>
            <span className="fee-value">{estimatedFee} ETH</span>
          </div>
          <div className="summary-row">
            <span>Estimated Time</span>
            <span>~30 seconds</span>
          </div>
        </div>

        {/* Send Button */}
        <button className="send-btn" onClick={handleSend}>
          Continue
        </button>
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

function ReceiveScreen({ account }) {
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [copied, setCopied] = useState(false);

  const tokens = ['USDT', 'USDC', 'DAI', 'BUSD'];

  const copyAddress = () => {
    navigator.clipboard.writeText(account || '0x742d35Cc6634C0532925a3b844Bc9e7595f4f2a');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="receive-screen">
      <div className="screen-header">
        <h1>Receive Tokens</h1>
        <p>Share your address or QR code</p>
      </div>

      <div className="receive-content">
        {/* Token Selection */}
        <div className="token-tabs">
          {tokens.map(token => (
            <button
              key={token}
              className={`token-tab ${selectedToken === token ? 'active' : ''}`}
              onClick={() => setSelectedToken(token)}
            >
              {token}
            </button>
          ))}
        </div>

        {/* QR Code */}
        <div className="qr-code-section">
          <div className="qr-code-wrapper">
            <QRCode
              value={account || '0x742d35Cc6634C0532925a3b844Bc9e7595f4f2a'}
              size={220}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1a1a2e"
            />
          </div>
          <p className="qr-label">Scan this QR code to receive {selectedToken}</p>
        </div>

        {/* Address Display */}
        <div className="address-section">
          <label>Your {selectedToken} Address</label>
          <div className="address-display">
            <span className="address-text">
              {account || '0x742d35Cc6634C0532925a3b844Bc9e7595f4f2a'}
            </span>
            <button className={`copy-address-btn ${copied ? 'copied' : ''}`} onClick={copyAddress}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="warning-box">
          <span className="warning-icon">⚠️</span>
          <div className="warning-text">
            <strong>Important:</strong> Only send {selectedToken} to this address. Sending other tokens may result in permanent loss.
          </div>
        </div>

        {/* Share Options */}
        <div className="share-section">
          <h3>Share Address</h3>
          <div className="share-buttons">
            <button className="share-btn">📱 SMS</button>
            <button className="share-btn">✉️ Email</button>
            <button className="share-btn">💬 Message</button>
            <button className="share-btn">🔗 More</button>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export { SendScreen, ReceiveScreen };

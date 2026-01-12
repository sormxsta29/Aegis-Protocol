import React, { useState, useEffect } from 'react';
import './AuthScreens.css';

// Login Screen
export function LoginScreen({ onConnect }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async (method) => {
    setConnecting(true);
    setTimeout(() => {
      onConnect && onConnect();
      setConnecting(false);
    }, 2000);
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon">🛡️</div>
          <h1>Aegis Wallet</h1>
          <p>Secure Disaster Relief Platform</p>
        </div>

        <div className="auth-card">
          <h2>Connect Your Wallet</h2>
          <p className="auth-subtitle">Choose how you'd like to connect</p>

          <div className="wallet-options">
            <button className="wallet-btn" onClick={() => handleConnect('metamask')} disabled={connecting}>
              <span className="wallet-icon">🦊</span>
              <div className="wallet-info">
                <div className="wallet-name">MetaMask</div>
                <div className="wallet-desc">Connect using MetaMask</div>
              </div>
              <span className="wallet-arrow">→</span>
            </button>

            <button className="wallet-btn" onClick={() => handleConnect('walletconnect')} disabled={connecting}>
              <span className="wallet-icon">📱</span>
              <div className="wallet-info">
                <div className="wallet-name">WalletConnect</div>
                <div className="wallet-desc">Scan with mobile wallet</div>
              </div>
              <span className="wallet-arrow">→</span>
            </button>

            <button className="wallet-btn" onClick={() => handleConnect('coinbase')} disabled={connecting}>
              <span className="wallet-icon">🔵</span>
              <div className="wallet-info">
                <div className="wallet-name">Coinbase Wallet</div>
                <div className="wallet-desc">Connect using Coinbase</div>
              </div>
              <span className="wallet-arrow">→</span>
            </button>
          </div>

          {connecting && (
            <div className="connecting-overlay">
              <div className="connecting-spinner"></div>
              <p>Connecting to wallet...</p>
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p>New to crypto wallets? <a href="#learn">Learn more</a></p>
        </div>
      </div>
    </div>
  );
}

// OTP Verification Screen
export function OTPScreen({ onVerify }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      onVerify && onVerify(otpCode);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <button className="back-button">← Back</button>

        <div className="auth-card">
          <div className="otp-header">
            <div className="otp-icon">📨</div>
            <h2>Verify Your Identity</h2>
            <p>Enter the 6-digit code sent to<br/><strong>+1 (555) ***-**67</strong></p>
          </div>

          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="otp-input"
              />
            ))}
          </div>

          <button
            className="verify-btn"
            onClick={handleVerify}
            disabled={otp.join('').length !== 6}
          >
            Verify Code
          </button>

          <div className="resend-section">
            {resendTimer > 0 ? (
              <p>Resend code in {resendTimer}s</p>
            ) : (
              <button className="resend-btn">Resend Code</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// PIN Lock Screen
export function PINScreen({ mode = 'enter', onComplete }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState('enter'); // enter, confirm
  const [error, setError] = useState('');
  const [biometricAvailable] = useState(true);

  const handleNumberClick = (num) => {
    if (mode === 'create' && step === 'enter') {
      if (pin.length < 6) {
        setPin(pin + num);
        if (pin.length === 5) {
          setTimeout(() => setStep('confirm'), 300);
        }
      }
    } else if (mode === 'create' && step === 'confirm') {
      if (confirmPin.length < 6) {
        const newPin = confirmPin + num;
        setConfirmPin(newPin);
        if (newPin.length === 6) {
          if (newPin === pin) {
            onComplete && onComplete(newPin);
          } else {
            setError('PINs do not match');
            setTimeout(() => {
              setConfirmPin('');
              setPin('');
              setStep('enter');
              setError('');
            }, 2000);
          }
        }
      }
    } else {
      if (pin.length < 6) {
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 6) {
          // Validate PIN
          setTimeout(() => {
            onComplete && onComplete(newPin);
          }, 300);
        }
      }
    }
  };

  const handleDelete = () => {
    if (step === 'confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  const handleBiometric = () => {
    // Simulate biometric authentication
    setTimeout(() => {
      onComplete && onComplete('biometric');
    }, 1000);
  };

  const currentPin = step === 'confirm' ? confirmPin : pin;

  return (
    <div className="auth-screen">
      <div className="pin-container">
        <div className="pin-header">
          <h2>
            {mode === 'create' && step === 'enter' && 'Create PIN'}
            {mode === 'create' && step === 'confirm' && 'Confirm PIN'}
            {mode === 'enter' && 'Enter PIN'}
          </h2>
          <p>
            {mode === 'create' && step === 'enter' && 'Create a 6-digit PIN to secure your wallet'}
            {mode === 'create' && step === 'confirm' && 'Enter your PIN again to confirm'}
            {mode === 'enter' && 'Enter your PIN to unlock'}
          </p>
        </div>

        <div className="pin-dots">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`pin-dot ${i < currentPin.length ? 'filled' : ''}`} />
          ))}
        </div>

        {error && <div className="pin-error">{error}</div>}

        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} className="pin-key" onClick={() => handleNumberClick(num.toString())}>
              {num}
            </button>
          ))}
          {biometricAvailable && mode === 'enter' ? (
            <button className="pin-key biometric" onClick={handleBiometric}>
              👆
            </button>
          ) : (
            <button className="pin-key empty"></button>
          )}
          <button className="pin-key" onClick={() => handleNumberClick('0')}>
            0
          </button>
          <button className="pin-key delete" onClick={handleDelete}>
            ⌫
          </button>
        </div>

        {mode === 'enter' && (
          <button className="forgot-pin-btn">Forgot PIN?</button>
        )}
      </div>
    </div>
  );
}

// Logout Confirmation
export function LogoutConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon warning">⚠️</div>
        <h3>Logout Confirmation</h3>
        <p>Are you sure you want to logout? You'll need to reconnect your wallet to access your account.</p>
        
        <div className="modal-actions">
          <button className="modal-btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn danger" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Onboarding Screens
export function OnboardingScreens({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '🛡️',
      title: 'Welcome to Aegis',
      description: 'Your secure gateway to disaster relief and humanitarian aid on the blockchain.'
    },
    {
      icon: '💰',
      title: 'Manage Your Tokens',
      description: 'Easily send, receive, and manage multiple cryptocurrencies in one place.'
    },
    {
      icon: '🔒',
      title: 'Bank-Level Security',
      description: 'Your assets are protected with advanced encryption and biometric authentication.'
    },
    {
      icon: '🌍',
      title: 'Make an Impact',
      description: 'Participate in disaster relief efforts and help communities in need worldwide.'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete && onComplete();
    }
  };

  return (
    <div className="onboarding-screen">
      <button className="skip-btn" onClick={onComplete}>Skip</button>

      <div className="onboarding-content">
        <div className="onboarding-icon">{slides[currentSlide].icon}</div>
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].description}</p>
      </div>

      <div className="onboarding-indicators">
        {slides.map((_, index) => (
          <div key={index} className={`indicator ${index === currentSlide ? 'active' : ''}`} />
        ))}
      </div>

      <button className="onboarding-btn" onClick={handleNext}>
        {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
      </button>
    </div>
  );
}

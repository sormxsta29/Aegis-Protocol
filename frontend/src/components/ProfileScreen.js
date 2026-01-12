import React, { useState } from 'react';
import './ProfileScreen.css';

function ProfileScreen({ account }) {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: null
  });

  const [stats] = useState({
    totalTransactions: 247,
    totalSent: '$12,450.00',
    totalReceived: '$18,920.50',
    memberSince: 'Jan 2025'
  });

  return (
    <div className="profile-screen">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" />
            ) : (
              <span className="avatar-placeholder">👤</span>
            )}
          </div>
          <button className="edit-avatar-btn">📷</button>
        </div>
        
        <h2 className="profile-name">{profile.name}</h2>
        <p className="wallet-address-display">
          {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : 'Not connected'}
        </p>
        
        <button className="edit-profile-btn">
          ✏️ Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-value">{stats.totalTransactions}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.totalSent}</div>
          <div className="stat-label">Total Sent</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.totalReceived}</div>
          <div className="stat-label">Total Received</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.memberSince}</div>
          <div className="stat-label">Member Since</div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="profile-menu">
        <div className="menu-section">
          <h3 className="section-title">Account</h3>
          
          <button className="menu-item">
            <span className="menu-icon">👤</span>
            <span className="menu-label">Personal Information</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">🔐</span>
            <span className="menu-label">Security & Privacy</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">💳</span>
            <span className="menu-label">Payment Methods</span>
            <span className="menu-arrow">›</span>
          </button>
        </div>

        <div className="menu-section">
          <h3 className="section-title">Preferences</h3>
          
          <button className="menu-item">
            <span className="menu-icon">🌙</span>
            <span className="menu-label">Appearance</span>
            <span className="menu-value">Dark</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">🌐</span>
            <span className="menu-label">Language</span>
            <span className="menu-value">English</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">🔔</span>
            <span className="menu-label">Notifications</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">💱</span>
            <span className="menu-label">Currency</span>
            <span className="menu-value">USD</span>
            <span className="menu-arrow">›</span>
          </button>
        </div>

        <div className="menu-section">
          <h3 className="section-title">Support</h3>
          
          <button className="menu-item">
            <span className="menu-icon">❓</span>
            <span className="menu-label">Help Center</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">💬</span>
            <span className="menu-label">Contact Support</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">📄</span>
            <span className="menu-label">Terms & Conditions</span>
            <span className="menu-arrow">›</span>
          </button>

          <button className="menu-item">
            <span className="menu-icon">🔒</span>
            <span className="menu-label">Privacy Policy</span>
            <span className="menu-arrow">›</span>
          </button>
        </div>

        <div className="menu-section">
          <button className="menu-item logout-item">
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="app-version">
        <p>Aegis Wallet v1.0.0</p>
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default ProfileScreen;

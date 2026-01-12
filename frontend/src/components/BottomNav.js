import React from 'react';
import './BottomNav.css';

function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'send', icon: '📤', label: 'Send' },
    { id: 'scan', icon: '📷', label: 'Scan' },
    { id: 'history', icon: '📋', label: 'History' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;

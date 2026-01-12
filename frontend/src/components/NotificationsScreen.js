import React, { useState } from 'react';
import './NotificationsScreen.css';

function NotificationsScreen() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'transaction',
      title: 'Received Payment',
      message: 'You received 125.00 USDT from 0x742d...4f2a',
      time: '2 minutes ago',
      read: false,
      icon: '💰'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Price Alert',
      message: 'USDT has reached your target price of $1.01',
      time: '15 minutes ago',
      read: false,
      icon: '📈'
    },
    {
      id: 3,
      type: 'system',
      title: 'Security Update',
      message: 'New security features are now available. Update your app to stay secure.',
      time: '1 hour ago',
      read: true,
      icon: '🔒'
    },
    {
      id: 4,
      type: 'transaction',
      title: 'Transaction Confirmed',
      message: 'Your transfer of 50.00 USDC has been confirmed on the blockchain.',
      time: '2 hours ago',
      read: true,
      icon: '✅'
    },
    {
      id: 5,
      type: 'news',
      title: 'Disaster Relief Update',
      message: 'New disaster zone registered in Tokyo. Your contributions can make a difference.',
      time: '3 hours ago',
      read: true,
      icon: '🌍'
    },
    {
      id: 6,
      type: 'transaction',
      title: 'Received Payment',
      message: 'You received 200.00 DAI from 0x1234...5678',
      time: '5 hours ago',
      read: true,
      icon: '💸'
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, transactions

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'transactions') return notif.type === 'transaction';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-screen">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount} new</div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="notification-filters">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-tab ${filter === 'transactions' ? 'active' : ''}`}
          onClick={() => setFilter('transactions')}
        >
          Transactions
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
              {!notif.read && <div className="unread-indicator"></div>}
              
              <div className="notification-icon">{notif.icon}</div>
              
              <div className="notification-content">
                <div className="notification-title">{notif.title}</div>
                <div className="notification-message">{notif.message}</div>
                <div className="notification-time">{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="notifications-footer">
          <button className="clear-all-btn">Mark all as read</button>
        </div>
      )}

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

export default NotificationsScreen;

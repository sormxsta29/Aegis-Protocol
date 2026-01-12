import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { WS_URL } from '../config/constants';

export function useWebSocket(userAddress, userType) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userAddress || !userType) return;

    const newSocket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Register user
      newSocket.emit('register', {
        address: userAddress,
        userType: userType
      });
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('registered', (data) => {
      console.log('User registered:', data);
    });

    newSocket.on('tokenTransfer', (data) => {
      console.log('Token transfer:', data);
      setNotifications(prev => [...prev, {
        type: 'transfer',
        data,
        timestamp: Date.now()
      }]);
    });

    newSocket.on('newTransaction', (data) => {
      console.log('New transaction:', data);
      setNotifications(prev => [...prev, {
        type: 'transaction',
        data,
        timestamp: Date.now()
      }]);
    });

    newSocket.on('newDisaster', (data) => {
      console.log('New disaster event:', data);
      setNotifications(prev => [...prev, {
        type: 'disaster',
        data,
        timestamp: Date.now()
      }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userAddress, userType]);

  const clearNotification = useCallback((index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    socket,
    connected,
    notifications,
    clearNotification,
    clearAllNotifications
  };
}

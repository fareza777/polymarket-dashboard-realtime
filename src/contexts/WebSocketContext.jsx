import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [botStatus, setBotStatus] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('markets:update', (data) => {
      console.log('📈 Received market update:', data.timestamp);
      setMarketData(data);
      setLastUpdate(new Date().toISOString());
    });

    socketInstance.on('bot:status', (data) => {
      console.log('🤖 Received bot status:', data.timestamp);
      setBotStatus(data);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const value = {
    socket,
    isConnected,
    marketData,
    botStatus,
    lastUpdate,
    // Helper functions
    getMarketBySymbol: (symbol) => {
      if (!marketData?.markets) return null;
      return marketData.markets.find(market => market.symbol === symbol);
    },
    getTimeRemaining: () => {
      if (!marketData?.periodEnd) return '--:--';
      const end = new Date(marketData.periodEnd);
      const now = new Date();
      const diffMs = end - now;
      
      if (diffMs <= 0) return '00:00';
      
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    refreshData: () => {
      if (socket && isConnected) {
        socket.emit('request:markets');
        socket.emit('request:status');
      }
    }
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
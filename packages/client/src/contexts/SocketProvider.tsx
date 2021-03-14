import * as React from 'react';
import { SocketService } from '../services/SocketService';

const socket: SocketService = new SocketService();

const SocketContext = React.createContext<SocketService | undefined>(undefined);

type SocketProviderProps = {
  children: React.ReactNode
};

const SocketProvider = ({ children }: SocketProviderProps) => {

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );

};

const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  };
  return context;
};

export { SocketProvider, useSocket };
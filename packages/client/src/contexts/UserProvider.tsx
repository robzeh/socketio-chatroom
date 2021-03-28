import * as React from 'react';
import { INITIAL_USER_DETAILS } from '../models/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, UserContextType } from '../models/types';

const UserContext = React.createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: React.ReactNode
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [userDetails, setUserDetails] = useLocalStorage<User>('userDetails', INITIAL_USER_DETAILS);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );

};

const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  };
  return context;
};

export { UserProvider, useUser };
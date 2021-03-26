import * as React from 'react';
import { INITIAL_ROOM_STATE } from '../constants';
import { RoomState, RoomDispatch, RoomAction } from '../models/types';

type RoomProviderProps = {
  children: React.ReactNode
};

interface RoomContextType {
  state: RoomState,
  dispatch: RoomDispatch
};

const RoomContext = React.createContext<RoomContextType | undefined>(undefined);

const roomReducer = (state: RoomState, action: RoomAction) => {
  switch (action.type) {
    case 'setUsers': {
      return { ...state, users: action.payload };
    }
    case 'userJoin': {
      return { ...state, users: state.users + 1 };
    };
    case 'userLeft': {
      return { ...state, users: state.users - 1 };
    };
    default: {
      throw new Error('Unhandled action type')
    }
  }
};

const RoomProvider = ({ children }: RoomProviderProps) => {
  const [state, dispatch] = React.useReducer(roomReducer, INITIAL_ROOM_STATE);

  // memoize state, dispatch?
  return (
    <RoomContext.Provider value={{ state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );

};

const useRoom = () => {
  const context = React.useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

export { RoomProvider, useRoom };

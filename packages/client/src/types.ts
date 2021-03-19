import { DefaultEventsMap, EventsMap } from 'socket.io-client/build/typed-events';

interface User {
  username: string,
  sessionId: string,
  roomId: string
};

interface UserContextType {
  userDetails: User,
  setUserDetails: (userDetails: User) => void;
};

interface RoomResponse {
  success: boolean,
  roomId: string
};

interface UserJoinResponse {
  username: string,
  // color?
}

// TODO: define events?
interface ClientToServerEvents extends EventsMap {
};

interface ServerToClientEvents {
}

export type { User, UserContextType, RoomResponse, ClientToServerEvents, ServerToClientEvents, UserJoinResponse };
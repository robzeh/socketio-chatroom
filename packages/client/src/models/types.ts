import { DefaultEventsMap, EventsMap } from 'socket.io-client/build/typed-events';

interface User {
  username: string,
  sessionId: string,
  roomId: string,
  userId: string,
  color: string
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
};

// user id? 4 digits from session id
interface RoomUser {
  username: string,
  userId: string,
  color: string
};

interface ChatMessage extends RoomUser {
  message: string,
};

interface ChatMessageRequest extends ChatMessage {
  roomId: string
};

interface LoginFormData {
  username: string,
};

interface RoomFormData {
  roomName: string,
  privateRoom: boolean
};

interface RoomListItem {
  roomName: string,
  owner: string,
  users: string,
  roomId: string
};

interface RoomState {
  users: number,
  ready: number
};

type RoomDispatch = (action: RoomAction) => void;

type RoomAction =
  { type: 'setUsers', payload: number } |
  { type: 'userJoin' } |
  { type: 'userLeft' }

// TODO: define events?
interface ClientToServerEvents extends EventsMap {
};

interface ServerToClientEvents {
}

export type {
  User,
  UserContextType,
  RoomResponse,
  ClientToServerEvents,
  ServerToClientEvents,
  UserJoinResponse,
  RoomUser,
  ChatMessage,
  ChatMessageRequest,
  LoginFormData,
  RoomFormData,
  RoomListItem,
  RoomState,
  RoomDispatch,
  RoomAction
};
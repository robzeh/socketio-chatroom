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

interface RoomContextType {
  state: RoomState,
  dispatch: RoomDispatch

};

// fix ?;  ???
interface RoomState {
  roomName?: string,
  users: number,
  ready: number,
  roomOwner?: string
};

type RoomDispatch = (action: RoomAction) => void;

type RoomAction =
  { type: 'roomName', payload?: string } |
  { type: 'setUsers', payload: number } |
  { type: 'setOwner', payload?: string } |
  { type: 'userJoin' } |
  { type: 'userLeft' } |
  { type: 'userReady' } |
  { type: 'reset' };

interface MangaFormData {
  file: FileList
};

interface MangaContextType {
  state: MangaState,
  dispatch: MangaDispatch
};

interface MangaState {
  pages: Blob[], // blob array? then 
  currPage: number,
  //nextPage: () => void,
  //prevPage: () => void,
};

type MangaDispatch = (action: MangaAction) => void;

type MangaAction =
  { type: 'setPages', payload: Blob } |
  { type: 'nextPage' } |
  { type: 'prevPage' };

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
  RoomAction,
  RoomContextType,
  MangaFormData,
  MangaContextType,
  MangaState,
  MangaAction
};
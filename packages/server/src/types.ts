import { Socket } from 'socket.io';

interface MangaSocket extends Socket {
  sessionId?: string,
  username?: string,
  roomId?: string,
  userId?: string,
  color?: string
};

// include sessionId?
interface Session {
  username: string,
  roomId: string,
  userId: string,
  color: string
};

interface SessionDetails extends Session {
  sessionId: string
};

interface RoomResponse {
  success: boolean,
  roomId: string
};

interface RoomUser {
  username: string,
  userId: string,
  color: string
};

interface RoomListItem {
  roomName: string,
  owner: string,
  users: string,
  roomId: string
};

interface ChatMessage extends RoomUser {
  message: string,
  roomId: string
};

export {
  MangaSocket,
  Session,
  SessionDetails,
  RoomResponse,
  RoomUser,
  ChatMessage,
  RoomListItem
};
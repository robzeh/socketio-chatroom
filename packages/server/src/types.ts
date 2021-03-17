import { Socket } from 'socket.io';

interface MangaSocket extends Socket {
  sessionId?: string,
  username?: string,
  roomId?: string
};

// include sessionId?
interface Session {
  username: string,
  roomId: string
};

interface SessionDetails extends Session {
  sessionId: string
};

interface RoomResponse {
  success: boolean,
  roomId: string
};

export { MangaSocket, Session, SessionDetails, RoomResponse };
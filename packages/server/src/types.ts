import { Socket } from 'socket.io';

interface MangaSocket extends Socket {
  sessionId: string,
  username: string,
  roomId: string
};

// include sessionId?
interface Session {
  username: string,
  roomId: string
};

interface UserSession extends Session {
  sessionId: string
};

export { MangaSocket, Session, UserSession };
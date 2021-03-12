import { Socket } from 'socket.io';

interface MangaSocket extends Socket {
  sessionId: number,
  username: string,
  roomId: string
};

export { MangaSocket };
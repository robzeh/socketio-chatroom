import { sessionStore } from '../stores/stores';
import { MangaSocket } from '../types'
import { v4 as uuidv4 } from 'uuid';

const socketMiddleware = async (socket: MangaSocket, next: (err?: any) => void) => {
  // check if existing sessionId
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const session = await sessionStore.findSession(sessionId);
    // check if session.username === handshake username???
    if (session) {
      socket.sessionId = sessionId;
      socket.username = session.username;
      socket.roomId = session.roomId;

      return next();
    }
  }

  // new user, no sessionId, only username
  const username = socket.handshake.auth.username;
  socket.sessionId = uuidv4();
  socket.username = username;
  socket.roomId = ''; // new user has no existing room to join

  next();

};

export { socketMiddleware };
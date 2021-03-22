import { sessionStore } from '../stores/stores';
import { MangaSocket, Session } from '../types'
import { v4 as uuidv4 } from 'uuid';

const socketMiddleware = async (socket: MangaSocket, next: (err?: any) => void) => {
  // check if existing sessionId
  const sessionId: string = socket.handshake.auth.sessionId;
  // compare length?
  if (sessionId) {
    const session: Session = await sessionStore.findSession(sessionId);
    console.log(session);
    // check if session.username === handshake username???
    if (session) {
      socket.sessionId = sessionId;
      socket.username = session.username;
      socket.roomId = session.roomId;
      socket.userId = session.userId;
      socket.color = session.color;

      return next();
    }
  }

  // new user, no sessionId, only username
  const username: string = socket.handshake.auth.username;
  const sessId: string = uuidv4();
  socket.sessionId = sessId;
  socket.username = username;
  socket.roomId = ''; // new user has no existing room to join
  socket.userId = sessId.substring(0, 4).toUpperCase(); // first 4 characters of session id
  socket.color = ''; // generate color client or server side?

  next();

};

export { socketMiddleware };
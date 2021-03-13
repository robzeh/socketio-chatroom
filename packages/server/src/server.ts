import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { PORT, ORIGIN } from './utils/env';
import { MangaSocket } from './types';
import { sessionStore } from './stores/stores';
import express from 'express';
import { loginRouter } from './controllers/login';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ORIGIN,
    methods: ['GET', 'POST']
  }
});

app.use('/login', loginRouter);

// socket middleware, check if in sessionStore
// next type: err?: ExtendedError, idk if to include
io.use(async (socket: MangaSocket, next: (err?: any) => void) => {
  // check if existing sessionId
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const session = await sessionStore.findSession(sessionId);
    // check if session.username === handshake username???
    if (session) {
      socket.sessionId = sessionId;
      socket.username = session.username,
        socket.roomId = session.roomId

      // save to user store

      return next();
    }
  }

  // new user, no sessionId, only username
  const username = socket.handshake.auth.username;
  socket.sessionId = uuidv4();
  socket.username = username;
  socket.roomId = ''; // new user has no existing room to join

  // save to userstore

  next();
});

io.on('connection', (socket: MangaSocket) => {
  console.log(socket.id);
})

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})



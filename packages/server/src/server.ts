import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { PORT, ORIGIN } from './utils/env';
import { MangaSocket, RoomResponse, Session } from './types';
import { sessionStore, roomStore, roomUserStore } from './stores/stores';
import express from 'express';
import cors from 'cors';
import * as Socket from './controllers/socket';

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

// socket middleware, check if in sessionStore
// next type: err?: ExtendedError, idk if to include
io.use(async (socket: MangaSocket, next: (err?: any) => void) => {
  console.log(socket.handshake);
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
});

const { createRoom, joinRoom, leaveRoom, disconnect } = Socket.default(io);

io.on('connection', async (socket: MangaSocket) => {
  console.log(`${socket.username} connected`);
  // check if their last room is still active
  let roomId = socket.roomId;
  if (!await roomStore.findRoom(socket.roomId)) {
    roomId = ''; // room doesnt exist
  }

  // save session
  sessionStore.saveSession(socket.sessionId, {
    username: socket.username,
    roomId: roomId
  });

  // emit session details to user
  socket.emit('SESSION', {
    username: socket.username,
    sessionId: socket.sessionId,
    roomId: socket.roomId
  });

  socket.on('CREATE_ROOM', createRoom);
  socket.on('JOIN_ROOM', joinRoom);
  socket.on('LEAVE_ROOM', leaveRoom);
  socket.on('disconnect', disconnect);

  // socket.io automatically removes empty rooms, remove from our store too
  io.of('/').adapter.on('delete-room', (room: string) => {
    roomStore.removeRoom(room);
    // remove room from room users store
    roomUserStore.removeRoom(room);
  });

});

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});



import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { PORT, ORIGIN } from './utils/env';
import { JoinRoomRequest, MangaSocket, RoomRequest, RoomResponse, Session } from './types';
import { sessionStore, roomStore, roomUserStore } from './stores/stores';
import express from 'express';
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

  socket.on('CREATE_ROOM', async ({ sessionId }: RoomRequest, cb: (res: RoomResponse) => void) => {
    // create 6 digit room id
    const roomId: string = Math.floor(100000 + Math.random() * 900000).toString();

    // save to room store with ownerId as sessionId
    roomStore.saveRoom(roomId, sessionId);

    // update session
    const session: Session = await sessionStore.findSession(sessionId);
    sessionStore.saveSession(sessionId, {
      ...session,
      roomId: roomId
    });

    // save to room users store
    roomUserStore.saveRoomUser(roomId, sessionId);

    // join room 
    socket.join(roomId);

    // send roomId back to user
    cb({
      success: true,
      roomId: roomId
    });
  });

  socket.on('JOIN_ROOM', async ({ sessionId, roomId }: JoinRoomRequest, cb: (res: RoomResponse) => void) => {
    // check if room exists
    const room: number = await roomStore.findRoom(roomId);
    if (room) {
      // update session
      const session: Session = await sessionStore.findSession(sessionId);
      sessionStore.saveSession(sessionId, {
        ...session,
        roomId: roomId
      });

      // save to room users store
      roomUserStore.saveRoomUser(roomId, sessionId);

      // emit to room that user joined

      cb({
        success: true,
        roomId: roomId
      });
    } else {
      cb({
        success: false,
        roomId: ''
      });
    }
  });

  socket.on('disconnect', async () => {
    console.log(`Bye ${socket.username}`);

    // if user was in room, remove from room and emit to room
    const session = await sessionStore.findSession(socket.sessionId);
    // pretty sure session.roomId is either always valid or '' by this point
    if (session.roomId) {
      roomUserStore.removeRoomUser(session.roomId, socket.sessionId);
      // emit to room that user left
      // io.to(roomid)
    }
  });

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



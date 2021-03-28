import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { PORT, ORIGIN } from './utils/env';
import { MangaSocket, RoomResponse, Session } from './types';
import { sessionStore, roomStore, roomUserStore, publicRoomStore } from './stores/stores';
import express from 'express';
import cors from 'cors';
import * as Socket from './controllers/socket';
import { socketMiddleware } from './controllers/socketMiddleware';

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
io.use(socketMiddleware);

const { onLogin, createRoom, joinRoom, leaveRoom, newRoom, newRoomDetails, getRooms, message, ready, disconnect } = Socket.default(io);

io.on('connection', async (socket: MangaSocket) => {
  // emit session details to user
  socket.on('SESSION', onLogin);

  socket.on('CREATE_ROOM', createRoom);
  socket.on('JOIN_ROOM', joinRoom);
  socket.on('LEAVE_ROOM', leaveRoom);
  socket.on('NEW_ROOM', newRoom);
  socket.on('NEW_ROOM_DETAILS', newRoomDetails);
  socket.on('GET_ROOMS', getRooms);
  socket.on('MESSAGE', message);
  socket.on('USER_READY', ready);
  socket.on('disconnect', disconnect);

  // socket.io automatically removes empty rooms, remove from our store too
  io.of('/').adapter.on('delete-room', (room: string) => {
    // TODO? will also try to remove personal rooms, change this?
    roomStore.removeRoom(room);
    // remove room from room users store
    roomUserStore.removeRoom(room);
    publicRoomStore.removeRoom(room);
  });

});

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

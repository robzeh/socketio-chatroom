import { redis, roomStore, roomUserStore, sessionStore } from '../stores/stores';
import * as Socket from '../controllers/socket';

import { createServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { AddressInfo } from 'net';
import { MangaSocket, RoomResponse, Session } from '../types';
import { socketMiddleware } from '../controllers/socketMiddleware';

// TODO: Refactor setup to be similar to middleware.test.ts

describe('server socket functions', () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket, clientSocket2: ClientSocket, roomId: string, PORT: number;

  beforeAll((done) => {
    redis.flushall();
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      PORT = port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    clientSocket2.close();
    redis.quit();
  });

  test('client creates room and server acknowledges', (done) => {
    const { createRoom } = Socket.default(io);
    serverSocket.on('CREATE_ROOM', createRoom);

    clientSocket.emit('CREATE_ROOM', '123', (cb: RoomResponse) => {
      roomId = cb.roomId;
      expect(cb.success).toBe(true);
      expect(cb.roomId).toHaveLength(6); // 6 digit room code
      done();
    });

  });

  test('redis stores after create room', async () => {
    // check room store
    const roomExists: number = await roomStore.findRoom(roomId);
    const roomOwner: string[] = await roomStore.getRoomOwner(roomId);
    expect(roomExists).toBe(1);
    expect(roomOwner).toEqual(['123']);

    // room user store
    const roomUserExists: number = await roomUserStore.isRoomUser(roomId, '123');
    expect(roomUserExists).toBe(1);

    // check updated session
    const updatedSession: Session = await sessionStore.findSession('123');
    expect(updatedSession.roomId).toBe(roomId);

    // TODO: Clarify this case
    // expect(serverSocket.rooms).toEqual(new Set([clientSocket.id, roomId]));

  });

  test('another user can connect', (done) => {
    clientSocket2 = Client(`http://localhost:${PORT}`);
    clientSocket2.on('connect', done);
  });

  test('another user can join room', (done) => {
    const { joinRoom } = Socket.default(io);
    serverSocket.on('JOIN_ROOM', joinRoom);


    clientSocket2.emit('JOIN_ROOM', '789', roomId, (cb: RoomResponse) => {
      expect(cb.success).toBe(true);
      expect(cb.roomId).toBe(roomId);
      done();
    });
  });

  test('redis stores after join room', async () => {
    // user is part of room user store
    const roomUserExists: number = await roomUserStore.isRoomUser(roomId, '789');
    expect(roomUserExists).toBe(1);

    // room users
    const roomUsers: string[] = await roomUserStore.getAllRoomUsers(roomId);
    expect(roomUsers).toEqual(['123', '789']);

    // TODO: clarify this case
    // expect(serverSocket.rooms).toEqual(new Set([clientSocket2.id, roomId]));

    // check session
    const user: Session = await sessionStore.findSession('789');
    expect(user.roomId).toBe(roomId);

  });

  test('user can leave room', (done) => {
    const { leaveRoom } = Socket.default(io);
    serverSocket.on('LEAVE_ROOM', leaveRoom);

    clientSocket2.emit('LEAVE_ROOM', '789', (cb: RoomResponse) => {
      expect(cb.success).toBe(true);
      expect(cb.roomId).toBe('');
      done();
    });

  });

  test('redis stores after leave room', async () => {
    const roomUserLeft: number = await roomUserStore.isRoomUser(roomId, '789');
    expect(roomUserLeft).toBe(0);

    const roomUsers: string[] = await roomUserStore.getAllRoomUsers(roomId);
    expect(roomUsers).toEqual(['123']);

    // check session
    const userLeftSession: Session = await sessionStore.findSession('789');
    expect(userLeftSession.roomId).toBe('');

  })

});
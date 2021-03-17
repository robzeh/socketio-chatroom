import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { redis, roomStore, sessionStore } from '../stores/stores';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { socketMiddleware } from '../controllers/socketMiddleware';
import { MangaSocket, Session } from '../types';
import * as Socket from '../controllers/socket';

describe('socket middleware', () => {
  let io: Server, serverSocket: MangaSocket, clientSocket: ClientSocket, PORT: number;

  afterAll(() => {
    redis.quit();
  });

  describe('new user', () => {

    beforeAll((done) => {
      redis.flushall();

      const httpServer = createServer();
      io = new Server(httpServer);
      io.use(socketMiddleware);

      httpServer.listen(() => {
        const { onLogin } = Socket.default(io);
        const { port } = httpServer.address() as AddressInfo;
        PORT = port;
        io.on('connection', (socket) => {
          serverSocket = socket;
          // onLogin saves details to session store after middleware assigns them
          serverSocket.on('SESSION', onLogin);
        });

        // a new user will only have username
        clientSocket = Client(
          `http://localhost:${PORT}`,
          {
            auth: {
              username: 'robie',
              sessionId: '',
              roomId: ''
            },
            forceNew: true
          }
        );
        clientSocket.on('connect', () => {
          // tell session store to save user data
          clientSocket.emit('SESSION', () => {
            done();
          })
        });
      })

    });

    afterAll(() => {
      io.close();
      clientSocket.close();
    });

    test('socket and store data', async () => {
      expect(serverSocket.username).toBe('robie');
      expect(serverSocket.sessionId).toHaveLength(36); // uuid is 36
      expect(serverSocket.roomId).toBe('');

      const res: Session = await sessionStore.findSession(serverSocket.sessionId);
      expect(res.username).toBe('robie');
      expect(res.roomId).toBe('')
    });
  });

  describe('returning user', () => {

    beforeAll((done) => {
      redis.flushall();

      // emulate returning user
      sessionStore.saveSession('123', {
        username: 'robie',
        roomId: ''
      });
      const httpServer = createServer();
      io = new Server(httpServer);
      io.use(socketMiddleware);

      httpServer.listen(() => {
        const { onLogin } = Socket.default(io);
        const { port } = httpServer.address() as AddressInfo;
        PORT = port;
        io.use(socketMiddleware);
        io.on('connection', (socket) => {
          serverSocket = socket;
          // onLogin saves details to session store after middleware assigns them
          serverSocket.on('SESSION', onLogin);
        });

        // emulate returning user by sending exisitng session id
        clientSocket = Client(
          `http://localhost:${PORT}`,
          {
            auth: {
              username: '',
              sessionId: '123',
              roomId: ''
            },
            forceNew: true
          }
        );
        clientSocket.on('connect', () => {
          clientSocket.emit('SESSION', () => {
            done();
          });
        });
      })
    });

    afterAll(() => {
      io.close();
      clientSocket.close();
    });

    test('socket and store data', async () => {
      expect(serverSocket.username).toBe('robie');
      expect(serverSocket.sessionId).toBe('123');
      expect(serverSocket.roomId).toBe('');

      const res: Session = await sessionStore.findSession('123');
      expect(res.username).toBe('robie');
      expect(res.roomId).toBe('')

    });
  });

  describe('returning user with room', () => {

    beforeAll((done) => {
      redis.flushall();

      // emulate returning users session data
      sessionStore.saveSession('123', {
        username: 'robie',
        roomId: 'room'
      });

      // also save to room store, or else onLogin will think the room doesnt exist
      roomStore.saveRoom('room', '123');

      const httpServer = createServer();
      io = new Server(httpServer);
      io.use(socketMiddleware);

      httpServer.listen(() => {
        const { onLogin } = Socket.default(io);
        const { port } = httpServer.address() as AddressInfo;
        PORT = port;
        io.use(socketMiddleware);
        io.on('connection', (socket) => {
          serverSocket = socket;
          // onLogin saves details to session store after middleware assigns them
          serverSocket.on('SESSION', onLogin);
        });

        // emulate returning user by sending exisitng session id
        clientSocket = Client(
          `http://localhost:${PORT}`,
          {
            auth: {
              username: '',
              sessionId: '123',
              roomId: ''
            },
            forceNew: true
          }
        );
        clientSocket.on('connect', () => {
          clientSocket.emit('SESSION', () => {
            done();
          });
        });
      })
    })

    afterAll(() => {
      io.close();
      clientSocket.close();
    });

    test('socket and store data', async () => {
      expect(serverSocket.username).toBe('robie');
      expect(serverSocket.sessionId).toBe('123');
      expect(serverSocket.roomId).toBe('room');

      const res: Session = await sessionStore.findSession('123');
      expect(res.username).toBe('robie');
      expect(res.roomId).toBe('room');

      const roomRes: string[] = await roomStore.getRoomOwner('room');
      expect(roomRes).toEqual(['123']);
    });

  });
});

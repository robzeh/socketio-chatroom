import { session } from '../controllers/socket';
import { roomUserStore } from '../stores/stores';

const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("my awesome project", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("session", (done) => {
    clientSocket.on('SESSION', (arg) => {
      expect(arg).toStrictEqual({
        username: '',
        sessionId: '',
        roomId: ''
      });
      done();
    });
    serverSocket.emit('SESSION', {
      username: '',
      sessionId: '',
      roomId: ''
    });
  })

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (data: string, cb) => {
      expect(data).toBe("test");
      cb("hola");
    });
    clientSocket.emit("hi", "test", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  //  test('create room', (done) => {
  //    const { createOrder } = require('../controllers/socket')(io);
  //    serverSocket.on('CREATE_ROOM', (createOrder) => {
  //      createOrder(213);
  //    })
  //
  //    clientSocket.emit('CREATE_ROOM', (data) => {
  //      expect(data).toBe({
  //        success: false,
  //        roomId: ''
  //      });
  //      done();
  //    });
  //  });
  //
});
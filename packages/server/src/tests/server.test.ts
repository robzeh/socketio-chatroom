import { roomUserStore } from '../stores/stores';
import * as Socket from '../controllers/socket';

import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import express from 'express';

describe('test', () => {

  test('will it work?', async (done) => {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);

    const { createRoom, joinRoom, leaveRoom } = Socket.default(io);

    io.on('connection', async (socket) => {
      console.log(socket)

      socket.on('CREATE_ROOM', createRoom);
      socket.on('JOIN_ROOM', joinRoom);
      socket.on('LEAVE_ROOM', leaveRoom);
    })

    httpServer.listen(4000);

    const clientSocket = Client('http://localhost:4000', {
      auth: {
        username: 'robie',
        sessionId: '000',
        roomId: ''
      }
    });

    io.close();
    clientSocket.close();

    done()

  })

  //test('test', (done) => {
  //  const httpServer = createServer();
  //  const io = new Server(httpServer);

  //  const { createRoom, joinRoom } = Socket.default(io)
  //  //const { createRoom } = require('../controllers/socket')(io);
  //  //const { joinRoom } = require('../controllers/socket')(io);

  //  const onConnection = (socket) => {
  //    socket.on('CREATE_ROOM', createRoom);
  //    socket.on('JOIN_ROOM', joinRoom);
  //  };

  //  httpServer.listen(() => {
  //    const port = httpServer.address().port;
  //    const clientSocket = Client(`http://localhost:${port}`);
  //    io.on('connection', onConnection);

  //    let id;
  //    clientSocket.emit('CREATE_ROOM', '123', (res) => {
  //      id = res.roomId;
  //      expect(res.roomId).toHaveLength(6);
  //    })

  //    io.close();
  //    clientSocket.close();

  //  });

  //  done();
  //});

});

//describe("my awesome project", () => {
//  let io, serverSocket, clientSocket;
//
//  beforeAll((done) => {
//    const httpServer = createServer();
//    io = new Server(httpServer);
//    httpServer.listen(() => {
//      const port = httpServer.address().port;
//      clientSocket = new Client(`http://localhost:${port}`);
//      io.on("connection", (socket) => {
//        serverSocket = socket;
//      });
//      clientSocket.on("connect", done);
//    });
//  });
//
//  afterAll(() => {
//    io.close();
//    clientSocket.close();
//  });
//
//  test("should work", (done) => {
//    clientSocket.on("hello", (arg) => {
//      expect(arg).toBe("world");
//      done();
//    });
//    serverSocket.emit("hello", "world");
//  });
//
//  test("session", (done) => {
//    clientSocket.on('SESSION', (arg) => {
//      expect(arg).toStrictEqual({
//        username: '',
//        sessionId: '',
//        roomId: ''
//      });
//      done();
//    });
//    serverSocket.emit('SESSION', {
//      username: '',
//      sessionId: '',
//      roomId: ''
//    });
//  })
//
//  test("should work (with ack)", (done) => {
//    serverSocket.on("hi", (data: string, cb) => {
//      expect(data).toBe("test");
//      cb("hola");
//    });
//    clientSocket.emit("hi", "test", (arg) => {
//      expect(arg).toBe("hola");
//      done();
//    });
//  });
//});

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
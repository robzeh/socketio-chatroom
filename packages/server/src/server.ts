import { createServer } from 'http';
import { Server } from 'socket.io';
import { PORT, ORIGIN } from './utils/env';
import { MangaSocket } from './types';
import express from 'express';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ORIGIN,
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket: MangaSocket) => {
  console.log(socket.id);
})

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})



import { createServer } from 'http';
import express from 'express';

const app = express();
const httpServer = createServer(app);

httpServer.listen(4000, () => {
  console.log('listening on 4000');
})



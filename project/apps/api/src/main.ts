import * as express from 'express';
import { Message } from '@project/api-interfaces';
const { createServer } = require('http');
const { Server } = require('socket.io');

// Express server
const app = express();
const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);

// io Server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on('connection', (socket) => {
  // ...
});
httpServer.listen(3000);

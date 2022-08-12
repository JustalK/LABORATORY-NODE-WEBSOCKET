const { createServer } = require('http');
const { Server } = require('socket.io');

const port = process.env.port || 3333;

// io Server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // Join a room
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on('NEW_CHAT_MESSAGE_EVENT', (data) => {
    io.in(roomId).emit('NEW_CHAT_MESSAGE_EVENT', data);
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId);
  });
});

httpServer.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});

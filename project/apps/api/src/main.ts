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
  // Once the client is connected, he can join a room
  socket.on('join', function (roomId) {
    socket.join(roomId);
  });

  // Listen for new messages
  socket.on('NEW_CHAT_MESSAGE_EVENT', (data) => {
    const [, roomId] = socket.rooms;
    //socket.rooms.has("room1");
    io.in(roomId).emit('NEW_CHAT_MESSAGE_EVENT', data);
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    //socket.leave(roomId);
  });
});

httpServer.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});

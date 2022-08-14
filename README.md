# LABORATORY-NODE-WEBSOCKET

![Alt text](./Documentation/graph.jpg?raw=true "Documentation")

This project has been created using **Socket.io**, **React** and **NX**. The goal was to create an example explaining how to use the socket for creating multiple chat room.

## Plan of the presentation

I explain with all the details how I build the project and my way of working.

- [Development](#development)
- [Running](#Running)

## Development

#### API

There is not too much to be said on the API since everything is available in a single file `main.ts`.

The most important part is the event management of the socket:

```js
io.on("connection", (socket) => {
  socket.on("join", function (roomId) {
    socket.join(roomId);
  });

  socket.on("NEW_CHAT_MESSAGE_EVENT", (data) => {
    const [, roomId] = socket.rooms;
    io.in(roomId).emit("NEW_CHAT_MESSAGE_EVENT", data);
  });

  socket.on("disconnect", () => {
    const [, roomId] = socket.rooms;
    socket.leave(roomId);
  });
});
```

The code describes the action to do based on event triggered by the front.

When a new user connect, we invite him to join a room with the `join` event.

When a message is sent, we send the message to the room so every user connected to the same room receive it. This is the event `NEW_CHAT_MESSAGE_EVENT`.

Last event describe here apply when the user is disconnecting from a room.

#### FRONT

## Running

For running the application, a single command can run everything since the backend and the frontend are all contain in a monorepository:

```bash
$ nx run-many --parallel --target=serve --projects=api,chat
```

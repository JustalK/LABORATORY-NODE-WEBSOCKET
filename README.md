# LABORATORY-NODE-WEBSOCKET

![Alt text](./Documentation/graph.jpg?raw=true "Documentation")

This project has been created using **Socket.io**, **React** and **NX**. The goal was to create an example explaining how to use the socket for creating multiple chat room.

The image above resume the project quite well. A single react app is running and is connecting to a websocket server. When the user enter a new room, it's created and anyone can join the room. An user can create as many room as he want and can also be the only one inside it. Once every user disconnect from a room, this one is destroyed.

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

For the front, we cut everything into 3 parts:

- A hook managing every interaction with the sockets
- The chatroom managing like the name suggest a chat room
- The join page inviting the user to enter the name of a chatroom

On the join page inside the component `Home` and the chatroom page inside the `ChatRoom` component, this is pretty basic react. For `Home`, we are just using the router of react for sending the user in the right room using the parameter in the url. And for the `ChatRoom` component, we are using the hook we created, so the only purpose of the page is to list the message and to link a button to the event in the hook. Nothing too complicated if we know a bit of React.

On the hook `useChat`, this is an other story. We are using Socket.io for managing what to show to the user and how to handle his action.

```js
const server = io(
  `http://${process.env["NX_SOCKET_SERVER_HOST"]}:${process.env["NX_SOCKET_SERVER_PORT"]}`
);
```

First part of the code is to connect to the socket.io server. The environment variable are inside the .env file of NX. It's easier that way for changing by example the value of the port for both app at the same time.

Now, everything will happen in the useEffect for not reloading unnecessarily the component.

```js
server.on("connect", () => {
  server.emit("join", roomId);
  setConnected(true);
});
```

This part of the code will make the user join the right room after he connects to the socket server. I am using the state of the connection for allowing or not the user to send message for avoiding errors.

```js
server.on("NEW_CHAT_MESSAGE_EVENT", ({ senderId, body }: Message) => {
  setMessages((messages: any) => [
    ...messages,
    {
      body,
      senderId,
      ownedByCurrentUser: senderId === server.id,
    },
  ]);
});
```

This part of the code is responsible for getting the message arriving to the socket. Once I receive a message, I change the state of the message for the user and give him the new state with the new messages.

```js
server.off("connect");
server.off("disconnect");
server.off("NEW_CHAT_MESSAGE_EVENT");
```

Upon disconnection, it's important to clean of the event properly.

```js
const sendMessage = (body: string) => {
  if (connected) {
    server.emit("NEW_CHAT_MESSAGE_EVENT", {
      body,
      senderId: server.id,
    });
  }
};
```

Finally, in case the user send a new message, we emit a new event for the api to catch it. The api will then emit the new message to everyone connected to the room.

## Running

For running the application, a single command can run everything since the backend and the frontend are all contain in a monorepository:

```bash
$ nx run-many --parallel --target=serve --projects=api,chat
```

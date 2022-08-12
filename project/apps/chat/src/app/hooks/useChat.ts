import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3333';

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<any>([]); // Sent and received messages
  const socketRef = useRef<any>();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    // Listens for incoming messages
    socketRef.current.on('NEW_CHAT_MESSAGE_EVENT', (message: any) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages: any) => [...messages, incomingMessage]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody: any) => {
    console.log(messageBody);
    socketRef.current.emit('NEW_CHAT_MESSAGE_EVENT', {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;

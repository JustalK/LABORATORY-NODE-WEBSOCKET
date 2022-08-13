import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3333';

// Creates a WebSocket connection
const server = io(SOCKET_SERVER_URL);

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<
    { body: string; senderId: string }[]
  >([]); // Sent and received messages
  const socketRef = useRef<any>();

  useEffect(() => {
    server.on('connect', () => {
      console.log('[CONNECTION]');
      server.emit('join', roomId);
    });

    server.on('NEW_CHAT_MESSAGE_EVENT', (message: { senderId: string }) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === server.id,
      };
      setMessages((messages: any) => [...messages, incomingMessage]);
    });

    return () => {
      //socketRef.current.off('connect');
      //socketRef.current.off('disconnect');
      //socketRef.current.off('NEW_CHAT_MESSAGE_EVENT');
    };
  }, [roomId]);

  const sendMessage = (messageBody: string) => {
    server.emit('NEW_CHAT_MESSAGE_EVENT', {
      body: messageBody,
      senderId: server.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;

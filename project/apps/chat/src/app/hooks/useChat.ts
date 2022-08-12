import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3333';

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<
    { body: string; senderId: string }[]
  >([]); // Sent and received messages
  const socketRef = useRef<any>();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on('connect', () => {
      console.log('[CONNECTION]');
    });

    socketRef.current.on(
      'NEW_CHAT_MESSAGE_EVENT',
      (message: { senderId: string }) => {
        const incomingMessage = {
          ...message,
          ownedByCurrentUser: message.senderId === socketRef.current.id,
        };
        setMessages((messages: any) => [...messages, incomingMessage]);
      }
    );

    return () => {
      socketRef.current.off('connect');
      socketRef.current.off('disconnect');
      socketRef.current.off('NEW_CHAT_MESSAGE_EVENT');
    };
  }, [roomId]);

  const sendMessage = (messageBody: string) => {
    socketRef.current.emit('NEW_CHAT_MESSAGE_EVENT', {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;

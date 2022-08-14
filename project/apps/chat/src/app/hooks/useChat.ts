import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Message } from '@project/messages';

// Creates a WebSocket connection
const server = io(
  `http://${process.env['NX_SOCKET_SERVER_HOST']}:${process.env['NX_SOCKET_SERVER_PORT']}`
);

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    server.on('connect', () => {
      server.emit('join', roomId);
    });

    server.on('NEW_CHAT_MESSAGE_EVENT', (message: Message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === server.id,
      };
      setMessages((messages: any) => [...messages, incomingMessage]);
    });

    return () => {
      server.off('connect');
      server.off('disconnect');
      server.off('NEW_CHAT_MESSAGE_EVENT');
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

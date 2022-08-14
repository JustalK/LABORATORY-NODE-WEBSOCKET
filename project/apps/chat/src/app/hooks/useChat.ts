import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Message } from '@project/messages';

const server = io(
  `http://${process.env['NX_SOCKET_SERVER_HOST']}:${process.env['NX_SOCKET_SERVER_PORT']}`
);

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState<Boolean>(false);

  useEffect(() => {
    server.on('connect', () => {
      server.emit('join', roomId);
      setConnected(true);
    });

    server.on('NEW_CHAT_MESSAGE_EVENT', ({ senderId, body }: Message) => {
      setMessages((messages: any) => [
        ...messages,
        {
          body,
          senderId,
          ownedByCurrentUser: senderId === server.id,
        },
      ]);
    });

    return () => {
      server.off('connect');
      server.off('disconnect');
      server.off('NEW_CHAT_MESSAGE_EVENT');
    };
  }, [roomId]);

  const sendMessage = (body: string) => {
    if (connected) {
      server.emit('NEW_CHAT_MESSAGE_EVENT', {
        body,
        senderId: server.id,
      });
    }
  };

  return { messages, sendMessage };
};

export default useChat;

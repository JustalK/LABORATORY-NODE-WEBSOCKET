import React from 'react';
import useChat from '../hooks/useChat';
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const { roomId } = useParams();
  const { messages, sendMessage } = useChat(roomId as string);
  const [newMessage, setNewMessage] = React.useState('');

  const handleNewMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <ol>
        {messages.map(
          (message: { body: string; senderId: string }, i: number) => (
            <li key={i}>
              {message.senderId}: {message.body}
            </li>
          )
        )}
      </ol>
      <div>
        <textarea value={newMessage} onChange={handleNewMessageChange} />
      </div>
      <div>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;

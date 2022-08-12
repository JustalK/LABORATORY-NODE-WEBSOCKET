import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [roomName, setRoomName] = React.useState('');

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  return (
    <div>
      <input type="text" value={roomName} onChange={handleRoomNameChange} />
      <Link to={`/${roomName}`}>Join room</Link>
    </div>
  );
};

export default Home;

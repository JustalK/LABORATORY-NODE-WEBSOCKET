import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [roomName, setRoomName] = React.useState('');

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  return (
    <div>
      <div>
        <input type="text" value={roomName} onChange={handleRoomNameChange} />
      </div>
      <div>
        <Link to={`/${roomName}`}>Join room</Link>
      </div>
    </div>
  );
};

export default Home;

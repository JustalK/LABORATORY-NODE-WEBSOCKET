import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import ChatRoom from './ChatRoom/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;

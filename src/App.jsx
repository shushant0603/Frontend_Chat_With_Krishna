import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import ChatPage from './components/ChatPage'
import Home from './pages/home/Home'
import AudioPlayer from './components/AudioPlayer'
import { ChatProvider } from './context/ChatContext'

function App() {
  useEffect(() => {
    const clearMessages = async () => {
      try {
        await axios.delete("http://localhost:3000/api/messages"); // your API
        console.log("Messages cleared on refresh");
      } catch (err) {
        console.error("Failed to clear messages", err);
      }
    };
  
    clearMessages();
  }, []);
  return (
    <ChatProvider>
    <Router>
     {/* <AudioPlayer/> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* catch-all */}
      </Routes>
    </Router>
    </ChatProvider>
  )
}

export default App
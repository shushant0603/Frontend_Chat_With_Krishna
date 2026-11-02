import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import ChatPage from './components/ChatPage'
import Home from './pages/home/Home'
import { ChatProvider } from './context/ChatContext'
import { Navigate } from 'react-router-dom'
import GitaLibrary from './pages/gita/GitaLibrary'

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/gita' element={<GitaLibrary />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ChatProvider>
  )
}

export default App

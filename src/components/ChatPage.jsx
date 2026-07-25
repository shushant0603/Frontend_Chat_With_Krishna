import React, { useState,useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import {ChatContext} from '../context/ChatContext'
import { apiUrl } from '../config/api';

import ReactMarkdown from 'react-markdown'; // <-- Yeh naya import
import remarkGfm from 'remark-gfm';
const ChatPage = () => {
    const navigate = useNavigate();
  const { messages, setMessages } = useContext(ChatContext);
    // const [newMessage, setNewMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
const speak = async (text) => {

  try {

    const response = await fetch(
      apiUrl('/tts'),
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text,
        }),
      }
    );

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);

    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(url);
    };

  } catch (err) {

    console.log(err);

  }

};
  
const onClick = () => {
  console.log("clicked");
    navigate('/') ;
    
  }
useEffect(() => {

  // Agar pehle se messages hain to greeting mat dikhao
  if (messages.length > 0) return;

  setIsTyping(true);

  const timer = setTimeout(() => {

    setMessages([
      {
        id: 1,
        sender: "krishna",
        text: "बोलो पार्थ, मैं तुम्हारे रथ का सारथी हूँ। कहो, तुम्हें कहाँ लेकर चलना है?"
      },
      {
        id: 2,
        sender: "krishna",
        text: "जो भी तुम्हारे मन में है, वह कहो। मैं सुनने के लिए तैयार हूँ।"
      }
    ]);

    setIsTyping(false);

  }, 1500);

  return () => clearTimeout(timer);

}, [messages.length, setMessages]);



useEffect(() => {
  scrollToBottom();
}, [messages]);
const sendMessage = async (e) => {

  e.preventDefault();

  if (!inputMessage.trim()) return;

  const userMsg = {
    id: Date.now(),
    sender: "user",
    text: inputMessage,
  };

  // User message UI me dikhao
  setMessages((prev) => [...prev, userMsg]);

  setInputMessage("");

  setIsTyping(true);

  try {

    const response = await fetch(apiUrl('/chat'), {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

    body: JSON.stringify({
  question: userMsg.text,
  chat_history: [
    ...messages,
    userMsg,
  ].map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  })),
}),

    });

    // Agar backend error de
    if (!response.ok) {
      throw new Error("Failed to fetch response");
    }

    const data = await response.json();

    const botReply = {
      id: Date.now() + 1,
      sender: "krishna",
      text: data.answer,
    };
     
    setMessages((prev) => [...prev, botReply]);
    await speak(botReply.text);

  } catch (err) {

    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "krishna",
        text: "⚠️ Something went wrong."
      }
    ]);

  } finally {

    setIsTyping(false);

  }

};
// setMessages((prev) => [...prev, botReply]);

// }
  

  return (
    <div className="flex flex-col bg-[#FCEEDC] h-screen w-screen bg-peach font-poppins">
      
      {/* Header with back button */}
      <header className="flex justify-between items-center z-20 px-6 py-4 bg-white/50 backdrop-blur-md shadow-md">
        <h1 className="font-playfair text-3xl font-bold text-gray-800 tracking-wide">
          KRISHNA
        </h1>
        {/* Back button with elegant icon */}
        <button 
          onClick={onClick} 
          className="p-2 rounded-full  text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </header>

      {/* Main Conversation Area with faded background leaves */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4 relative">
        {/* Faded background leaves for thematic consistency */}
        <div className="fixed inset-0 z-0 bg-contain bg-no-repeat bg-left opacity-10" 
             style={{ backgroundImage: `url('banana.png')` }}>
        </div>
        {/* Middle Image */}
  <img 
    src="peapock.png" 
    alt="Middle Image" 
    className="fixed inset-0 m-auto opacity-80 bg-repeat"
  />
        <div className="fixed inset-0 z-0 right-0 bg-contain bg-no-repeat  bg-right opacity-10"
        //  className='absolute right-0 opacity-0.5 bottom-0 transform scale-x-[-1] w-[250px] h-full right-image' 
             style={{ backgroundImage: `url('bananaR.png')` }}>
        </div>
        
        <div className="relative z-10 flex flex-col space-y-4">
  {messages.map((message, index) => (
    <div 
      key={index} 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-xs md:max-w-md p-4 rounded-3xl shadow-sm ${
          message.sender === 'user' 
            ? 'bg-green-200  text-gray-800' 
            : 'bg-blue-200 text-gray-800'
        }`}
      >
        {/* Label on top inside the message box */}
        <p
  className={`text-sm font-semibold mb-1 ${
    message.sender === 'user' ? 'text-blue-600' : 'text-green-600'
  }`}
>
  {message.sender === 'user' ? 'You' : 'Krishna'}
</p>
       {/* Yahan change karo */}
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
      </div>
      <div ref={messagesEndRef} />
    </div>
  ))}
  {/* Typing Indicator */}
{isTyping && (
  <div className="flex justify-start">
    <div className="max-w-xs md:max-w-md p-4 rounded-3xl shadow-sm bg-blue-100 text-gray-700 italic">
      🕉️ Typing....
    </div>
  </div>
)}
</div>

      </div>
      
      {/* Message Input Form */}
      <form onSubmit={sendMessage} className="p-4 bg-white/70 backdrop-blur-md shadow-inner flex items-center gap-4">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Speak your heart..." 
          className="flex-grow p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-krishnaGold"
        />
        <button 
          type="submit"
          className="bg-krishnaGold text-gray-800 bg-yellow-400 font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-400 disabled:opacity-50"
          disabled={!inputMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
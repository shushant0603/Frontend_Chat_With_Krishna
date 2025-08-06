import { createContext, useState } from "react";

// 1. Create context
export const ChatContext = createContext();

// 2. Create provider
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

// 3. Export hook
// export const useChat = () => useContext(ChatContext);

import React, { useState, useRef, useEffect } from 'react';

function ChatInterface({ onNewActivity, username, setUsername }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      handleNewMessage("Hello! I'm your personal productivity assistant. What would you like to do today?", 'assistant');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    handleNewMessage(input, 'user');
    setInput('');

    const response = await onNewActivity(input);
    handleNewMessage(response, 'assistant');
  };

  const handleNewMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  return (
    <div className="chat-interface flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 p-4" style={{ height: 'calc(100vh - 200px)' }}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'}`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your activity..."
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;

